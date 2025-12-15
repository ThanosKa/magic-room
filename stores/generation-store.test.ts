import { describe, it, expect, beforeEach } from "vitest";
import { useGenerationStore } from "./generation-store";

describe("useGenerationStore", () => {
    beforeEach(() => {
        useGenerationStore.getState().reset();
    });

    describe("setActiveGeneration", () => {
        it("sets generation result correctly", () => {
            const mockGeneration = {
                id: "gen_123",
                status: "succeeded" as const,
                outputUrls: ["https://example.com/image1.png"],
            };
            useGenerationStore.getState().setActiveGeneration(mockGeneration);
            expect(useGenerationStore.getState().activeGeneration).toEqual(mockGeneration);
        });

        it("clears generation when set to null", () => {
            useGenerationStore.getState().setActiveGeneration({
                id: "gen_123",
                status: "succeeded",
                outputUrls: [],
            });
            useGenerationStore.getState().setActiveGeneration(null);
            expect(useGenerationStore.getState().activeGeneration).toBeNull();
        });
    });

    describe("setUploadedImage", () => {
        it("sets both URL and path", () => {
            useGenerationStore.getState().setUploadedImage("data:image/png;base64,abc123", "");
            const state = useGenerationStore.getState();
            expect(state.uploadedImageUrl).toBe("data:image/png;base64,abc123");
            expect(state.uploadedImagePath).toBe("");
        });
    });

    describe("clearUploadedImage", () => {
        it("clears uploaded image state", () => {
            useGenerationStore.getState().setUploadedImage("data:image/png;base64,abc123", "");
            useGenerationStore.getState().clearUploadedImage();
            const state = useGenerationStore.getState();
            expect(state.uploadedImageUrl).toBeNull();
            expect(state.uploadedImagePath).toBeNull();
        });
    });

    describe("updateGenerationStatus", () => {
        it("merges new status with existing generation", () => {
            useGenerationStore.getState().setActiveGeneration({
                id: "gen_123",
                status: "processing",
                outputUrls: [],
            });
            useGenerationStore.getState().updateGenerationStatus({
                id: "gen_123",
                status: "succeeded",
                outputUrls: ["https://example.com/output.png"],
            });
            const state = useGenerationStore.getState();
            expect(state.activeGeneration?.status).toBe("succeeded");
            expect(state.activeGeneration?.outputUrls).toHaveLength(1);
        });

        it("creates new generation if none exists", () => {
            useGenerationStore.getState().updateGenerationStatus({
                id: "gen_new",
                status: "starting",
                outputUrls: [],
            });
            expect(useGenerationStore.getState().activeGeneration?.id).toBe("gen_new");
        });
    });

    describe("reset", () => {
        it("clears all generation state", () => {
            useGenerationStore.getState().setActiveGeneration({
                id: "gen_123",
                status: "succeeded",
                outputUrls: ["test.png"],
            });
            useGenerationStore.getState().setUploadedImage("data:image/png;base64,test", "");

            useGenerationStore.getState().reset();

            const state = useGenerationStore.getState();
            expect(state.activeGeneration).toBeNull();
            expect(state.uploadedImageUrl).toBeNull();
            expect(state.uploadedImagePath).toBeNull();
        });
    });
});
