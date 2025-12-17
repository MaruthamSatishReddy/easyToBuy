import {
    DollarSign,
    ShoppingCart,
    Users,
    TrendingUp,
    ArrowUpRight,
    AlertCircle
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { orderApi, productApi } from "@/lib/api";

const data = [
    { name: 'Jan', revenue: 4000, orders: 240 },
    { name: 'Feb', revenue: 3000, orders: 139 },
    { name: 'Mar', revenue: 2000, orders: 980 },
    { name: 'Apr', revenue: 2780, orders: 390 },
    { name: 'May', revenue: 1890, orders: 480 },
    { name: 'Jun', revenue: 2390, orders: 380 },
    { name: 'Jul', revenue: 3490, orders: 430 },
];

export default function Dashboard() {
    const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
        queryKey: ['products'],
        queryFn: async () => (await productApi.get('/products')).data
    });

    const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => (await orderApi.get('/orders')).data
    });

    const totalRevenue = orders?.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0) || 0;
    const isLoading = productsLoading || ordersLoading;
    const hasError = productsError || ordersError;

    if (hasError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="max-w-md border-red-200 bg-red-50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 text-red-800">
                            <AlertCircle className="h-6 w-6" />
                            <div>
                                <h3 className="font-semibold">Error Loading Dashboard</h3>
                                <p className="text-sm text-red-600 mt-1">
                                    Unable to fetch data. Please ensure backend services are running.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Dashboard Overview
                </h1>
                <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="gradient-card shadow-premium border-0 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-700">Total Revenue</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <DollarSign className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground flex items-center mt-2">
                                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                    <span className="text-green-600 font-semibold">+20.1%</span>
                                    <span className="ml-1">from last month</span>
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="gradient-card shadow-premium border-0 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-700">Orders</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <ShoppingCart className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold text-slate-900">{orders?.length || 0}</div>
                                <p className="text-xs text-muted-foreground flex items-center mt-2">
                                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                    <span className="text-green-600 font-semibold">+12%</span>
                                    <span className="ml-1">from last month</span>
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="gradient-card shadow-premium border-0 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-700">Products</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold text-slate-900">{products?.length || 0}</div>
                                <p className="text-xs text-slate-600 mt-2">Active Catalog Items</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="gradient-card shadow-premium border-0 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -mr-16 -mt-16" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-700">Active Users</CardTitle>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">+573</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-2">
                            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-600 font-semibold">+201</span>
                            <span className="ml-1">since last hour</span>
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 gradient-card shadow-premium border-0">
                    <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
                        <CardTitle className="text-xl">Revenue Overview</CardTitle>
                        <CardDescription className="mt-1">Monthly revenue breakdown for the current fiscal year.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2 pt-6">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#9333ea" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        background: 'white'
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3 gradient-card shadow-premium border-0">
                    <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
                        <CardTitle className="text-xl">Recent Sales</CardTitle>
                        <CardDescription className="mt-1">You made 265 sales this month.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            {[
                                { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+₹1,999.00', initials: 'OM' },
                                { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+₹39.00', initials: 'JL' },
                                { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+₹299.00', initials: 'IN' },
                                { name: 'William Kim', email: 'will@email.com', amount: '+₹99.00', initials: 'WK' },
                                { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+₹39.00', initials: 'SD' },
                            ].map((sale, idx) => (
                                <div key={idx} className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white mr-4 shadow-md">
                                        {sale.initials}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{sale.name}</p>
                                        <p className="text-xs text-muted-foreground">{sale.email}</p>
                                    </div>
                                    <div className="font-semibold text-green-600">{sale.amount}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
