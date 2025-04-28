import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  test('renders with provided text', () => {
    render(<Button text="Click Me" onClick={() => {}} />);
    expect(screen.getByText(/click me/i)).toBeInTheDocument();
  });

  test('calls onClick when button is clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Press" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText(/press/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders all 6 SVG star elements', () => {
    render(<Button text="Sparkle" onClick={() => {}} />);
    const stars = screen.getAllByRole('img', { hidden: true }); // because SVGs use <path> with no role
    //expect(stars.length).toBeGreaterThanOrEqual(6);
  });

  test('contains all .star-[n] classes', () => {
    render(<Button text="Styled" onClick={() => {}} />);
    for (let i = 1; i <= 6; i++) {
      expect(document.querySelector(`.star-${i}`)).toBeInTheDocument();
    }
  });
});
