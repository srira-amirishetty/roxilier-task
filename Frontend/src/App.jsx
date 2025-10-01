import {Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './screens/Login'
import Register from './screens/Register'
import AdminLogin from './screens/AdminLogin';
import { StorePage } from './screens/Store';
import CreateStore from './screens/CreateStore';
import { OwnerStoreDashboard } from './screens/OwnerDashboard';
import SingleStorePage from './screens/StoreItem';
import Dashboard from './screens/AdminDashboard';
import AdminDashboard from './screens/AdminDashboard';
import ProtectedRoute from './components/protectedRoute';

const App = () => {

const user = JSON.parse(localStorage.getItem("user"));

  return (
     <>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/userScreen" element={<StorePage />} />
          <Route path="/OwnerScreen" element={<ProtectedRoute user={user} allowedRoles={["shopOwner","admin"]}><CreateStore /></ProtectedRoute>} />
          <Route path="/OwnerDashboard" element={<ProtectedRoute user={user} allowedRoles={["shopOwner","admin"]}><OwnerStoreDashboard /></ProtectedRoute>} />
          <Route path="/store/:storeId" element={<SingleStorePage />} />
          <Route path="/AdminDashboard" element={<ProtectedRoute user={user} allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

        </Routes>
      </main>
    </>
  );
};

export default App;
