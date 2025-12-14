import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
    const { items, removeFromCart, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/" className="text-primary hover:underline">Continue shopping</Link>
            </div>
        );
    }

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-10">Shopping Cart</h1>
            <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-4">
                    {items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 border p-4 rounded-lg">
                            <div className="h-20 w-20 bg-muted rounded flex items-center justify-center text-xs">
                                {item.skuCode}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">${item.price * item.quantity}</p>
                                <button onClick={() => removeFromCart(item.id)} className="text-destructive text-sm mt-2 flex items-center">
                                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border p-6 rounded-lg h-fit">
                    <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                    <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>${total}</span>
                    </div>
                    <div className="border-t my-4"></div>
                    <div className="flex justify-between font-bold text-lg mb-6">
                        <span>Total</span>
                        <span>${total}</span>
                    </div>
                    <Link to="/checkout" className="block w-full bg-primary text-primary-foreground text-center py-3 rounded-md hover:bg-primary/90">
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}
