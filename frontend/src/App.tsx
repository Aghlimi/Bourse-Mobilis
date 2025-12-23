import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './component/Login'
import Register from './component/Register'
import { AppContext } from './context'
import React from 'react';
import Dashboard from './component/Dashboard';
import type { User } from './types';

function AppRouter() {
  const [me, setMe] = React.useState<User | null | undefined>(null);

  return (
    <AppContext.Provider value={{ me, setMe }}>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default AppRouter