import type { Character, HealthStatus, Location } from '@/types/character';
import { HEALTH_STATUSES, LOCATIONS } from '@/types/character';

const firstNames = [
  'Naruto',
  'Sasuke',
  'Sakura',
  'Kakashi',
  'Itachi',
  'Gaara',
  'Rock Lee',
  'Neji',
  'Hinata',
  'Shikamaru',
  'Ino',
  'Choji',
  'Kiba',
  'Shino',
  'Tenten',
  'Temari',
  'Kankuro',
  'Orochimaru',
  'Jiraiya',
  'Tsunade',
  'Minato',
  'Kushina',
  'Obito',
  'Rin',
  'Madara',
  'Hashirama',
  'Tobirama',
  'Hiruzen',
  'Danzo',
  'Asuma',
  'Kurenai',
  'Yamato',
  'Sai',
  'Shisui',
  'Kisame',
  'Deidara',
  'Sasori',
  'Hidan',
  'Kakuzu',
  'Pain',
  'Konan',
  'Zabuza',
  'Haku',
  'Kimimaro',
  'Jugo',
  'Suigetsu',
  'Karin',
  'Kabuto',
  'Anko',
  'Iruka',
  'Konohamaru',
];

const lastNames = [
  'Uzumaki',
  'Uchiha',
  'Haruno',
  'Hatake',
  'Hyuga',
  'Nara',
  'Yamanaka',
  'Akimichi',
  'Inuzuka',
  'Aburame',
  'Sarutobi',
  'Senju',
  'Namikaze',
  'Sabaku',
];

/**
 * Generates an array of character objects for testing the table
 * @param count - Number of characters to generate (default: 1000)
 * @returns Array of Character objects
 */
export function generateCharacters(count: number = 1000): Character[] {
  const characters: Character[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const uniqueSuffix = Math.floor(i / (firstNames.length * lastNames.length)) + 1;

    const name =
      uniqueSuffix > 1 ? `${firstName} ${lastName} ${uniqueSuffix}` : `${firstName} ${lastName}`;

    characters.push({
      id: `char_${(i + 1).toString().padStart(4, '0')}`,
      name,
      location: getRandomItem(LOCATIONS),
      health: getRandomItem(HEALTH_STATUSES),
      power: getRandomPower(),
    });
  }

  return characters;
}

/**
 * Get a random item from an array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random power level between 100 and 10000
 */
function getRandomPower(): number {
  return Math.floor(Math.random() * 9901) + 100; // 100-10000
}
