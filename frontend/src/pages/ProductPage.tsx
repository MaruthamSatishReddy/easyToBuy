import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Heart, Star, ChevronLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

interface Product {
    id: number;
    skuCode: string;
    name: string;
    description: string;
    price: number;
    brand: string;
    category: string;
    rating: number;
    images: string[];
    sizes: string[];
}

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState(0);

    /* Fake data load */
    useEffect(() => {
        // Mocking fetch 
        setTimeout(() => {
            setProduct({
                id: Number(id),
                skuCode: 'SKU-' + id,
                name: 'Neon Verse Jacket',
                description: 'A premium oversized jacket with neon accents and futuristic material finish. Perfect for the night city vibes.',
                price: 4500,
                brand: 'Urban Aura',
                category: 'Outerwear',
                rating: 4.8,
                images: [
                    'https://images.unsplash.com/photo-1551028919-ac66c9a3d683?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80'
                ],
                sizes: ['S', 'M', 'L', 'XL']
            });
        }, 500);
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        if (!selectedSize) {
            alert("Please select a size"); // Could be a toast
            return;
        }
        setIsAdding(true);
        addToCart({
            id: product.id,
            skuCode: product.skuCode,
            name: product.name,
            price: product.price,
            quantity: 1
        });
        setTimeout(() => {
            setIsAdding(false);
            navigate('/cart');
        }, 500);
    };

    if (!product) return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-transparent"></div>
        </div>
    );

    return (
        <div className="min-h-screen relative pb-32">
            {/* Immersive Background Image */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-background/80 lg:bg-background/90 z-10 backdrop-blur-[2px]" />
                <img
                    src={product.images[0]}
                    className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
                    alt="Background"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 lg:px-8 py-4 lg:py-10">
                {/* Nav Header */}
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all text-foreground">
                        <ChevronLeft />
                    </button>
                    <button className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all text-foreground">
                        <Share2 size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Main Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-[3/4] lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
                    >
                        <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />

                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {product.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === activeImage ? 'bg-white w-6' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Details Sheet */}
                    <div className="flex flex-col justify-end lg:justify-center">
                        <GlassCard className="p-6 lg:p-10 space-y-6 bg-white/40 dark:bg-black/40 border-none shadow-none lg:shadow-glass">
                            <div>
                                <h3 className="text-xl font-medium text-primary mb-1">{product.brand}</h3>
                                <h1 className="text-4xl lg:text-5xl font-black mb-2 tracking-tight">{product.name}</h1>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center px-2 py-1 bg-black/80 text-white rounded-lg text-xs font-bold gap-1">
                                        {product.rating} <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">1.2k Verified Reviews</span>
                                </div>

                                <p className="text-lg leading-relaxed text-muted-foreground">{product.description}</p>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

                            {/* Sizes */}
                            <div>
                                <span className="block text-sm font-bold uppercase tracking-wider mb-3">Select Size</span>
                                <div className="flex flex-wrap gap-3">
                                    {(product.sizes || ['S', 'M', 'L']).map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`
                                                w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all
                                                ${selectedSize === size
                                                    ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                                                    : 'bg-white/50 hover:bg-white text-foreground'
                                                }
                                            `}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

                            {/* Price & Action */}
                            <div className="pt-2">
                                <div className="flex items-end gap-3 mb-6">
                                    <span className="text-4xl font-black">₹{product.price}</span>
                                    <span className="text-xl text-muted-foreground line-through mb-1">₹{product.price + 2000}</span>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isAdding}
                                        className="flex-1 py-4 rounded-2xl bg-foreground text-background font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag size={20} />
                                        {isAdding ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                    <button className="p-4 rounded-2xl bg-white/50 backdrop-blur-md border border-white/20 text-foreground hover:bg-white transition-all">
                                        <Heart size={24} />
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
