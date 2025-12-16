import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/webhooks/clerk/route";
import * as supabaseLib from "@/lib/supabase";
import { Webhook } from "svix";

vi.mock("svix");
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));
vi.mock("@/lib/supabase", async () => {
  const actual = await vi.importActual("@/lib/supabase");
  return {
    ...actual,
    createUser: vi.fn(),
    getUserByClerkId: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  };
});
vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

const TEST_CLERK_USER_ID = "user_test_123";
const TEST_EMAIL = "test@example.com";
const TEST_USER = {
  id: "db_user_123",
  clerk_user_id: TEST_CLERK_USER_ID,
  email: TEST_EMAIL,
  credits: 1,
  name: "Test User",
  profile_image_url: "https://example.com/avatar.jpg",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

async function createMockRequest(
  body: string,
  svixHeaders: Record<string, string>
): Promise<Request> {
  return new Request("http://localhost:3000/api/webhooks/clerk", {
    method: "POST",
    headers: {
      "svix-id": svixHeaders["svix-id"] || "msg_test",
      "svix-timestamp": svixHeaders["svix-timestamp"] || "1234567890",
      "svix-signature": svixHeaders["svix-signature"] || "v1,test_signature",
      ...svixHeaders,
    },
    body,
  });
}

describe("Clerk Webhook Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/webhooks/clerk", () => {
    it("should reject request without svix headers", async () => {
      const { headers } = await import("next/headers");
      vi.mocked(headers).mockResolvedValue(new Map());

      const request = new Request(
        "http://localhost:3000/api/webhooks/clerk",
        {
          method: "POST",
          body: JSON.stringify({}),
        }
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Missing svix headers");
    });

    it("should reject request with invalid signature", async () => {
      const { headers } = await import("next/headers");
      vi.mocked(headers).mockResolvedValue(
        new Map([
          ["svix-id", "msg_test"],
          ["svix-timestamp", "1234567890"],
          ["svix-signature", "v1,invalid"],
        ])
      );

      const mockWebhook = vi.mocked(Webhook).mock.instances[0] || {};
      const mockVerify = vi
        .fn()
        .mockImplementation(() => {
          throw new Error("Invalid signature");
        });
      vi.mocked(Webhook).mockImplementation(() => ({
        verify: mockVerify,
      } as any));

      const request = await createMockRequest(
        JSON.stringify({ type: "user.created" }),
        {
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,invalid",
        }
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    describe("user.created event", () => {
      it("should create new user with metadata", async () => {
        const { headers } = await import("next/headers");
        vi.mocked(headers).mockResolvedValue(
          new Map([
            ["svix-id", "msg_test"],
            ["svix-timestamp", "1234567890"],
            ["svix-signature", "v1,test"],
          ])
        );

        const eventPayload = {
          type: "user.created",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: TEST_EMAIL }],
            first_name: "Test",
            last_name: "User",
            image_url: "https://example.com/avatar.jpg",
          },
        };

        const mockVerify = vi.fn().mockReturnValue(eventPayload);
        vi.mocked(Webhook).mockImplementation(() => ({
          verify: mockVerify,
        } as any));

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(null);
        vi.mocked(supabaseLib.createUser).mockResolvedValue(TEST_USER as any);
        vi.mocked(supabaseLib.updateUser).mockResolvedValue(TEST_USER as any);

        const request = await createMockRequest(
          JSON.stringify(eventPayload),
          {
            "svix-id": "msg_test",
            "svix-timestamp": "1234567890",
            "svix-signature": "v1,test",
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(200);
        expect(supabaseLib.createUser).toHaveBeenCalledWith(
          TEST_CLERK_USER_ID,
          TEST_EMAIL,
          1
        );
        expect(supabaseLib.updateUser).toHaveBeenCalledWith(
          TEST_CLERK_USER_ID,
          expect.objectContaining({
            name: "Test User",
            profileImageUrl: "https://example.com/avatar.jpg",
          })
        );
      });

      it("should skip creation if user already exists", async () => {
        const { headers } = await import("next/headers");
        vi.mocked(headers).mockResolvedValue(
          new Map([
            ["svix-id", "msg_test"],
            ["svix-timestamp", "1234567890"],
            ["svix-signature", "v1,test"],
          ])
        );

        const eventPayload = {
          type: "user.created",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: TEST_EMAIL }],
          },
        };

        const mockVerify = vi.fn().mockReturnValue(eventPayload);
        vi.mocked(Webhook).mockImplementation(() => ({
          verify: mockVerify,
        } as any));

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(
          TEST_USER as any
        );

        const request = await createMockRequest(
          JSON.stringify(eventPayload),
          {
            "svix-id": "msg_test",
            "svix-timestamp": "1234567890",
            "svix-signature": "v1,test",
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(200);
        expect(supabaseLib.createUser).not.toHaveBeenCalled();
      });

      it("should return 400 if no email found", async () => {
        const { headers } = await import("next/headers");
        vi.mocked(headers).mockResolvedValue(
          new Map([
            ["svix-id", "msg_test"],
            ["svix-timestamp", "1234567890"],
            ["svix-signature", "v1,test"],
          ])
        );

        const eventPayload = {
          type: "user.created",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [],
          },
        };

        const mockVerify = vi.fn().mockReturnValue(eventPayload);
        vi.mocked(Webhook).mockImplementation(() => ({
          verify: mockVerify,
        } as any));

        const request = await createMockRequest(
          JSON.stringify(eventPayload),
          {
            "svix-id": "msg_test",
            "svix-timestamp": "1234567890",
            "svix-signature": "v1,test",
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(400);
        expect(await response.text()).toBe("No email found");
      });

      it("should handle creation error", async () => {
        const { headers } = await import("next/headers");
        vi.mocked(headers).mockResolvedValue(
          new Map([
            ["svix-id", "msg_test"],
            ["svix-timestamp", "1234567890"],
            ["svix-signature", "v1,test"],
          ])
        );

        const eventPayload = {
          type: "user.created",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: TEST_EMAIL }],
          },
        };

        const mockVerify = vi.fn().mockReturnValue(eventPayload);
        vi.mocked(Webhook).mockImplementation(() => ({
          verify: mockVerify,
        } as any));

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(null);
        vi.mocked(supabaseLib.createUser).mockResolvedValue(null);

        const request = await createMockRequest(
          JSON.stringify(eventPayload),
          {
            "svix-id": "msg_test",
            "svix-timestamp": "1234567890",
            "svix-signature": "v1,test",
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(500);
        expect(await response.text()).toBe("Error creating user");
      });
    });

    describe("user.updated event", () => {
      it("should update user email only", async () => {
        const { headers } = await import("next/headers");
        vi.mocked(headers).mockResolvedValue(
          new Map([
            ["svix-id", "msg_test"],
            ["svix-timestamp", "1234567890"],
            ["svix-signature", "v1,test"],
          ])
        );

        const newEmail = "newemail@example.com";
        const eventPayload = {
          type: "user.updated",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: newEmail }],
          },
        };

        const mockVerify = vi.fn().mockReturnValue(eventPayload);
        vi.mocked(Webhook).mockImplementation(() => ({
          verify: mockVerify,
        } as any));

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(
          TEST_USER as any
        );
        vi.mocked(supabaseLib.updateUser).mockResolvedValue({
          ...TEST_USER,
          email: newEmail,
        } as any);

        const request = await createMockRequest(
          JSON.stringify(eventPayload),
          {
            "svix-id": "msg_test",
            "svix-timestamp": "1234567890",
            "svix-signature": "v1,test",
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(200);
        expect(supabaseLib.updateUser).toHaveBeenCalledWith(
          TEST_CLERK_USER_ID,
          expect.objectContaining({ email: newEmail })
        );
      });

      it("should update user name and profile image", async () => {
        const { headers } = await import("next/headers");
        vi.mocked(headers).mockResolvedValue(
          new Map([
            ["svix-id", "msg_test"],
            ["svix-timestamp", "1234567890"],
            ["svix-signature", "v1,test"],
          ])
        );

        const eventPayload = {
          type: "user.updated",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: TEST_EMAIL }],
            first_name: "Updated",
            last_name: "Name",
            image_url: "https://example.com/newavatar.jpg",
          },
        };

        const mockVerify = vi.fn().mockReturnValue(eventPayload);
        vi.mocked(Webhook).mockImplementation(() => ({
          verify: mockVerify,
        } as any));

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(
          TEST_USER as any
        );
        vi.mocked(supabaseLib.updateUser).mockResolvedValue({
          ...TEST_USER,
          name: "Updated Name",
          profile_image_url: "https://example.com/newavatar.jpg",
        } as any);

        const request = await createMockRequest(
          JSON.stringify(eventPayload),
          {
            "svix-id": "msg_test",
            "svix-timestamp": "1234567890",
            "svix-signature": "v1,test",
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(200);
        expect(supabaseLib.updateUser).toHaveBeenCalledWith(
          TEST_CLERK_USER_ID,
          expect.objectContaining({
            name: "Updated Name",
            profileImageUrl: "https://example.com/newavatar.jpg",
          })
        );
      });

      it("should return 404 if user not found", async () => {
        const { headers } = await import("next/headers");
        vi.mocked(headers).mockResolvedValue(
          new Map([
            ["svix-id", "msg_test"],
            ["svix-timestamp", "1234567890"],
            ["svix-signature", "v1,test"],
          ])
        );

        const eventPayload = {
          type: "user.updated",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: TEST_EMAIL }],
          },
        };

        const mockVerify = vi.fn().mockReturnValue(eventPayload);
        vi.mocked(Webhook).mockImplementation(() => ({
          verify: mockVerify,
        } as any));

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(null);

        const request = await createMockRequest(
          JSON.stringify(eventPayload),
          {
            "svix-id": "msg_test",
            "svix-timestamp": "1234567890",
            "svix-signature": "v1,test",
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(404);
        expect(await response.text()).toBe("User not found");
      });

      it("should handle update error", async () => {
        const { headers } = await import("next/headers");
        vi.mocked(headers).mockResolvedValue(
          new Map([
            ["svix-id", "msg_test"],
            ["svix-timestamp", "1234567890"],
            ["svix-signature", "v1,test"],
          ])
        );

        const eventPayload = {
          type: "user.updated",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: TEST_EMAIL }],
            first_name: "Updated",
          },
        };

        const mockVerify = vi.fn().mockReturnValue(eventPayload);
        vi.mocked(Webhook).mockImplementation(() => ({
          verify: mockVerify,
        } as any));

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(
          TEST_USER as any
        );
        vi.mocked(supabaseLib.updateUser).mockResolvedValue(null);

        const request = await createMockRequest(
          JSON.stringify(eventPayload),
          {
            "svix-id": "msg_test",
            "svix-timestamp": "1234567890",
            "svix-signature": "v1,test",
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(500);
        expect(await response.text()).toBe("Error updating user");
      });
    });

    describe("user.deleted event", () => {
      it("should delete user successfully", async () => {
        const { headers } = await import("next/headers");
        vi.mocked(headers).mockResolvedValue(
          new Map([
            ["svix-id", "msg_test"],
            ["svix-timestamp", "1234567890"],
            ["svix-signature", "v1,test"],
          ])
        );

        const eventPayload = {
          type: "user.deleted",
          data: {
            id: TEST_CLERK_USER_ID,
          },
        };

        const mockVerify = vi.fn().mockReturnValue(eventPayload);
        vi.mocked(Webhook).mockImplementation(() => ({
          verify: mockVerify,
        } as any));

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(
          TEST_USER as any
        );
        vi.mocked(supabaseLib.deleteUser).mockResolvedValue(true);

        const request = await createMockRequest(
          JSON.stringify(eventPayload),
          {
            "svix-id": "msg_test",
            "svix-timestamp": "1234567890",
            "svix-signature": "v1,test",
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(200);
        expect(supabaseLib.deleteUser).toHaveBeenCalledWith(TEST_CLERK_USER_ID);
      });

      it("should return 404 if user not found", async () => {
        const { headers } = await import("next/headers");
        vi.mocked(headers).mockResolvedValue(
          new Map([
            ["svix-id", "msg_test"],
            ["svix-timestamp", "1234567890"],
            ["svix-signature", "v1,test"],
          ])
        );

        const eventPayload = {
          type: "user.deleted",
          data: {
            id: TEST_CLERK_USER_ID,
          },
        };

        const mockVerify = vi.fn().mockReturnValue(eventPayload);
        vi.mocked(Webhook).mockImplementation(() => ({
          verify: mockVerify,
        } as any));

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(null);

        const request = await createMockRequest(
          JSON.stringify(eventPayload),
          {
            "svix-id": "msg_test",
            "svix-timestamp": "1234567890",
            "svix-signature": "v1,test",
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(404);
        expect(await response.text()).toBe("User not found");
      });

      it("should handle deletion error", async () => {
        const { headers } = await import("next/headers");
        vi.mocked(headers).mockResolvedValue(
          new Map([
            ["svix-id", "msg_test"],
            ["svix-timestamp", "1234567890"],
            ["svix-signature", "v1,test"],
          ])
        );

        const eventPayload = {
          type: "user.deleted",
          data: {
            id: TEST_CLERK_USER_ID,
          },
        };

        const mockVerify = vi.fn().mockReturnValue(eventPayload);
        vi.mocked(Webhook).mockImplementation(() => ({
          verify: mockVerify,
        } as any));

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(
          TEST_USER as any
        );
        vi.mocked(supabaseLib.deleteUser).mockResolvedValue(false);

        const request = await createMockRequest(
          JSON.stringify(eventPayload),
          {
            "svix-id": "msg_test",
            "svix-timestamp": "1234567890",
            "svix-signature": "v1,test",
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(500);
        expect(await response.text()).toBe("Error deleting user");
      });
    });

    describe("unknown event types", () => {
      it("should return 200 for unknown event type", async () => {
        const { headers } = await import("next/headers");
        vi.mocked(headers).mockResolvedValue(
          new Map([
            ["svix-id", "msg_test"],
            ["svix-timestamp", "1234567890"],
            ["svix-signature", "v1,test"],
          ])
        );

        const eventPayload = {
          type: "email.verification_requested",
          data: {},
        };

        const mockVerify = vi.fn().mockReturnValue(eventPayload);
        vi.mocked(Webhook).mockImplementation(() => ({
          verify: mockVerify,
        } as any));

        const request = await createMockRequest(
          JSON.stringify(eventPayload),
          {
            "svix-id": "msg_test",
            "svix-timestamp": "1234567890",
            "svix-signature": "v1,test",
          }
        );

        const response = await POST(request);
        expect(response.status).toBe(200);
      });
    });
  });
});

