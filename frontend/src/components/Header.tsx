import { Search, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Header() {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
        >
            <div className="flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">
                    Aura<span className="text-foreground/80">Shop</span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/30 transition-all">
                        <Search size={20} className="text-foreground/80" />
                    </button>
                    <button className="relative p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/30 transition-all">
                        <Bell size={20} className="text-foreground/80" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </div>
            </div>
        </motion.header>
    );
}
