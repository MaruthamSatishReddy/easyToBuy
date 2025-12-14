import { ShoppingBag, Search, User, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function Header() {
    const { items } = useCart();

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 mr-10">
                    {/* Placeholder for Myntra-like logo */}
                    <div className="w-10 h-10 bg-myntra-pink rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        ETB
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:block">EasyToBuy</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    <Link to="/men" className="hover:text-myntra-pink hover:border-b-4 border-myntra-pink pb-7 pt-7 transition-all">Men</Link>
                    <Link to="/women" className="hover:text-myntra-pink hover:border-b-4 border-myntra-pink pb-7 pt-7 transition-all">Women</Link>
                    <Link to="/kids" className="hover:text-myntra-pink hover:border-b-4 border-myntra-pink pb-7 pt-7 transition-all">Kids</Link>
                    <Link to="/living" className="hover:text-myntra-pink hover:border-b-4 border-myntra-pink pb-7 pt-7 transition-all">Home & Living</Link>
                    <Link to="/beauty" className="hover:text-myntra-pink hover:border-b-4 border-myntra-pink pb-7 pt-7 transition-all">Beauty</Link>
                </nav>

                {/* Search Bar */}
                <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-200 sm:text-sm transition-colors"
                        placeholder="Search for products, brands and more"
                    />
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center cursor-pointer group">
                        <User className="h-5 w-5 text-gray-600 group-hover:text-black" />
                        <span className="text-[10px] font-bold text-gray-600 group-hover:text-black mt-1">Profile</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer group">
                        <Heart className="h-5 w-5 text-gray-600 group-hover:text-black" />
                        <span className="text-[10px] font-bold text-gray-600 group-hover:text-black mt-1">Wishlist</span>
                    </div>
                    <Link to="/cart" className="flex flex-col items-center cursor-pointer group relative">
                        <ShoppingBag className="h-5 w-5 text-gray-600 group-hover:text-black" />
                        {items.length > 0 && (
                            <span className="absolute -top-1 -right-2 bg-myntra-pink text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {items.length}
                            </span>
                        )}
                        <span className="text-[10px] font-bold text-gray-600 group-hover:text-black mt-1">Bag</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
