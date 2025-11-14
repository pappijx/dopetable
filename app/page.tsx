import { CharacterTableContainer } from '@/components/character-table';

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Character Data Table
        </h1>
        <p className="text-muted-foreground mt-2">
          A performant table displaying 1000+ characters with filtering,
          sorting, and selection.
        </p>
      </div>
      <CharacterTableContainer />
    </div>
  );
}
