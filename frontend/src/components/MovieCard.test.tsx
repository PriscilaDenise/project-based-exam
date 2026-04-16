import { render } from '@testing-library/react';
import { MovieCardSkeleton } from './MovieCard';

// Using a basic div instead of lucide-react to avoid external mocking issues in simple test
jest.mock('lucide-react', () => ({
  Star: () => <div data-testid="star-icon">Star</div>
}));

describe('MovieCardSkeleton', () => {
  it('renders correctly', () => {
    const { container } = render(<MovieCardSkeleton />);
    
    // The outermost wrapper has flex-shrink-0 
    expect(container.firstChild).toHaveClass('flex-shrink-0');
  });

  it('contains placeholder divs for image, title, and metadata', () => {
    const { container } = render(<MovieCardSkeleton />);
    
    // There should be a specific block acting as the poster image placeholder
    // It uses the 'skeleton' class
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
  });
});
