import { NextResponse } from "next/server";

export async function GET() {
  const data = [
    { city: "Copenhagen", incidents: 120 },
    { city: "Aarhus", incidents: 80 },
  ];

  return NextResponse.json(data);
}
