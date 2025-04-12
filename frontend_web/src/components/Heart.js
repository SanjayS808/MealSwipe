import React, { useImperativeHandle, forwardRef, useState, useRef } from 'react';
import { FaHeart } from 'react-icons/fa';
import './heart.css'; 

const HeartFlash = forwardRef((_, ref) => {
  const [visible, setVisible] = useState(false);
  const heartRef = useRef();

  useImperativeHandle(ref, () => ({
    flash: () => {
      if (heartRef.current) {
        heartRef.current.style.animation = 'none';
        void heartRef.current.offsetHeight; 
        heartRef.current.style.animation = 'pulse 0.6s ease-in-out';

      }
      setVisible(true);
      setTimeout(() => setVisible(false), 600);
    },
  }));

  if (!visible) return null;

  return (
    
    <div style={styles.overlay}>
      <FaHeart ref={heartRef} style={styles.heart} />
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
  
  heart: {
    fontSize: '5rem',
    color: '#d9413d',
    
    animation: 'pulse 0.6s ease-in-out',
  }
};

export default HeartFlash;
