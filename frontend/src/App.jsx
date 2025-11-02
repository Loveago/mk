import { Route, Routes, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import Home from './pages/Home.jsx';
import ProductList from './pages/ProductList.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Account from './pages/Account.jsx';
import VendorDashboard from './pages/VendorDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function useSearchNavigation() {
  const navigate = useNavigate();
  return useMemo(
    () => ({
      handleSearch: (query) => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        navigate(`/products${params.toString() ? `?${params.toString()}` : ''}`);
      },
    }),
    [navigate]
  );
}

export default function App() {
  const { handleSearch } = useSearchNavigation();

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute roles={['CUSTOMER', 'ADMIN']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor"
            element={
              <ProtectedRoute roles={['VENDOR', 'ADMIN']}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

