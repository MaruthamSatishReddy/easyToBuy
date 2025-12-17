import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({
    children,
    className,
    hoverEffect = true,
    ...props
}: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? { y: -5, scale: 1.02 } : {}}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            className={cn(
                "relative overflow-hidden rounded-3xl",
                "bg-white/10 dark:bg-black/20",
                "backdrop-blur-xl border border-white/20 dark:border-white/10",
                "shadow-glass dark:shadow-glass-sm",
                "transition-all duration-300",
                className
            )}
            {...props}
        >
            {/* Glossy gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
