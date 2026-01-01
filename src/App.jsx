// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout';
import Dashboard from './pages/Dashboard';
import UserPage from './pages/User';
import WiremockPage from './pages/Wiremock';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="user" element={<UserPage />} />
          <Route path="wiremock" element={<WiremockPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;