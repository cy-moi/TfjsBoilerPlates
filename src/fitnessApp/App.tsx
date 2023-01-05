
import React, { useEffect, useState }from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CollectPage from './CollectPage';
import TestPage from './TestPage';

function App() {


  const router = createBrowserRouter([
    {
      path: "/fitness",
      element: <TestPage />,
    }
  ]);

  return (
    // <React.StrictMode>
      <RouterProvider router={router} />
    // </React.StrictMode>
  )
}

export default App