import { Home, Grid, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: Grid, label: "Catalog", path: "/products" },
        { icon: ShoppingBag, label: "Cart", path: "/cart" },
        { icon: User, label: "Profile", path: "/profile" }, // Placeholder for now
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
            <div className={cn(
                "flex items-center justify-around px-6 py-4",
                "bg-white/20 dark:bg-black/30 backdrop-blur-2xl",
                "border border-white/20 dark:border-white/10",
                "rounded-[2rem] shadow-glass-sm"
            )}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));

                    return (
                        <Link key={item.path} to={item.path} className="relative group">
                            <div className="flex flex-col items-center gap-1">
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={cn(
                                        "p-3 rounded-full transition-all duration-300",
                                        isActive ? "bg-primary text-white shadow-neon" : "text-foreground/70 group-hover:bg-white/10"
                                    )}
                                >
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                </motion.div>
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full shadow-neon"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
