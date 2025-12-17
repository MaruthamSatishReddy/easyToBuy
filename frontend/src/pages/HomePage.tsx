import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';

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
}

const CATEGORIES = [
    { name: 'Men', img: 'https://images.unsplash.com/photo-1488161628813-9942db594469?w=300&auto=format&fit=crop&q=60git st' },
    { name: 'Women', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&auto=format&fit=crop&q=60' },
    { name: 'Kids', img: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=300&auto=format&fit=crop&q=60' },
    { name: 'Beauty', img: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=300&auto=format&fit=crop&q=60' },
    { name: 'Home', img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=300&auto=format&fit=crop&q=60' },
];

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/products')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                // Mock data if API fails
                setProducts([
                    { id: 1, skuCode: '1', name: 'Premium Silk Shirt', description: 'desc', price: 2999, brand: 'Zara', category: 'Men', rating: 4.5, images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60'] },
                    { id: 2, skuCode: '2', name: 'Urban Denim Jacket', description: 'desc', price: 4500, brand: 'Levis', category: 'Men', rating: 4.8, images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=60'] },
                    { id: 3, skuCode: '3', name: 'Floral Summer Dress', description: 'desc', price: 2100, brand: 'H&M', category: 'Women', rating: 4.2, images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=60'] },
                    { id: 4, skuCode: '4', name: 'Running Sneakers', description: 'desc', price: 5999, brand: 'Nike', category: 'Men', rating: 4.9, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60'] },
                ]);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 border-transparent"></div>
        </div>
    );

    return (
        <div className="space-y-12 pb-10">
            {/* Hero Section */}
            <section className="relative h-[65vh] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
                <img
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop&q=80"
                    className="w-full h-full object-cover"
                    alt="Hero"
                />

                {/* Frosted Layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex items-end p-8 md:p-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl space-y-4"
                    >
                        <div className="inline-block px-3 py-1 rounded-full bg-white/30 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-white mb-2">
                            New Collection 2026
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-md">
                            Redefine Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">Aura.</span>
                        </h1>
                        <p className="text-white/90 text-lg md:text-xl font-medium max-w-sm">
                            Experience the future of fashion with our premium verified collection.
                        </p>
                        <div className="pt-4 flex gap-4">
                            <button className="px-8 py-3 rounded-full bg-white text-black font-bold shadow-lg hover:bg-gray-100 transition-colors">
                                Shop Now
                            </button>
                            <button className="px-8 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white font-bold hover:bg-black/60 transition-colors">
                                View Lookbook
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section>
                <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className="text-2xl font-bold">Categories</h2>
                    <Link to="/products" className="text-primary text-sm font-semibold hover:underline">View All</Link>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-4 px-2 no-scrollbar snap-x snap-mandatory">
                    {CATEGORIES.map((cat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="snap-start shrink-0 flex flex-col items-center gap-3 group cursor-pointer"
                        >
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-accent">
                                <div className="w-full h-full rounded-full border-4 border-background overflow-hidden relative">
                                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>
                            <span className="font-semibold text-sm">{cat.name}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Trending Grid */}
            <section>
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="h-8 w-1 bg-primary rounded-full" />
                    <h2 className="text-2xl font-bold">Trending Now</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link to={`/product/${product.id}`} key={product.id}>
                            <GlassCard className="h-full flex flex-col p-3 hover:border-primary/30 group">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3">
                                    <img
                                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                                            <ShoppingBag size={14} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                                        {product.rating} <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                    </div>
                                </div>
                                <div className="mt-auto px-1">
                                    <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-primary">₹{product.price}</span>
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
