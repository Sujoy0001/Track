import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavoriteIds(storedFavorites);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (songId) => {
    setFavoriteIds(prev =>
      prev.includes(songId)
        ? prev.filter(id => id !== songId) // remove
        : [...prev, songId] // add
    );
  };

  const removeFavorite = (songId) => {
    setFavoriteIds(prev => prev.filter(id => id !== songId));
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
