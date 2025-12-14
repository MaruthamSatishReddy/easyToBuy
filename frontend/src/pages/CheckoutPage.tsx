import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Loop through items and place order for each (Microservices MVP limit)
            // Ideally Order Service accepts a list. But we implemented single item.
            for (const item of items) {
                await orderApi.post('/orders', {
                    skuCode: item.skuCode,
                    price: item.price,
                    quantity: item.quantity,
                    email: email
                });
            }
            clearCart();
            navigate('/success');
        } catch (err) {
            console.error(err);
            alert('Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-10 max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="border p-6 rounded-lg">
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Order Summary</h3>
                    <p className="text-muted-foreground">Total: ${total}</p>
                    <p className="text-muted-foreground">Items: {items.length}</p>
                </div>
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full border rounded-md px-3 py-2"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}
