import { render, screen } from '@testing-library/react';
import GenreGrid from './GenreGrid';

// Mock Next.js Link component since it doesn't work in a test environment
// Replace it with a simple <a> tag so we can test href and text content
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('GenreGrid', () => {
  it('renders all 16 genre cards', () => {
    render(<GenreGrid />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(16);
  });

  it('renders specific genre names correctly', () => {
    render(<GenreGrid />);
    // Check that some key genre labels appear in the UI
    // This ensures text content is rendered properly
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
    expect(screen.getByText('Comedy')).toBeInTheDocument();
  });

  it('has correct href attributes for genre links', () => {
    render(<GenreGrid />);
    const actionLink = screen.getByRole('link', { name: /Action/i });
    expect(actionLink).toHaveAttribute('href', '/genre/action?id=28');
  });
});
