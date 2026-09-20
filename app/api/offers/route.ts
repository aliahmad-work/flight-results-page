import { NextRequest, NextResponse } from "next/server";
import { mockFlightOffers } from "@/data/mock-offers";
import {
  SimulationMode,
  OffersApiResponse,
  OffersApiErrorResponse,
} from "@/types/flight";

// Force dynamic execution and disable all caching for real-time fare generation
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const simulateParam = searchParams.get("simulate")?.toLowerCase() || "ok";
  const simulate: SimulationMode = (
    ["ok", "slow", "error", "empty", "partial"].includes(simulateParam)
      ? simulateParam
      : "ok"
  ) as SimulationMode;

  const noCacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  // 1. Error simulation -> 503 Service Unavailable
  if (simulate === "error") {
    const errorBody: OffersApiErrorResponse = {
      success: false,
      simulationMode: "error",
      error: {
        code: "SUPPLIER_GATEWAY_TIMEOUT",
        message:
          "Global distribution system (GDS) is currently unresponsive. Please retry.",
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(errorBody, {
      status: 503,
      headers: noCacheHeaders,
    });
  }

  // 2. Slow simulation -> Delayed response (~2500ms) with executionTimeMs
  if (simulate === "slow") {
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const executionTimeMs = Date.now() - startTime;

    const responseBody: OffersApiResponse = {
      success: true,
      simulationMode: "slow",
      totalResults: mockFlightOffers.length,
      offers: mockFlightOffers,
      meta: {
        timestamp: new Date().toISOString(),
        executionTimeMs,
        currency: "PKR",
      },
    };

    return NextResponse.json(responseBody, {
      status: 200,
      headers: noCacheHeaders,
    });
  }

  // 3. Empty simulation -> 200 OK with empty offers array
  if (simulate === "empty") {
    const responseBody: OffersApiResponse = {
      success: true,
      simulationMode: "empty",
      totalResults: 0,
      offers: [],
      meta: {
        timestamp: new Date().toISOString(),
        currency: "PKR",
      },
    };

    return NextResponse.json(responseBody, {
      status: 200,
      headers: noCacheHeaders,
    });
  }

  // 4. Partial simulation -> 200 OK with subset of offers + supplier warnings
  if (simulate === "partial") {
    // Filter out Qatar Airways (QR) and British Airways (BA) to simulate supplier dropouts
    const remainingOffers = mockFlightOffers.filter(
      (offer) => offer.airlineCode !== "QR" && offer.airlineCode !== "BA"
    );

    const responseBody: OffersApiResponse = {
      success: true,
      simulationMode: "partial",
      totalResults: remainingOffers.length,
      offers: remainingOffers,
      warnings: [
        {
          airline: "Qatar Airways",
          airlineCode: "QR",
          status: "failed",
          message:
            "Upstream supplier connection failed for Qatar Airways inventory.",
        },
        {
          airline: "British Airways",
          airlineCode: "BA",
          status: "timeout",
          message: "Supplier timed out responding for British Airways routes.",
        },
      ],
      meta: {
        timestamp: new Date().toISOString(),
        currency: "PKR",
      },
    };

    return NextResponse.json(responseBody, {
      status: 200,
      headers: noCacheHeaders,
    });
  }

  // 5. Default "ok" simulation -> 200 OK with all offers
  const responseBody: OffersApiResponse = {
    success: true,
    simulationMode: "ok",
    totalResults: mockFlightOffers.length,
    offers: mockFlightOffers,
    meta: {
      timestamp: new Date().toISOString(),
      currency: "PKR",
    },
  };

  return NextResponse.json(responseBody, {
    status: 200,
    headers: noCacheHeaders,
  });
}
