import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileEditPopup from './ProfileEditPopup';

describe('ProfileEditPopup Component', () => {
  const mockValues = {
    name: 'John Doe',
    username: 'johndoe',
    location: 'New York',
    gender: 'Male',
  };

  const setup = (overrideProps = {}) => {
    const setValues = jest.fn();
    const onClose = jest.fn();

    render(
      <ProfileEditPopup
        currentValues={mockValues}
        setValues={setValues}
        onClose={onClose}
        {...overrideProps}
      />
    );

    return { setValues, onClose };
  };

  test('renders all input fields with current values', () => {
    setup();

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('New York')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Male')).toBeInTheDocument();
  });

  test('calls onClose when ❌ is clicked', () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByText('❌'));
    expect(onClose).toHaveBeenCalled();
  });

  test('updates tempValues and calls setValues on Done!', async () => {
    const { setValues, onClose } = setup();

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'janesmith' } });
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Austin' } });
    fireEvent.change(screen.getByLabelText('Gender'), { target: { value: 'Female' } });

    fireEvent.click(screen.getByText('Done!'));

    await waitFor(() => {
      expect(setValues).toHaveBeenCalledWith({
        name: 'Jane Smith',
        username: 'janesmith',
        location: 'Austin',
        gender: 'Female',
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('allows partial field edits and retains other values', async () => {
    const { setValues } = setup();
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Houston' } });
    fireEvent.click(screen.getByText('Done!'));

    await waitFor(() => {
      expect(setValues).toHaveBeenCalledWith({
        name: 'John Doe',
        username: 'johndoe',
        location: 'Houston',
        gender: 'Male',
      });
    });
  });
});