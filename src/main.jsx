import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Layout1 from './layout/Layout1.jsx';
import Home from "./pages/Home.jsx";
import Favorites from './pages/Favorites.jsx';
import Upload from './pages/Upload.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx'; // <-- import the provider
import Playlist from './pages/Playlist.jsx';
import Recent from './pages/Recent.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout1 />,
    children: [
      { index: true, element: <Home /> },
      { path: "fav", element: <Favorites /> },
      { path: "upload", element: <Upload /> },
      { path: "playlist", element: <Playlist /> },
      { path: "recent", element: <Recent /> },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FavoritesProvider> {/* Wrap everything in FavoritesProvider */}
      <RouterProvider router={router} />
    </FavoritesProvider>
  </React.StrictMode>
);
