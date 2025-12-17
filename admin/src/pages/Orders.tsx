import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/lib/api';
import { Search, Download, ShoppingCart, DollarSign, TrendingUp, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Orders() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Fetch Orders
    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const res = await orderApi.get('/orders');
            return res.data;
        }
    });

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { variant: any; label: string }> = {
            paid: { variant: 'success', label: 'Paid' },
            pending: { variant: 'warning', label: 'Pending' },
            processing: { variant: 'info', label: 'Processing' },
            shipped: { variant: 'info', label: 'Shipped' },
            delivered: { variant: 'success', label: 'Delivered' },
            cancelled: { variant: 'destructive', label: 'Cancelled' },
        };
        return statusMap[status] || { variant: 'default', label: status };
    };

    const filteredOrders = orders?.filter((order: any) => {
        const matchesSearch =
            order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.skuCode?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    const totalRevenue = orders?.reduce((acc: number, order: any) =>
        acc + (order.price * order.quantity), 0) || 0;

    const avgOrderValue = orders?.length ? totalRevenue / orders.length : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Order Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Track and manage all customer orders</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="gradient-card shadow-premium border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                <p className="text-3xl font-bold mt-2">{orders?.length || 0}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="gradient-card shadow-premium border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <p className="text-3xl font-bold mt-2">₹{totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +20% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="gradient-card shadow-premium border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                                <p className="text-3xl font-bold mt-2">₹{Math.round(avgOrderValue).toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xl font-bold text-blue-600">₹</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-3">Per transaction</p>
                    </CardContent>
                </Card>
                <Card className="gradient-card shadow-premium border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
                                <p className="text-3xl font-bold mt-2">
                                    {orders?.reduce((acc: number, o: any) => acc + o.quantity, 0) || 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Package className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-3">Total units</p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <Card className="gradient-card shadow-premium border-0">
                <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-xl">Recent Orders</CardTitle>
                            <CardDescription className="mt-1">Complete order history and status tracking</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                />
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="h-12 px-6 text-left align-middle font-semibold text-slate-700">Order ID</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700">Customer</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700">Product SKU</th>
                                    <th className="h-12 px-4 text-center align-middle font-semibold text-slate-700">Quantity</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700">Total</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700">Status</th>
                                    <th className="h-12 px-4 text-right align-middle font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-500">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                                                Loading orders...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredOrders?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-500">
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders?.map((order: any) => {
                                        const status = getStatusBadge('paid');
                                        return (
                                            <tr key={order.id} className="border-b transition-colors hover:bg-slate-50/50">
                                                <td className="p-4 px-6">
                                                    <div>
                                                        <p className="font-mono text-xs font-medium text-purple-600">
                                                            #{order.orderNumber?.substring(0, 8).toUpperCase()}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-0.5">ID: {order.id}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium text-slate-900">{order.email?.split('@')[0]}</p>
                                                        <p className="text-xs text-slate-500">{order.email}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline" className="bg-slate-50 font-mono text-xs">
                                                        {order.skuCode}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
                                                        {order.quantity}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            ₹{(order.price * order.quantity).toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-slate-500">₹{order.price} × {order.quantity}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant={status.variant}>{status.label}</Badge>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                                                        View
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
