import React, { useImperativeHandle, forwardRef, useState, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import './heart.css'; // Keep using this if it has the pulse keyframes

const TrashFlash = forwardRef((_, ref) => {
  const [visibleT, setVisibleT] = useState(false);
  const trashRef = useRef();

  useImperativeHandle(ref, () => ({
    flash: () => {
      if (trashRef.current) {
        trashRef.current.style.animation = 'none';
        void trashRef.current.offsetHeight;
        trashRef.current.style.animation = 'pulse 0.6s ease-in-out';
      }
      setVisibleT(true);
      setTimeout(() => setVisibleT(false), 600);
    },
  }));

  if (!visibleT) return null;

  return (
    
    <div style={styles.overlay}>
        {console.log("TrashFlash")}
          <FaTrash ref={trashRef} data-testid="trash-icon" style={styles.icon} />
        </div>
  );
});

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '90vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 9999,
  },
  icon: {
    fontSize: '4.5rem',
    color: 'grey', // bright red
    animation: 'pulse 0.6s ease-in-out',
  }
};

export default TrashFlash;
