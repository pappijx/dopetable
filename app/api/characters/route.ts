import type { Character } from "@/types/character";
import { readFileSync, writeFileSync } from "fs";
import { NextResponse } from "next/server";
import { join } from "path";

// Force Node.js runtime for file system access
export const runtime = "nodejs";

const DATA_FILE_PATH = join(process.cwd(), "data", "characters.json");

/**
 * Read characters from static JSON file
 */
function readCharacters(): Character[] {
  const data = readFileSync(DATA_FILE_PATH, "utf-8");
  return JSON.parse(data);
}

/**
 * Write characters to static JSON file
 */
function writeCharacters(characters: Character[]): void {
  writeFileSync(DATA_FILE_PATH, JSON.stringify(characters, null, 2), "utf-8");
}

/**
 * GET /api/characters
 * Returns all character data
 */
export async function GET() {
  try {
    // Simulate network delay for realistic loading state
    await new Promise((resolve) => setTimeout(resolve, 500));

    const characters = readCharacters();
    return NextResponse.json(characters);
  } catch (error) {
    console.error("Error reading characters:", error);
    return NextResponse.json(
      { error: "Failed to read characters" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/characters
 * Update viewed status for multiple characters
 * Body: { ids: string[], viewed: boolean }
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { ids, viewed } = body as { ids: string[]; viewed: boolean };

    if (!Array.isArray(ids) || typeof viewed !== "boolean") {
      return NextResponse.json(
        {
          error:
            "Invalid request body. Expected { ids: string[], viewed: boolean }",
        },
        { status: 400 },
      );
    }

    // Read current characters
    const characters = readCharacters();

    // Update viewed status for specified IDs
    const idsSet = new Set(ids);
    const updatedCharacters = characters.map((char) =>
      idsSet.has(char.id) ? { ...char, viewed } : char,
    );

    // Write back to file
    writeCharacters(updatedCharacters);

    // Simulate network delay for loading feedback
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      updatedCount: ids.length,
    });
  } catch (error) {
    console.error("Error updating characters:", error);
    return NextResponse.json(
      { error: "Failed to update characters" },
      { status: 500 },
    );
  }
}
