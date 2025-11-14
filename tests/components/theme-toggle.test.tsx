import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/tests/react-test-utils';
import { ThemeToggle } from '@/components/theme-toggle';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

import { useTheme } from 'next-themes';

describe('ThemeToggle', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders toggle button', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    } as any);

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('has accessible label', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    } as any);

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAccessibleName(/toggle theme/i);
  });

  it('toggles from light to dark when clicked', async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    } as any);

    const { user } = render(<ThemeToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles from dark to light when clicked', async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    } as any);

    const { user } = render(<ThemeToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('handles undefined theme by defaulting to light', async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: undefined,
      setTheme: mockSetTheme,
    } as any);

    const { user } = render(<ThemeToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    // When theme is undefined, it's treated as 'light' and toggles to 'dark'
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('renders with outline variant', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    } as any);

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('outline');
  });
});
