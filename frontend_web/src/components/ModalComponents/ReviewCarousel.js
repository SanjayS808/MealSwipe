import React, { useState } from 'react';

function ReviewCarousel({ reviews }) {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const next = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
    setExpanded(false);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
    setExpanded(false);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const MAX_LENGTH = 150;
  const currentReview = reviews[current];
  const isLong = currentReview.text.length > MAX_LENGTH;
  const displayedText = expanded || !isLong
    ? currentReview.text
    : currentReview.text.slice(0, MAX_LENGTH) + '...';

  const styles = {
    container: {
      position: 'relative',
      padding: '1em',
      backgroundColor: '#fff0e2',
      borderRadius: '10px',
      marginTop: '1em',
      textAlign: 'center',
    },
    button: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: '#fec195',
      border: 'none',
      padding: '0.5em',
      cursor: 'pointer',
      borderRadius: '50%',
      fontSize: '1.2em',
      fontWeight: 'bold',
    },
    leftButton: { left: '-15px' },
    rightButton: { right: '-15px' },
    text: {
      fontStyle: 'italic',
      marginBottom: '0.5em',
    },
    author: {
      fontWeight: 'bold',
    },
    readMore: {
      color: '#007bff',
      cursor: 'pointer',
      fontSize: '0.9em',
      display: 'inline-block',
      marginTop: '0.3em'
    }
  };

  if (!reviews || reviews.length === 0) return <p>No reviews available</p>;

  return (
    <div style={styles.container}>
      <button onClick={prev} style={{ ...styles.button, ...styles.leftButton }}>
        ‹
      </button>

      <div>
        <p style={styles.text}>
          "{displayedText}"
          {isLong && (
            <span onClick={toggleExpand} style={styles.readMore}>
              {expanded ? ' Read less' : ' Read more'}
            </span>
          )}
        </p>
        <p style={styles.author}>– {currentReview.author}</p>
      </div>

      <button onClick={next} style={{ ...styles.button, ...styles.rightButton }}>
        ›
      </button>
    </div>
  );
}

export default ReviewCarousel;
