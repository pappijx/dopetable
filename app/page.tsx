import { CharacterTableContainer } from '@/components/character-table';
import { Navbar } from '@/components/navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10">
        <CharacterTableContainer />
      </div>
    </>
  );
}
