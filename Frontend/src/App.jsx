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

const App = () => {

  return (
     <>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/userScreen" element={<StorePage />} />
          <Route path="/OwnerScreen" element={<CreateStore />} />
          <Route path="/OwnerDashboard" element={<OwnerStoreDashboard />} />
          <Route path="/store/:storeId" element={<SingleStorePage />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />

        </Routes>
      </main>
    </>
  );
};

export default App;
