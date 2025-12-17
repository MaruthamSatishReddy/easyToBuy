import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { Package, AlertTriangle, TrendingUp, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Inventory() {
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch Products for inventory
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await productApi.get('/products');
            return res.data;
        }
    });

    // Mock stock data (in real app, this would come from inventory-service)
    const getStockLevel = () => Math.floor(Math.random() * 200) + 10;
    const getReorderLevel = () => 20;

    const inventoryData = products?.map((product: any) => ({
        ...product,
        stock: getStockLevel(),
        reorderLevel: getReorderLevel(),
    }));

    const lowStockItems = inventoryData?.filter((item: any) => item.stock <= item.reorderLevel) || [];
    const totalStock = inventoryData?.reduce((acc: number, item: any) => acc + item.stock, 0) || 0;

    const filteredInventory = inventoryData?.filter((item: any) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.skuCode?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Inventory Management
                </h1>
                <p className="text-muted-foreground mt-1">Monitor stock levels and manage inventory</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="gradient-card shadow-premium border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                                <p className="text-3xl font-bold mt-2">{products?.length || 0}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Package className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="gradient-card shadow-premium border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Stock</p>
                                <p className="text-3xl font-bold mt-2">{totalStock.toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="gradient-card shadow-premium border-0 border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Low Stock Alerts</p>
                                <p className="text-3xl font-bold mt-2 text-red-600">{lowStockItems.length}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="gradient-card shadow-premium border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Stock Value</p>
                                <p className="text-3xl font-bold mt-2">
                                    ₹{inventoryData?.reduce((acc: number, item: any) =>
                                        acc + (item.price * item.stock), 0).toLocaleString() || 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xl font-bold text-blue-600">₹</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Table */}
            <Card className="gradient-card shadow-premium border-0">
                <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-xl">Stock Levels</CardTitle>
                            <CardDescription className="mt-1">Real-time inventory tracking</CardDescription>
                        </div>
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="h-12 px-6 text-left align-middle font-semibold text-slate-700">Product</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700">SKU</th>
                                    <th className="h-12 px-4 text-center align-middle font-semibold text-slate-700">Current Stock</th>
                                    <th className="h-12 px-4 text-center align-middle font-semibold text-slate-700">Reorder Level</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700">Status</th>
                                    <th className="h-12 px-4 text-right align-middle font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                                                Loading inventory...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredInventory?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            No inventory items found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventory?.map((item: any) => {
                                        const isLowStock = item.stock <= item.reorderLevel;
                                        const stockPercentage = (item.stock / (item.reorderLevel * 5)) * 100;

                                        return (
                                            <tr key={item.id} className="border-b transition-colors hover:bg-slate-50/50">
                                                <td className="p-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                                                            {item.images?.[0] ? (
                                                                <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <Package className="h-5 w-5 text-slate-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{item.name}</p>
                                                            <p className="text-xs text-slate-500">{item.brand}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-mono text-xs text-slate-600">{item.skuCode}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className={`text-lg font-bold ${isLowStock ? 'text-red-600' : 'text-slate-900'}`}>
                                                            {item.stock}
                                                        </span>
                                                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                                                            <div
                                                                className={`h-1.5 rounded-full transition-all ${isLowStock ? 'bg-red-500' : 'bg-green-500'
                                                                    }`}
                                                                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="text-slate-600">{item.reorderLevel}</span>
                                                </td>
                                                <td className="p-4">
                                                    {isLowStock ? (
                                                        <Badge variant="destructive" className="gap-1">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            Low Stock
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="success">In Stock</Badge>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                                                        Adjust
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
