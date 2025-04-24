import React from 'react';
import { render, screen } from '@testing-library/react';
import StarRating from './StarRating';

describe('StarRating', () => {
  test('renders 5 full stars for rating = 5', () => {
    render(<StarRating rating={5} />);
    expect(screen.getAllByTestId('star-full')).toHaveLength(5);
    expect(screen.queryByTestId('star-half')).toBeNull();
    expect(screen.queryByTestId('star-empty')).toBeNull();
  });

  test('renders 4 full, 1 half star for rating = 4.5', () => {
    render(<StarRating rating={4.5} />);
    expect(screen.getAllByTestId('star-full')).toHaveLength(4);
    expect(screen.getByTestId('star-half')).toBeInTheDocument();
    expect(screen.queryByTestId('star-empty')).toBeNull();
  });

  test('renders 3 full, 1 half, 1 empty for rating = 3.5', () => {
    render(<StarRating rating={3.5} />);
    expect(screen.getAllByTestId('star-full')).toHaveLength(3);
    expect(screen.getByTestId('star-half')).toBeInTheDocument();
    expect(screen.getAllByTestId('star-empty')).toHaveLength(1);
  });

  test('renders 0 full stars for rating = 0', () => {
    render(<StarRating rating={0} />);
    expect(screen.queryByTestId('star-full')).toBeNull();
    expect(screen.queryByTestId('star-half')).toBeNull();
    expect(screen.getAllByTestId('star-empty')).toHaveLength(5);
  });
});
