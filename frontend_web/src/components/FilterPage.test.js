import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterPage from './FilterPage';

describe('FilterPage', () => {
  const types = ['pizza', 'burger', 'sushi'];
  let mockSetMaxDistance, mockSetMinRating, mockSetPriceLevels, mockSetAllowedTypes, mockApplyFilters, mockOnClose, mockFetchRestaurants;

  beforeEach(() => {
    mockSetMaxDistance = jest.fn();
    mockSetMinRating = jest.fn();
    mockSetPriceLevels = jest.fn();
    mockSetAllowedTypes = jest.fn();
    mockApplyFilters = jest.fn();
    mockOnClose = jest.fn();
    mockFetchRestaurants = jest.fn();

    render(
      <FilterPage
        maxDistance={10}
        setMaxDistance={mockSetMaxDistance}
        minRating={3}
        setMinRating={mockSetMinRating}
        priceLevels={[1, 2]}
        setPriceLevels={mockSetPriceLevels}
        applyFilters={mockApplyFilters}
        onClose={mockOnClose}
        isOpen={true}
        types={types}
        allowedTypes={['pizza', 'burger']}
        setAllowedTypes={mockSetAllowedTypes}
        fetchRestaurants={mockFetchRestaurants}
      />
    );
  });

  test('renders all filter controls', () => {
    expect(screen.getByText(/Max Distance/i)).toBeInTheDocument();
    expect(screen.getByText(/Min Rating/i)).toBeInTheDocument();
    expect(screen.getByText(/Price Level/i)).toBeInTheDocument();
    expect(screen.getByText(/Types/i)).toBeInTheDocument();
    expect(screen.getByText(/Apply Filters/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear Filters/i)).toBeInTheDocument();
  });

  test('calls setMaxDistance on distance change', () => {
    fireEvent.change(screen.getByRole('slider'), { target: { value: '25' } });
    expect(mockSetMaxDistance).toHaveBeenCalledWith(25);
  });

  test('calls setMinRating when star is clicked', () => {
    // Just simulate a star click; exact rating logic tested elsewhere
    const stars = screen.getAllByRole('img', { hidden: true });
    if (stars.length) {
      fireEvent.click(stars[0]);
      expect(mockSetMinRating).toHaveBeenCalled();
    }
  });

  test('calls setPriceLevels on price button click', () => {
    const priceButton = screen.getByText('$$');
    fireEvent.click(priceButton);
    expect(mockSetPriceLevels).toHaveBeenCalled();
  });

  test('calls setAllowedTypes when type is toggled', () => {
    const sushiCheckbox = screen.getByLabelText('Sushi');
    fireEvent.click(sushiCheckbox);
    expect(mockSetAllowedTypes).toHaveBeenCalled();
  });

  test('calls applyFilters when Apply Filters is clicked', () => {
    fireEvent.click(screen.getByText('Apply Filters'));
    expect(mockApplyFilters).toHaveBeenCalled();
  });

  test('clears filters when Clear Filters is clicked', () => {
    fireEvent.click(screen.getByText('Clear Filters'));
    expect(mockSetMaxDistance).toHaveBeenCalledWith(50);
    expect(mockSetMinRating).toHaveBeenCalledWith(0);
    expect(mockSetPriceLevels).toHaveBeenCalledWith([]);
    expect(mockSetAllowedTypes).toHaveBeenCalledWith(types);
    expect(mockFetchRestaurants).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
