import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    status: "ok",
    service: "4S HITECH PHARMA API",
    timestamp: new Date().toISOString(),
  });
}
