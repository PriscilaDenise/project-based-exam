import { render, screen } from '@testing-library/react';
import GenreGrid from './GenreGrid';

// Mock Next.js Link component
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
