import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <div className="mr-4 flex">
          <h1 className="text-xl font-semibold">Character Data Table</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
