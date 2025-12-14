import { auth } from "@clerk/nextjs/server";
import { getGenerationStatus } from "@/lib/supabase";
import { getPredictionStatus } from "@/lib/replicate";
import { IStatusCheckResponse } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { id: generationId } = await params;

    // Try to get status from database first
    const generation = await getGenerationStatus(generationId);

    if (!generation) {
      return new Response(JSON.stringify({ error: "Generation not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If status is still processing, optionally fetch from Replicate for real-time updates
    if (
      generation.status === "starting" ||
      generation.status === "processing"
    ) {
      try {
        const prediction = await getPredictionStatus(generationId);
        if (prediction) {
          const response: IStatusCheckResponse = {
            id: generation.id,
            status: prediction.status as any,
            outputUrls: prediction.output as string[] | undefined,
            error: prediction.error as string | undefined,
          };
          return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (error) {
        console.error("Error fetching from Replicate:", error);
        // Fall back to database status
      }
    }

    const response: IStatusCheckResponse = {
      id: generation.id,
      status: generation.status,
      outputUrls: generation.output_urls as string[] | undefined,
      error: generation.error as string | undefined,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Status check error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
