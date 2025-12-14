import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Features from './pages/Features';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import Support from './pages/Support';
import UserManual from './pages/support/UserManual';
import WarrantyRegistration from './pages/support/WarrantyRegistration';
import Troubleshooting from './pages/support/Troubleshooting';
import ReplacementParts from './pages/support/ReplacementParts';

// Legal pages
import Impressum from './pages/Impressum';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import WithdrawalPolicy from './pages/WithdrawalPolicy';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Cart & Checkout
import Cart from './pages/cart/Cart';
import Checkout from './pages/cart/Checkout';

// Account pages
import Dashboard from './pages/account/Dashboard';
import Orders from './pages/account/Orders';
import OrderDetail from './pages/account/OrderDetail';
import Profile from './pages/account/Profile';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminSettings from './pages/admin/Settings';
import AdminAnalytics from './pages/admin/Analytics';
import AdminContent from './pages/admin/Content';
import AdminEmailTemplates from './pages/admin/EmailTemplates';

// Protected Route component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

// Admin Protected Route component
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <DarkModeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <CookieConsent />
              <Routes>
                {/* Admin routes - Separate layout */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products/new"
                  element={
                    <AdminRoute>
                      <ProductForm />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products/edit/:id"
                  element={
                    <AdminRoute>
                      <ProductForm />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/customers"
                  element={
                    <AdminRoute>
                      <AdminCustomers />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <AdminRoute>
                      <AdminSettings />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <AdminRoute>
                      <AdminAnalytics />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/content"
                  element={
                    <AdminRoute>
                      <AdminContent />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/emails"
                  element={
                    <AdminRoute>
                      <AdminEmailTemplates />
                    </AdminRoute>
                  }
                />

                {/* Main site routes */}
                <Route
                  path="/*"
                  element={
                    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950 font-display text-gray-900 dark:text-gray-100">
                      <Header />
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/support/user-manual" element={<UserManual />} />
                        <Route path="/support/warranty" element={<WarrantyRegistration />} />
                        <Route path="/support/troubleshooting" element={<Troubleshooting />} />
                        <Route path="/support/replacement-parts" element={<ReplacementParts />} />

                        {/* Legal routes */}
                        <Route path="/impressum" element={<Impressum />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-conditions" element={<TermsConditions />} />
                        <Route path="/withdrawal-policy" element={<WithdrawalPolicy />} />

                        {/* Auth routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        {/* Cart routes */}
                        <Route path="/cart" element={<Cart />} />
                        <Route
                          path="/checkout"
                          element={
                            <ProtectedRoute>
                              <Checkout />
                            </ProtectedRoute>
                          }
                        />

                        {/* Account routes - Protected */}
                        <Route
                          path="/account"
                          element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/account/orders"
                          element={
                            <ProtectedRoute>
                              <Orders />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/account/orders/:id"
                          element={
                            <ProtectedRoute>
                              <OrderDetail />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/account/profile"
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                      <Footer />
                    </div>
                  }
                />
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </DarkModeProvider>
  );
}

export default App;
