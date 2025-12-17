import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { Check, Mail, CreditCard, Box } from 'lucide-react';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            for (const item of items) {
                await orderApi.post('/orders', {
                    skuCode: item.skuCode,
                    price: item.price,
                    quantity: item.quantity,
                    email: email
                });
            }
            clearCart();
            // Simulate success animation
            setTimeout(() => navigate('/success'), 1000);

        } catch (err) {
            console.error(err);
            alert('Failed to place order'); // Replace with proper toast in real app
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4 flex items-center justify-center">
            <div className="w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <GlassCard className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-black">Checkout</h1>
                            <div className="flex gap-2">
                                <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                                <span className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                            </div>
                        </div>

                        {step === 1 && (
                            <motion.form
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={(e) => { e.preventDefault(); setStep(2); }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-3 ml-1 text-muted-foreground">
                                        <Mail size={16} /> Contact Info
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-white/50 border border-white/20 rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="p-4 rounded-xl bg-secondary/50 border border-white/10 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Total Items</span>
                                        <strong>{items.length}</strong>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total to Pay</span>
                                        <span className="text-primary">₹{total}</span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:shadow-neon transition-all"
                                >
                                    Continue
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 ml-1 text-muted-foreground">
                                        <CreditCard size={16} /> Payment Method
                                    </label>
                                    <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex justify-between items-center cursor-pointer">
                                        <span className="font-bold">Credit / Debit Card</span>
                                        <Check size={20} className="text-primary" />
                                    </div>
                                    <div className="p-4 rounded-xl border border-white/20 bg-white/40 flex justify-between items-center cursor-pointer opacity-60">
                                        <span className="font-bold">UPI / Netbanking</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-xl text-yellow-700 text-sm">
                                    <Box size={18} className="shrink-0 mt-0.5" />
                                    <p>Estimated delivery by <strong>Dec 28, 2026</strong>. Free shipping applied.</p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-4 font-bold text-muted-foreground hover:text-foreground"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="flex-[2] bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : 'Pay Now'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}
