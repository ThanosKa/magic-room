import { describe, it, expect, beforeEach } from "vitest";
import { useUserStore } from "./user-store";

describe("useUserStore", () => {
    beforeEach(() => {
        useUserStore.getState().reset();
    });

    describe("setCredits", () => {
        it("updates credits correctly", () => {
            useUserStore.getState().setCredits(10);
            expect(useUserStore.getState().credits).toBe(10);
        });

        it("handles zero credits", () => {
            useUserStore.getState().setCredits(0);
            expect(useUserStore.getState().credits).toBe(0);
        });
    });

    describe("deductCredit", () => {
        it("decrements credits by 1", () => {
            useUserStore.getState().setCredits(5);
            useUserStore.getState().deductCredit();
            expect(useUserStore.getState().credits).toBe(4);
        });

        it("floors at 0 when deducting from 0", () => {
            useUserStore.getState().setCredits(0);
            useUserStore.getState().deductCredit();
            expect(useUserStore.getState().credits).toBe(0);
        });

        it("floors at 0 when deducting from 1", () => {
            useUserStore.getState().setCredits(1);
            useUserStore.getState().deductCredit();
            expect(useUserStore.getState().credits).toBe(0);
        });
    });

    describe("addCredits", () => {
        it("increments credits by specified amount", () => {
            useUserStore.getState().setCredits(5);
            useUserStore.getState().addCredits(10);
            expect(useUserStore.getState().credits).toBe(15);
        });

        it("handles adding to zero credits", () => {
            useUserStore.getState().setCredits(0);
            useUserStore.getState().addCredits(25);
            expect(useUserStore.getState().credits).toBe(25);
        });
    });

    describe("reset", () => {
        it("clears all state", () => {
            useUserStore.getState().setCredits(100);
            useUserStore.getState().setError("test error");
            useUserStore.getState().setIsLoading(true);

            useUserStore.getState().reset();

            const state = useUserStore.getState();
            expect(state.credits).toBe(0);
            expect(state.user).toBeNull();
            expect(state.error).toBeNull();
            expect(state.isLoading).toBe(false);
        });
    });

    describe("setUser", () => {
        it("sets user correctly", () => {
            const mockUser = {
                id: "123",
                clerkUserId: "clerk_123",
                email: "test@example.com",
                credits: 10,
                createdAt: "2024-01-01",
                updatedAt: "2024-01-01",
            };
            useUserStore.getState().setUser(mockUser);
            expect(useUserStore.getState().user).toEqual(mockUser);
        });

        it("clears user when set to null", () => {
            useUserStore.getState().setUser(null);
            expect(useUserStore.getState().user).toBeNull();
        });
    });

    describe("setError", () => {
        it("sets error message", () => {
            useUserStore.getState().setError("Something went wrong");
            expect(useUserStore.getState().error).toBe("Something went wrong");
        });

        it("clears error when set to null", () => {
            useUserStore.getState().setError("error");
            useUserStore.getState().setError(null);
            expect(useUserStore.getState().error).toBeNull();
        });
    });

    describe("setIsLoading", () => {
        it("sets loading state to true", () => {
            useUserStore.getState().setIsLoading(true);
            expect(useUserStore.getState().isLoading).toBe(true);
        });

        it("sets loading state to false", () => {
            useUserStore.getState().setIsLoading(true);
            useUserStore.getState().setIsLoading(false);
            expect(useUserStore.getState().isLoading).toBe(false);
        });
    });
});
