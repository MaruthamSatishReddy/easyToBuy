import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    Settings,
    LogOut,
    Menu,
    Box,
    FileText,
    Activity
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
// Button import removed


// Placeholder Button since we haven't created the component file yet, 
// normally this would be imported.
function SidebarLink({ to, icon: Icon, label, collapsed }: { to: string, icon: any, label: string, collapsed: boolean }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
            )}
        >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
        </NavLink>
    );
}

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen flex bg-muted/20">
            {/* Sidebar */}
            <aside className={cn(
                "bg-card border-r transition-all duration-300 flex flex-col h-screen sticky top-0 z-50",
                collapsed ? "w-20" : "w-64"
            )}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b">
                    <Box className="w-6 h-6 text-primary mr-2" />
                    {!collapsed && <span className="font-bold text-lg tracking-tight">Admin<span className="text-primary">Panel</span></span>}
                </div>

                {/* Nav Items */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
                    <SidebarLink to="/orders" icon={ShoppingCart} label="Orders" collapsed={collapsed} />
                    <SidebarLink to="/products" icon={Package} label="Products" collapsed={collapsed} />
                    <SidebarLink to="/inventory" icon={Box} label="Inventory" collapsed={collapsed} />
                    <SidebarLink to="/users" icon={Users} label="Customers" collapsed={collapsed} />
                    <SidebarLink to="/discounts" icon={FileText} label="Promotions" collapsed={collapsed} />
                    <SidebarLink to="/logs" icon={Activity} label="Logs & Monitor" collapsed={collapsed} />
                </div>

                {/* Footer Actions */}
                <div className="p-3 border-t space-y-1">
                    <SidebarLink to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
                    <button className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors",
                        collapsed && "justify-center px-2"
                    )}>
                        <LogOut size={20} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex justify-center py-4 text-muted-foreground hover:text-foreground"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 border-b bg-card px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center text-muted-foreground text-sm">
                        <span>Application</span>
                        <span className="mx-2">/</span>
                        <span className="text-foreground font-medium">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            AD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
