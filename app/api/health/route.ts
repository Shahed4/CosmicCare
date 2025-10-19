import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Cosmic Care API",
    version: "1.0.0",
  });
}
