import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Notices from './pages/Notices.jsx';
import NoticeDetail from './pages/NoticeDetail.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Navigate to="/notices" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/notices"
            element={
              <ProtectedRoute>
                <Notices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notices/:id"
            element={
              <ProtectedRoute>
                <NoticeDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage/admins"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
