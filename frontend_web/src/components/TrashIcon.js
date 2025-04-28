/**
 * @module TrashFlash
 * @description A component that displays a brief animated trash icon flash effect
 * to provide visual feedback when an item is removed or deleted.
 * Uses CSS animations for a pulsing effect.
 */

import React, { useImperativeHandle, forwardRef, useState, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import './heart.css'; // Contains the pulse keyframes animation

/**
 * Animated trash icon that flashes briefly on screen
 * @function TrashFlash
 * @memberof module:TrashFlash
 * @param {React.Ref} ref - Forwarded ref to access the flash method
 * @returns {JSX.Element|null} The rendered trash icon or null when not visible
 */
const TrashFlash = forwardRef((_, ref) => {
  const [visibleT, setVisibleT] = useState(false);
  const trashRef = useRef();

  /**
   * Exposes the flash method through the forwarded ref
   * @memberof module:TrashFlash
   */
  useImperativeHandle(ref, () => ({
    /**
     * Triggers the trash icon flash animation
     * @function flash
     * @memberof module:TrashFlash
     */
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
      <FaTrash ref={trashRef} style={styles.icon} />
    </div>
  );
});

/**
 * Component styles
 * @constant {Object} styles
 * @memberof module:TrashFlash
 * @property {Object} overlay - Styles for the overlay container
 * @property {Object} icon - Styles for the trash icon
 */
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
    color: 'grey',
    animation: 'pulse 0.6s ease-in-out',
  }
};

/**
 * @exports TrashFlash
 */
export default TrashFlash;