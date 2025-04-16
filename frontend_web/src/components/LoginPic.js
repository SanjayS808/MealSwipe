import { React } from 'react'
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';

const LoginPic = () => {
  const { user, } = useUser();  
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (user) {
      navigate('/profile')
    } else {
      navigate('/login'); // If user is logged out, navigate to login
    }
  };

  return (
    <div
      onClick={handleLoginClick} // Use onClick instead of href
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 0,
        cursor: 'pointer', // Indicate clickable
      }}
      >
      <div style={{
        width: 50,
        height: 50,
        padding: 0,
        margin: '.1em',
        borderRadius: 50,
        overflow: 'hidden',
        border: '2px solid white',
        boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)', // Adjusted boxShadow for web
      }}>
        {user && user?.picture ? (
          <img
            src={user.picture}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <p style={{
            fontSize: '0.7em',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            lineHeight: '40px',
            margin: 0,
          }}>
            Login
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPic;
