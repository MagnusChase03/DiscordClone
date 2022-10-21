/* HEADER COMMENTS
*/

import { useState } from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ServerSelect from './pages/ServerSelect';
import ChatWindow from './pages/ChatWindow';
import NoPage from './pages/NoPage';
import UserManagement from './pages/UserManagement';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route index element={<Home />} />
            <Route path="servers" element={<ServerSelect />} />
            <Route path="chat" element={<ChatWindow />} />
            <Route path="user" element={<UserManagement />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );

}

export default App
