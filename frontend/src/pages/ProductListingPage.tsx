import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Link } from "react-router-dom";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    brand: string;
    category: string;
    rating: number;
    images: string[];
}

// ...

export default function ProductListingPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        // Simulating API call
        setTimeout(() => {
            // ...
            // Mock data
            setProducts(Array.from({ length: 12 }).map((_, i) => ({
                id: i + 1,
                name: `Premium Item ${i + 1}`,
                description: 'Description',
                price: 1500 + i * 100,
                brand: i % 2 === 0 ? 'Nike' : 'Adidas',
                category: 'Men',
                rating: 4.5,
                images: [`https://images.unsplash.com/photo-${1500000000000 + i}?w=500&auto=format&fit=crop&q=60`]
            })));
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-transparent"></div>
        </div>
    );

    return (
        <div className="min-h-screen pb-24 relative">
            {/* Header / Filter Toggle */}
            <div className="sticky top-20 z-30 flex items-center justify-between py-4 bg-background/80 backdrop-blur-md mb-4">
                <h1 className="text-3xl font-bold tracking-tight">Men's Collection</h1>
                <button
                    onClick={() => setShowFilters(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold shadow-sm hover:bg-gray-100 transition-colors"
                >
                    <Filter size={18} /> Filters
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <Link to={`/product/${product.id}`}>
                            <GlassCard className="h-full aspect-[3/4] p-0 flex flex-col group cursor-pointer hover:border-primary/50">
                                <div className="relative flex-1 overflow-hidden">
                                    <img
                                        src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80`}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <p className="text-white font-medium truncate">{product.description}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 backdrop-blur-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-lg">{product.name}</h3>
                                        <span className="font-semibold text-primary">₹{product.price}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                                </div>
                            </GlassCard>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Floating Filter Panel (iOS Sheet style) */}
            <AnimatePresence>
                {showFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilters(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-[2rem] p-6 h-[80vh] overflow-y-auto shadow-2xl border-t border-white/10"
                        >
                            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-8" />

                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Filters</h2>
                                <button onClick={() => setShowFilters(false)} className="p-2 bg-muted rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Price Range */}
                                <div>
                                    <h3 className="font-semibold mb-4 text-lg">Price Range</h3>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-1/2" />
                                    </div>
                                    <div className="flex justify-between text-sm mt-2 text-muted-foreground">
                                        <span>₹500</span>
                                        <span>₹10,000+</span>
                                    </div>
                                </div>

                                {/* Brands */}
                                <div>
                                    <h3 className="font-semibold mb-4 text-lg">Brands</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Nike', 'Adidas', 'Puma', 'Zara', 'H&M', 'Levis'].map(brand => (
                                            <button key={brand} className="px-4 py-2 rounded-full border border-border hover:bg-primary hover:text-white transition-colors">
                                                {brand}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <h3 className="font-semibold mb-4 text-lg">Sort By</h3>
                                    <div className="space-y-2">
                                        {['Recommended', 'Newest', 'Price: Low to High', 'Price: High to Low'].map(opt => (
                                            <div key={opt} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted cursor-pointer">
                                                <span>{opt}</span>
                                                {opt === 'Recommended' && <div className="w-2 h-2 bg-primary rounded-full" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="sticky bottom-0 pt-4 bg-card mt-8">
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
