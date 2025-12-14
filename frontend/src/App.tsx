import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={
                <div className="container py-20 text-center">
                  <h1 className="text-4xl font-bold mb-4 text-green-600">Order Placed Successfully!</h1>
                  <p className="text-lg text-muted-foreground">Thank you for your purchase. You will receive a confirmation email shortly.</p>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
