import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/react-test-utils';
import { CharacterHealthFilter } from '@/components/character-table/character-health-filter';
import type { HealthStatus } from '@/types/character';

describe('CharacterHealthFilter', () => {
  it('renders filter button', () => {
    render(<CharacterHealthFilter />);

    const filterButton = screen.getByRole('button', { name: /filter by health status/i });
    expect(filterButton).toBeInTheDocument();
  });

  it('opens dropdown menu when filter button is clicked', async () => {
    const { user } = render(<CharacterHealthFilter />);

    const filterButton = screen.getByRole('button', { name: /filter by health status/i });
    await user.click(filterButton);

    expect(screen.getByText('Filter by Health')).toBeInTheDocument();
  });

  it('displays all health status options', async () => {
    const { user } = render(<CharacterHealthFilter />);

    const filterButton = screen.getByRole('button', { name: /filter by health status/i });
    await user.click(filterButton);

    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.getByText('Injured')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('shows checked items based on healthFilters prop', async () => {
    const healthFilters = new Set<HealthStatus>(['Healthy', 'Critical']);
    const { user } = render(<CharacterHealthFilter healthFilters={healthFilters} />);

    const filterButton = screen.getByRole('button', { name: /filter by health status/i });
    await user.click(filterButton);

    const healthyItem = screen.getByRole('menuitemcheckbox', { name: 'Healthy' });
    const injuredItem = screen.getByRole('menuitemcheckbox', { name: 'Injured' });
    const criticalItem = screen.getByRole('menuitemcheckbox', { name: 'Critical' });

    expect(healthyItem).toHaveAttribute('data-state', 'checked');
    expect(injuredItem).toHaveAttribute('data-state', 'unchecked');
    expect(criticalItem).toHaveAttribute('data-state', 'checked');
  });

  it('calls onToggleFilter when health status is clicked', async () => {
    const onToggleFilter = vi.fn();
    const { user } = render(<CharacterHealthFilter onToggleFilter={onToggleFilter} />);

    const filterButton = screen.getByRole('button', { name: /filter by health status/i });
    await user.click(filterButton);

    const healthyItem = screen.getByRole('menuitemcheckbox', { name: 'Healthy' });
    await user.click(healthyItem);

    expect(onToggleFilter).toHaveBeenCalledWith('Healthy');
  });

  it('shows clear filters option when filters are active', async () => {
    const healthFilters = new Set<HealthStatus>(['Healthy']);
    const { user } = render(<CharacterHealthFilter healthFilters={healthFilters} />);

    const filterButton = screen.getByRole('button', { name: /filter by health status/i });
    await user.click(filterButton);

    expect(screen.getByText('Clear filters')).toBeInTheDocument();
  });

  it('does not show clear filters option when no filters are active', async () => {
    const { user } = render(<CharacterHealthFilter />);

    const filterButton = screen.getByRole('button', { name: /filter by health status/i });
    await user.click(filterButton);

    expect(screen.queryByText('Clear filters')).not.toBeInTheDocument();
  });

  it('calls onClearFilters when clear filters is clicked', async () => {
    const onClearFilters = vi.fn();
    const healthFilters = new Set<HealthStatus>(['Healthy']);
    const { user } = render(
      <CharacterHealthFilter healthFilters={healthFilters} onClearFilters={onClearFilters} />
    );

    const filterButton = screen.getByRole('button', { name: /filter by health status/i });
    await user.click(filterButton);

    const clearButton = screen.getByText('Clear filters');
    await user.click(clearButton);

    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it('highlights filter icon when filters are active', () => {
    const healthFilters = new Set<HealthStatus>(['Healthy']);
    const { container } = render(<CharacterHealthFilter healthFilters={healthFilters} />);

    const filterIcon = container.querySelector('.text-primary');
    expect(filterIcon).toBeInTheDocument();
  });

  it('does not highlight filter icon when no filters are active', () => {
    const { container } = render(<CharacterHealthFilter />);

    const filterIcon = container.querySelector('.text-primary');
    expect(filterIcon).not.toBeInTheDocument();
  });
});
