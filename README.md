# Character Data Table

A performant, feature-rich data table application for managing and viewing 1000+ character records. Built with Next.js, TanStack Table, and shadcn/ui components.

## Features

- **Virtual Scrolling**: Efficiently renders 1000+ rows using TanStack Virtual
- **Advanced Filtering**:
  - Search by character name
  - Filter by health status (Healthy, Injured, Critical)
- **Sorting**: Sort characters by power level (ascending/descending)
- **Row Selection**:
  - Select individual characters or all visible rows
  - Bulk actions on selected characters
- **Mark as Viewed/Unviewed**: Track which characters you've reviewed with persistent storage
- **Dark/Light Mode**: Theme toggle with system preference support
- **Responsive Design**: Clean, modern UI that works across devices

## Tech Stack

- **Framework**: Next.js 16.0.3 with App Router
- **Table**: TanStack Table v8 with virtualization
- **State Management**: Zustand with DevTools
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS
- **Theming**: next-themes
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Generate static character data (first time only):

```bash
npm run generate-data
# or
npx tsx scripts/generate-static-data.ts
```

This creates a `data/characters.json` file with 1000 sample characters.

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How to Use

### Viewing Characters

- The table displays 1000 characters with columns for:
  - **#**: Serial number
  - **Select**: Checkbox for row selection
  - **Name**: Character name with "(Read)" indicator if viewed
  - **Location**: Character's village (Konoha, Suna, Kiri, Iwa, Kumo)
  - **Health**: Health status badge (Healthy, Injured, Critical)
  - **Power**: Power level (100-10000)

### Filtering

- **Search**: Type in the search box to filter characters by name
- **Health Filter**: Click the filter icon in the Health column header to filter by health status
- **Clear Filters**: Click "Reset" to clear all active filters

### Sorting

- Click the "Power" column header to sort by power level
- Click again to reverse the sort order
- Click a third time to clear sorting

### Selection

- Click individual checkboxes to select specific characters
- Click the header checkbox to select/deselect all visible characters
- Selection respects current filters (only visible rows are selected)

### Mark as Viewed/Unviewed

1. Select one or more characters using the checkboxes
2. Click "Mark as Viewed" or "Mark as Unviewed" buttons in the toolbar
3. A loading spinner indicates the update is in progress
4. Viewed characters show "(Read)" next to their name
5. Changes are persisted to the static data file

### Theme Toggle

- Click the sun/moon icon in the top-right corner to switch between light and dark modes
- Theme preference is saved to localStorage

## Project Structure

```
dopetable/
├── app/
│   ├── api/characters/         # API routes for data operations
│   ├── layout.tsx              # Root layout with theme provider
│   └── page.tsx                # Main application page
├── components/
│   ├── table/                  # Generic reusable table components
│   │   ├── data-table.tsx
│   │   └── data-table-toolbar.tsx
│   ├── character-table/        # Character-specific components
│   │   ├── character-table-container.tsx
│   │   ├── character-columns.tsx
│   │   ├── character-table-actions.tsx
│   │   └── character-health-filter.tsx
│   ├── providers/
│   │   └── theme-provider.tsx  # Theme provider wrapper
│   ├── navbar.tsx              # Top navigation bar
│   └── theme-toggle.tsx        # Dark/light mode toggle
├── stores/
│   └── table-store.ts          # Zustand state management
├── types/
│   └── character.ts            # TypeScript type definitions
├── data/
│   └── characters.json         # Static character data (generated)
└── scripts/
    └── generate-static-data.ts # Data generation script
```

## Architecture Highlights

### Generic Table Component

The `DataTable` component is fully generic and reusable:
- Accepts any data type via TypeScript generics
- Handles virtualization, filtering, and sorting internally
- Uses composition pattern with children props for extensibility

### Optimistic Updates

When marking characters as viewed/unviewed:
- UI updates immediately for instant feedback
- API call happens in the background
- Changes roll back automatically if the API call fails

### Persistent Storage

- Character data is stored in a static JSON file
- Updates are written to the file via Node.js file system API
- Data persists between server restarts

## Testing

This project includes comprehensive test coverage using Vitest and React Testing Library.

### Test Structure

All tests are located in the `tests` directory, mirroring the application structure:

```
tests/
├── components/
│   ├── character-table/
│   │   ├── character-columns.test.tsx
│   │   ├── character-health-filter.test.tsx
│   │   └── character-table-actions.test.tsx
│   ├── navbar.test.tsx
│   └── theme-toggle.test.tsx
├── stores/
│   └── table-store.test.ts
├── setup-test-environment.ts
└── react-test-utils.tsx
```

### Running Tests

**Run all tests (verbose output):**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Run tests with UI (recommended for development):**
```bash
npm run test:ui
```
This opens a beautiful web interface (typically at `http://localhost:51204/__vitest__/`) where you can:
- View all test files and their results
- See test coverage visualization
- Filter and search tests
- Re-run specific tests
- Debug failing tests with detailed error messages

**Generate test coverage report:**
```bash
npm run test:coverage
```
Coverage reports are generated in the `coverage` directory with HTML, JSON, and text formats.

### Test Coverage

Current test coverage includes:

- **Component Tests**:
  - CharacterTableActions (9 tests) - Button states, loading, user interactions
  - CharacterHealthFilter (10 tests) - Dropdown menu, filters, callbacks
  - CharacterColumns (12 tests) - Column configuration and ordering
  - ThemeToggle (6 tests) - Theme switching functionality
  - Navbar (9 tests) - Layout and rendering

- **Store Tests**:
  - Zustand table-store (25 tests) - State management, API calls, optimistic updates, error handling

**Total: 71 tests across 6 test files**

### Testing Best Practices

1. **Use Vitest UI** for the best development experience
2. **Run tests in watch mode** while developing new features
3. **Check coverage** before committing to ensure adequate test coverage
4. Tests use `@/` alias for imports to maintain consistency with the app
5. All tests follow the Arrange-Act-Assert pattern

## Building for Production

```bash
npm run build
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Table](https://tanstack.com/table/latest)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

MIT
