import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "@/app/api/webhooks/clerk/route";
import * as supabaseLib from "@/lib/supabase";
import * as redisLib from "@/lib/redis";

const verifyMock = vi.hoisted(() =>
  vi.fn<(payload: string, headers: Record<string, string>) => unknown>()
);

vi.mock("svix", () => {
  class WebhookMock {
    constructor() {}

    verify(payload: string, headers: Record<string, string>) {
      return verifyMock(payload, headers);
    }
  }

  return { Webhook: WebhookMock };
});

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

vi.mock("@/lib/supabase", async () => {
  const actual = await vi.importActual<typeof import("@/lib/supabase")>(
    "@/lib/supabase"
  );
  return {
    ...actual,
    createUser: vi.fn(),
    getUserByClerkId: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  };
});

vi.mock("@/lib/redis", async () => {
  const actual = await vi.importActual("@/lib/redis");
  return {
    ...actual,
    checkAndMarkWebhookProcessed: vi.fn(),
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

function createRequest(body: string): Request {
  return new Request("http://localhost:3000/api/webhooks/clerk", {
    method: "POST",
    body,
  });
}

async function mockSvixHeaders(values: Record<string, string>) {
  const { headers } = await import("next/headers");
  vi.mocked(headers).mockResolvedValue(new Headers(values));
}

describe("Clerk Webhook Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyMock.mockReset();
  });

  describe("POST /api/webhooks/clerk", () => {
    it("should reject request without svix headers", async () => {
      await mockSvixHeaders({});

      const response = await POST(createRequest(JSON.stringify({})));
      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Missing svix headers");
    });

    it("should reject request with invalid signature", async () => {
      await mockSvixHeaders({
        "svix-id": "msg_test",
        "svix-timestamp": "1234567890",
        "svix-signature": "v1,invalid",
      });

      verifyMock.mockImplementation(() => {
        throw new Error("Invalid signature");
      });

      const response = await POST(createRequest(JSON.stringify({})));
      expect(response.status).toBe(400);
    });

    describe("user.created event", () => {
      it("should create new user with metadata", async () => {
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

        await mockSvixHeaders({
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: false,
          message: "New webhook",
        });

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(null);
        vi.mocked(supabaseLib.createUser).mockResolvedValue(TEST_USER);
        vi.mocked(supabaseLib.updateUser).mockResolvedValue(TEST_USER);

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
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
        await mockSvixHeaders({
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        const eventPayload = {
          type: "user.created",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: TEST_EMAIL }],
          },
        };

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: false,
          message: "New webhook",
        });

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(TEST_USER);

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
        expect(response.status).toBe(200);
        expect(supabaseLib.createUser).not.toHaveBeenCalled();
      });

      it("should return 400 if no email found", async () => {
        await mockSvixHeaders({
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        const eventPayload = {
          type: "user.created",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [],
          },
        };

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: false,
          message: "New webhook",
        });

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
        expect(response.status).toBe(400);
        expect(await response.text()).toBe("No email found");
      });

      it("should handle creation error", async () => {
        await mockSvixHeaders({
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        const eventPayload = {
          type: "user.created",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: TEST_EMAIL }],
          },
        };

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: false,
          message: "New webhook",
        });

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(null);
        vi.mocked(supabaseLib.createUser).mockResolvedValue(null);

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
        expect(response.status).toBe(500);
        expect(await response.text()).toBe("Error creating user");
      });
    });

    describe("user.updated event", () => {
      it("should update user email only", async () => {
        await mockSvixHeaders({
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        const newEmail = "newemail@example.com";
        const eventPayload = {
          type: "user.updated",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: newEmail }],
          },
        };

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: false,
          message: "New webhook",
        });

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(TEST_USER);
        vi.mocked(supabaseLib.updateUser).mockResolvedValue({
          ...TEST_USER,
          email: newEmail,
        });

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
        expect(response.status).toBe(200);
        expect(supabaseLib.updateUser).toHaveBeenCalledWith(
          TEST_CLERK_USER_ID,
          expect.objectContaining({ email: newEmail })
        );
      });

      it("should update user name and profile image", async () => {
        await mockSvixHeaders({
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

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

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: false,
          message: "New webhook",
        });

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(TEST_USER);
        vi.mocked(supabaseLib.updateUser).mockResolvedValue({
          ...TEST_USER,
          name: "Updated Name",
          profile_image_url: "https://example.com/newavatar.jpg",
        });

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
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
        await mockSvixHeaders({
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        const eventPayload = {
          type: "user.updated",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: TEST_EMAIL }],
          },
        };

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: false,
          message: "New webhook",
        });

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(null);

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
        expect(response.status).toBe(404);
        expect(await response.text()).toBe("User not found");
      });

      it("should handle update error", async () => {
        await mockSvixHeaders({
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        const eventPayload = {
          type: "user.updated",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: TEST_EMAIL }],
            first_name: "Updated",
          },
        };

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: false,
          message: "New webhook",
        });

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(TEST_USER);
        vi.mocked(supabaseLib.updateUser).mockResolvedValue(null);

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
        expect(response.status).toBe(500);
        expect(await response.text()).toBe("Error updating user");
      });
    });

    describe("user.deleted event", () => {
      it("should delete user successfully", async () => {
        await mockSvixHeaders({
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        const eventPayload = {
          type: "user.deleted",
          data: {
            id: TEST_CLERK_USER_ID,
          },
        };

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: false,
          message: "New webhook",
        });

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(TEST_USER);
        vi.mocked(supabaseLib.deleteUser).mockResolvedValue(true);

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
        expect(response.status).toBe(200);
        expect(supabaseLib.deleteUser).toHaveBeenCalledWith(TEST_CLERK_USER_ID);
      });

      it("should return 200 if user not found (idempotent deletion)", async () => {
        await mockSvixHeaders({
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        const eventPayload = {
          type: "user.deleted",
          data: {
            id: TEST_CLERK_USER_ID,
          },
        };

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: false,
          message: "New webhook",
        });

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(null);

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
        expect(response.status).toBe(200);
        expect(await response.text()).toBe("User already deleted");
      });

      it("should handle deletion error", async () => {
        await mockSvixHeaders({
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        const eventPayload = {
          type: "user.deleted",
          data: {
            id: TEST_CLERK_USER_ID,
          },
        };

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: false,
          message: "New webhook",
        });

        vi.mocked(supabaseLib.getUserByClerkId).mockResolvedValue(TEST_USER);
        vi.mocked(supabaseLib.deleteUser).mockResolvedValue(false);

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
        expect(response.status).toBe(500);
        expect(await response.text()).toBe("Error deleting user");
      });

      it("should reject duplicate deletion webhooks (idempotency)", async () => {
        await mockSvixHeaders({
          "svix-id": "msg_duplicate",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        const eventPayload = {
          type: "user.deleted",
          data: {
            id: TEST_CLERK_USER_ID,
          },
        };

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: true,
          message: "Webhook already processed",
        });

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
        expect(response.status).toBe(200);
        // Verify that no deletion was attempted (webhook was skipped)
        expect(supabaseLib.deleteUser).not.toHaveBeenCalled();
      });
    });

    describe("unknown event types", () => {
      it("should return 200 for unknown event type", async () => {
        await mockSvixHeaders({
          "svix-id": "msg_test",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        const eventPayload = {
          type: "email.verification_requested",
          data: {},
        };

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: false,
          message: "New webhook",
        });

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
        expect(response.status).toBe(200);
      });
    });

    describe("webhook deduplication", () => {
      it("should skip duplicate Clerk webhooks", async () => {
        await mockSvixHeaders({
          "svix-id": "msg_duplicate_1",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,test",
        });

        const eventPayload = {
          type: "user.created",
          data: {
            id: TEST_CLERK_USER_ID,
            email_addresses: [{ email_address: TEST_EMAIL }],
          },
        };

        verifyMock.mockReturnValue(eventPayload);
        vi.mocked(redisLib.checkAndMarkWebhookProcessed).mockResolvedValue({
          isProcessed: true,
          message: "Webhook already processed",
        });

        const response = await POST(createRequest(JSON.stringify(eventPayload)));
        expect(response.status).toBe(200);
        // Verify that no user was created (webhook was skipped)
        expect(supabaseLib.createUser).not.toHaveBeenCalled();
      });
    });
  });
});

