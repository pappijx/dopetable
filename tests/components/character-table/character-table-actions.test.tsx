import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/react-test-utils';
import { CharacterTableActions } from '@/components/character-table/character-table-actions';

describe('CharacterTableActions', () => {
  it('renders both action buttons', () => {
    render(
      <CharacterTableActions
        selectedCount={0}
        onMarkAsViewed={vi.fn()}
        onMarkAsUnviewed={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /mark selected characters as viewed/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mark selected characters as unviewed/i })).toBeInTheDocument();
  });

  it('disables buttons when no items are selected', () => {
    render(
      <CharacterTableActions
        selectedCount={0}
        onMarkAsViewed={vi.fn()}
        onMarkAsUnviewed={vi.fn()}
      />
    );

    const viewedButton = screen.getByRole('button', { name: /mark selected characters as viewed/i });
    const unviewedButton = screen.getByRole('button', { name: /mark selected characters as unviewed/i });

    expect(viewedButton).toBeDisabled();
    expect(unviewedButton).toBeDisabled();
  });

  it('enables buttons when items are selected', () => {
    render(
      <CharacterTableActions
        selectedCount={5}
        onMarkAsViewed={vi.fn()}
        onMarkAsUnviewed={vi.fn()}
      />
    );

    const viewedButton = screen.getByRole('button', { name: /mark selected characters as viewed/i });
    const unviewedButton = screen.getByRole('button', { name: /mark selected characters as unviewed/i });

    expect(viewedButton).not.toBeDisabled();
    expect(unviewedButton).not.toBeDisabled();
  });

  it('disables buttons when loading', () => {
    render(
      <CharacterTableActions
        selectedCount={5}
        isLoading={true}
        onMarkAsViewed={vi.fn()}
        onMarkAsUnviewed={vi.fn()}
      />
    );

    const viewedButton = screen.getByRole('button', { name: /mark selected characters as viewed/i });
    const unviewedButton = screen.getByRole('button', { name: /mark selected characters as unviewed/i });

    expect(viewedButton).toBeDisabled();
    expect(unviewedButton).toBeDisabled();
  });

  it('shows loading spinner when isLoading is true', () => {
    const { container } = render(
      <CharacterTableActions
        selectedCount={5}
        isLoading={true}
        onMarkAsViewed={vi.fn()}
        onMarkAsUnviewed={vi.fn()}
      />
    );

    // Check for Loader2 spinner (has animate-spin class)
    const spinners = container.querySelectorAll('.animate-spin');
    expect(spinners.length).toBeGreaterThan(0);
  });

  it('shows eye icons when not loading', () => {
    const { container } = render(
      <CharacterTableActions
        selectedCount={5}
        isLoading={false}
        onMarkAsViewed={vi.fn()}
        onMarkAsUnviewed={vi.fn()}
      />
    );

    // Should not have any loading spinners
    const spinners = container.querySelectorAll('.animate-spin');
    expect(spinners.length).toBe(0);
  });

  it('calls onMarkAsViewed when Mark as Viewed button is clicked', async () => {
    const onMarkAsViewed = vi.fn();
    const { user } = render(
      <CharacterTableActions
        selectedCount={5}
        onMarkAsViewed={onMarkAsViewed}
        onMarkAsUnviewed={vi.fn()}
      />
    );

    const viewedButton = screen.getByRole('button', { name: /mark selected characters as viewed/i });
    await user.click(viewedButton);

    expect(onMarkAsViewed).toHaveBeenCalledTimes(1);
  });

  it('calls onMarkAsUnviewed when Mark as Unviewed button is clicked', async () => {
    const onMarkAsUnviewed = vi.fn();
    const { user } = render(
      <CharacterTableActions
        selectedCount={5}
        onMarkAsViewed={vi.fn()}
        onMarkAsUnviewed={onMarkAsUnviewed}
      />
    );

    const unviewedButton = screen.getByRole('button', { name: /mark selected characters as unviewed/i });
    await user.click(unviewedButton);

    expect(onMarkAsUnviewed).toHaveBeenCalledTimes(1);
  });

  it('does not call handlers when buttons are disabled', async () => {
    const onMarkAsViewed = vi.fn();
    const onMarkAsUnviewed = vi.fn();
    const { user } = render(
      <CharacterTableActions
        selectedCount={0}
        onMarkAsViewed={onMarkAsViewed}
        onMarkAsUnviewed={onMarkAsUnviewed}
      />
    );

    const viewedButton = screen.getByRole('button', { name: /mark selected characters as viewed/i });
    const unviewedButton = screen.getByRole('button', { name: /mark selected characters as unviewed/i });

    await user.click(viewedButton);
    await user.click(unviewedButton);

    // Callbacks should not be called when buttons are disabled
    expect(onMarkAsViewed).not.toHaveBeenCalled();
    expect(onMarkAsUnviewed).not.toHaveBeenCalled();
  });
});
