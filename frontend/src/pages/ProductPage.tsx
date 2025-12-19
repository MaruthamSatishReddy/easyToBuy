import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Heart, Star, ChevronLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import ProductImageGallery from '@/components/ProductImageGallery';
import api from '../api';

interface Product {
    id: string;
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // Fetch product from API
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (err: any) {
                console.error('Error fetching product:', err);
                setError(err.response?.data?.message || 'Failed to load product. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }
        setIsAdding(true);
        addToCart({
            id: Number(product.id),
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

    // Loading state
    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-transparent mx-auto"></div>
                    <p className="text-muted-foreground">Loading product...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !product) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md px-4">
                    <div className="text-6xl">😕</div>
                    <h2 className="text-2xl font-bold">Product Not Found</h2>
                    <p className="text-muted-foreground">{error || 'The product you are looking for does not exist.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative pb-32">
            {/* Immersive Background Image */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-background/80 lg:bg-background/90 z-10 backdrop-blur-[2px]" />
                <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
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
                    {/* Product Image Gallery */}
                    <ProductImageGallery
                        images={product.images || []}
                        productName={product.name}
                    />

                    {/* Details Sheet */}
                    <div className="flex flex-col justify-end lg:justify-center">
                        <GlassCard className="p-6 lg:p-10 space-y-6 bg-white/40 dark:bg-black/40 border-none shadow-none lg:shadow-glass">
                            <div>
                                <h3 className="text-xl font-medium text-primary mb-1">{product.brand}</h3>
                                <h1 className="text-4xl lg:text-5xl font-black mb-2 tracking-tight">{product.name}</h1>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center px-2 py-1 bg-black/80 text-white rounded-lg text-xs font-bold gap-1">
                                        {product.rating?.toFixed(1) || '4.5'} <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">Verified Reviews</span>
                                </div>

                                <p className="text-lg leading-relaxed text-muted-foreground">{product.description}</p>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

                            {/* Sizes */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <span className="block text-sm font-bold uppercase tracking-wider mb-3">Select Size</span>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map(size => (
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
                            )}

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
                                        className="flex-1 py-4 rounded-2xl bg-foreground text-background font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
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
