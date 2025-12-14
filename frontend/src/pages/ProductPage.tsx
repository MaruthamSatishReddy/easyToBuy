import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Heart, Star, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';

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

    useEffect(() => {
        // Fetch all products and find by ID (Client-side filtering for MVP)
        api.get('/products')
            .then(res => {
                const found = res.data.find((p: any) => p.id.toString() === id);
                setProduct(found);
            })
            .catch(console.error);
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        if (!selectedSize) {
            alert("Please select a size");
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

    if (!product) return <div className="flex justify-center items-center h-screen text-myntra-pink font-bold">Loading...</div>;

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-10">

                {/* Breadcrumbs */}
                <div className="text-sm text-gray-500 mb-6 flex gap-2">
                    <span>Home</span> / <span>Clothing</span> / <span className="font-bold text-gray-900">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Image Gallery */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2 aspect-[3/4] overflow-hidden rounded-sm cursor-zoom-in">
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=70"}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 ? product.images.slice(1, 3).map((img, idx) => (
                            <div key={idx} className="aspect-[3/4] overflow-hidden rounded-sm">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                        )) : (
                            <div className="aspect-[3/4] overflow-hidden rounded-sm">
                                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&auto=format&fit=crop&q=60" alt="" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="pt-2">
                        <h2 className="text-xl font-bold text-gray-500 mb-1">{product.brand || "Brand"}</h2>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <p className="text-lg text-gray-500 mb-4">{product.description}</p>

                        {/* Ratings */}
                        <div className="flex items-center gap-2 mb-6 border-b pb-6">
                            <div className="flex items-center border border-gray-200 px-2 py-0.5 rounded-sm">
                                <span className="font-bold text-sm mr-1">{product.rating || 4.2}</span>
                                <Star className="w-3 h-3 text-myntra-pink fill-current" />
                            </div>
                            <span className="text-gray-500 text-sm">| {Math.floor(Math.random() * 1000) + 500} Ratings</span>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-gray-900">Rs. {product.price}</span>
                                <span className="text-xl text-gray-400 line-through">Rs. {Math.round(product.price * 1.5)}</span>
                                <span className="text-xl text-orange-500 font-bold">(33% OFF)</span>
                            </div>
                            <p className="text-green-600 font-bold text-xs mt-1">inclusive of all taxes</p>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-4">
                                <span className="font-bold text-gray-900 uppercase">Select Size</span>
                                <span className="text-myntra-pink font-bold text-sm cursor-pointer uppercase">Size Chart</span>
                            </div>
                            <div className="flex gap-4">
                                {product.sizes && product.sizes.length > 0 ? product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center border font-bold hover:border-myntra-pink hover:text-myntra-pink transition-all ${selectedSize === size
                                                ? 'border-myntra-pink text-myntra-pink bg-pink-50'
                                                : 'border-gray-300 text-gray-600'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                )) : (
                                    // Fallback sizes if none in DB
                                    ['S', 'M', 'L', 'XL'].map(size => (
                                        <button key={size} onClick={() => setSelectedSize(size)} className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-300 font-bold hover:border-myntra-pink">{size}</button>
                                    ))
                                )}
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-4 mb-10">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className="flex-1 bg-myntra-pink text-white py-4 rounded-md font-bold uppercase tracking-wider hover:shadow-lg hover:bg-pink-600 transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {isAdding ? 'Adding...' : 'Add to Bag'}
                            </button>
                            <button className="flex-1 border border-gray-300 text-gray-900 py-4 rounded-md font-bold uppercase tracking-wider hover:border-gray-900 transition-all flex items-center justify-center gap-2">
                                <Heart className="w-5 h-5" /> Wishlist
                            </button>
                        </div>

                        {/* Delivery Options */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 uppercase flex items-center gap-2">
                                Delivery Options <Truck className="w-5 h-5 text-gray-600" />
                            </h3>
                            <div className="flex items-center relative">
                                <input
                                    type="text"
                                    placeholder="Enter Pincode"
                                    className="w-64 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-myntra-pink font-medium"
                                />
                                <button className="text-myntra-pink font-bold text-sm absolute left-48">Check</button>
                            </div>
                            <p className="text-xs text-gray-500">Please enter PIN code to check delivery time & Pay on Delivery Availability.</p>

                            <div className="space-y-2 mt-4">
                                <div className="flex items-center gap-3 text-gray-600 text-sm">
                                    <ShieldCheck className="w-5 h-5" /> 100% Original Products
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 text-sm">
                                    <RefreshCcw className="w-5 h-5" /> Pay on delivery might be available
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 text-sm">
                                    <RefreshCcw className="w-5 h-5" /> Easy 14 days returns and exchanges
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
