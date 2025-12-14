import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';

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
    { name: 'Men', img: 'https://images.unsplash.com/photo-1488161628813-9942db594469?w=300&auto=format&fit=crop&q=60' },
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
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex justify-center items-center h-[50vh] text-myntra-pink font-bold animate-pulse">Loading Collection...</div>;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Category Circles (Myntra Style) */}
            <div className="bg-white py-6 border-b">
                <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
                    <div className="flex justify-between min-w-[600px] md:justify-center gap-10">
                        {CATEGORIES.map((cat, idx) => (
                            <div key={idx} className="flex flex-col items-center cursor-pointer group">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-myntra-pink p-0.5 transition-all mb-2">
                                    <img src={cat.img} alt={cat.name} className="w-full h-full rounded-full object-cover" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 group-hover:text-myntra-pink uppercase tracking-wide">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="relative w-full h-[500px] bg-gradient-to-r from-purple-500 to-pink-500 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80"
                    className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                    alt="Hero"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white space-y-4 max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-[0.2em] mb-2">The Season's Best</h2>
                        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">
                            FASHION <span className="text-yellow-300">SALE</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-medium tracking-wide mb-8">
                            FLAT 50-80% OFF ON TOP BRANDS
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="bg-white text-myntra-pink px-12 py-4 rounded-full font-black text-lg hover:shadow-2xl hover:scale-105 transition-transform uppercase tracking-widest">
                                Explore Now
                            </button>
                            <button className="border-2 border-white text-white px-12 py-4 rounded-full font-black text-lg hover:bg-white/10 transition-colors uppercase tracking-widest">
                                View Offers
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">

                {/* Section Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-widest mb-2">Trending Now</h2>
                        <div className="h-1 w-20 bg-myntra-pink"></div>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-xl text-gray-500">Inventory Updates in Progress.</p>
                        <p className="text-sm text-gray-400">Please check back in a moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map(product => (
                            <Link to={`/product/${product.id}`} key={product.id} className="group block bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative border border-transparent hover:border-gray-100">

                                {/* Image Container */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=60"}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {/* Rating Badge */}
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded-sm text-xs font-bold flex items-center gap-1 shadow-sm">
                                        {product.rating || 4.2} <Star className="w-3 h-3 text-teal-500 fill-current" /> | 1.2k
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                                        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-myntra-pink shadow-md">
                                            <Heart className="h-5 w-5" />
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-black shadow-md">
                                            <ShoppingBag className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-3 truncate font-light">{product.brand || "Brand"}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-lg">Rs. {product.price}</span>
                                        <span className="text-sm text-gray-400 line-through">Rs. {Math.round(product.price * 1.5)}</span>
                                        <span className="text-xs text-orange-500 font-bold uppercase">(33% OFF)</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Banner Strip */}
            <div className="bg-myntra-pink text-white py-12 text-center my-10">
                <h2 className="text-4xl font-black uppercase tracking-widest mb-4">Download the App</h2>
                <p className="text-lg opacity-90 mb-8">Get exciting offers and exclusive deals on the App.</p>
                <div className="flex justify-center gap-4">
                    <button className="bg-black text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-900">
                        Google Play
                    </button>
                    <button className="bg-white text-black px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-100">
                        App Store
                    </button>
                </div>
            </div>

        </div>
    );
}
