import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/react-test-utils';
import { Navbar } from '@/components/navbar';

// Mock the ThemeToggle component
vi.mock('@/components/theme-toggle', () => ({
  ThemeToggle: () => <button>Theme Toggle Mock</button>,
}));

describe('Navbar', () => {
  it('renders the navbar', () => {
    const { container } = render(<Navbar />);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('displays the application title', () => {
    render(<Navbar />);

    const title = screen.getByRole('heading', { name: /character data table/i });
    expect(title).toBeInTheDocument();
  });

  it('renders with sticky positioning', () => {
    const { container } = render(<Navbar />);

    const header = container.querySelector('header');
    expect(header?.className).toContain('sticky');
    expect(header?.className).toContain('top-0');
  });

  it('renders with high z-index for layering', () => {
    const { container } = render(<Navbar />);

    const header = container.querySelector('header');
    expect(header?.className).toContain('z-50');
  });

  it('has a border at the bottom', () => {
    const { container } = render(<Navbar />);

    const header = container.querySelector('header');
    expect(header?.className).toContain('border-b');
  });

  it('renders the ThemeToggle component', () => {
    render(<Navbar />);

    expect(screen.getByText('Theme Toggle Mock')).toBeInTheDocument();
  });

  it('uses flexbox for layout', () => {
    const { container } = render(<Navbar />);

    const innerDiv = container.querySelector('.container');
    expect(innerDiv?.className).toContain('flex');
    expect(innerDiv?.className).toContain('justify-between');
    expect(innerDiv?.className).toContain('items-center');
  });

  it('has correct height', () => {
    const { container } = render(<Navbar />);

    const innerDiv = container.querySelector('.container');
    expect(innerDiv?.className).toContain('h-14');
  });

  it('applies backdrop blur effect', () => {
    const { container } = render(<Navbar />);

    const header = container.querySelector('header');
    expect(header?.className).toContain('backdrop-blur');
  });
});
