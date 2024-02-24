import React from 'react'
import { HashRouter, useRoutes } from "react-router-dom";
import ReactDOM from 'react-dom/client'

import Normal from './layouts/Normal';
import Clear from './layouts/Clear';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddMember from './pages/AddMember';

import './index.css'

const Router = () => useRoutes([
  {
    element: <Normal />,
    children: [
      {
        path: '/',
        element: <Home />,
        name: 'home'
      },
      {
        path: '/addMember',
        element: <AddMember />,
        name: 'addMember'
      },
    ],
  },
  {
    element: <Clear />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Router />
    </HashRouter>
  </React.StrictMode>
)
