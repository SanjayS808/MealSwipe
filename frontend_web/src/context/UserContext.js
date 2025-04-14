import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const swipesRef = useRef(0);

    // Load user data from localStorage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Update localStorage whenever the user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user'); // Clear localStorage if user is null
        }
    }, [user]);

    const updateName = (newName) => {
        setUser((prev) => ({ ...prev, name: newName }));
    };

    const updateEmail = (newEmail) => {
        setUser((prev) => ({ ...prev, email: newEmail }));
    };

    const incrementSwipes = () => {
        swipesRef.current += 1;
        localStorage.setItem('swipes', swipesRef.current);
      };

    const getSwipes = () => swipesRef.current;

    const contextValue = {
        user,
        setUser,
        updateName,
        updateEmail,
        incrementSwipes,
        getSwipes,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserContext;