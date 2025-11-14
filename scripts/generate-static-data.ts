import { writeFileSync } from 'fs';
import { join } from 'path';
import { generateCharacters } from '../lib/generate-data';

const characters = generateCharacters(1000);
const outputPath = join(process.cwd(), 'data', 'characters.json');

writeFileSync(outputPath, JSON.stringify(characters, null, 2), 'utf-8');

console.log(`✓ Generated ${characters.length} characters to ${outputPath}`);
