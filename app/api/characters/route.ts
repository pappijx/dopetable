import { generateCharacters } from "@/lib/generate-data";
import { NextResponse } from "next/server";

// Generate 1000 characters once and keep in memory
// In a real app, this would be in a database
const charactersData = generateCharacters(1000);

/**
 * GET /api/characters
 * Returns all character data
 */
export async function GET() {
  // Simulate network delay for realistic loading state
  console.log("charactersData", charactersData);
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(charactersData);
}
