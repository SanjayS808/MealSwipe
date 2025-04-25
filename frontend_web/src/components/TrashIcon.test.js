import React, { useRef } from 'react';
import { render, act } from '@testing-library/react';
import TrashIcon from './TrashIcon';

// Helper to call `flash()` on a forwarded ref component
const Wrapper = () => {
  const flashRef = useRef();
  return (
    <div>
      <button onClick={() => flashRef.current.flash()}>Trigger</button>
      <TrashIcon ref={flashRef} />
    </div>
  );
};

jest.useFakeTimers();

describe('TrashFlash Component', () => {
  test('should not render initially', () => {
    const { queryByTestId } = render(<TrashIcon ref={{ current: null }} />);
    expect(queryByTestId('trash-icon')).not.toBeInTheDocument();
  });

  test('flashes trash icon on flash() call', () => {
    const { getByRole, getByTestId, queryByTestId } = render(<Wrapper />);

    // Click to trigger flash
    act(() => {
      getByRole('button', { name: /trigger/i }).click();
    });

    // Icon should now be visible
    expect(getByTestId('trash-icon')).toBeInTheDocument();

    // Fast forward the timeout
    act(() => {
      jest.advanceTimersByTime(600);
    });

    // Icon should disappear after timeout
    expect(queryByTestId('trash-icon')).not.toBeInTheDocument();
  });
});
