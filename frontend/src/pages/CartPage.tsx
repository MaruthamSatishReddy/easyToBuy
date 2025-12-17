import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

export default function CartPage() {
    const { items, removeFromCart, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="container py-32 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Trash2 className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold">Your bag is empty</h2>
                    <p className="text-muted-foreground">Looks like you haven't found your aura yet.</p>
                    <Link to="/products" className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:brightness-110 transition-all">
                        Explore Collection
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto px-4 py-8 pb-32">
            <h1 className="text-4xl font-black mb-8 tracking-tight">Your Bag</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                            >
                                <GlassCard className="flex items-center gap-4 p-4 hover:border-primary/30 group">
                                    <div className="w-24 h-24 rounded-2xl bg-muted/50 overflow-hidden shrink-0">
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-gray-100">
                                            {/* Placeholder image logic if needed */}
                                            <img
                                                src="https://images.unsplash.com/photo-1551028919-ac66c9a3d683?w=200&auto=format&fit=crop&q=60"
                                                className="w-full h-full object-cover"
                                                alt={item.name}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg truncate pr-2">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground">{item.skuCode}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-2 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center mt-3">
                                            <div className="px-3 py-1 rounded-full bg-muted text-sm font-medium">
                                                Qty: {item.quantity}
                                            </div>
                                            <span className="font-bold text-lg">₹{item.price * item.quantity}</span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Summary Panel */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <GlassCard className="p-6 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-glass flex flex-col gap-6">
                        <h3 className="text-xl font-bold">Order Summary</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Shipping estimate</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Tax estimate</span>
                                <span>₹{Math.round(total * 0.18)}</span>
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                        <div className="flex justify-between items-baseline">
                            <span className="text-lg font-bold">Order Total</span>
                            <span className="text-2xl font-black">₹{total + Math.round(total * 0.18)}</span>
                        </div>

                        <Link
                            to="/checkout"
                            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-center shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        >
                            Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
