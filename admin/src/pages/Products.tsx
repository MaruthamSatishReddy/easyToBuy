import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { Plus, Search, Filter, Download, Image as ImageIcon, Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function Products() {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Fetch Products
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await productApi.get('/products');
            return res.data;
        }
    });

    // Create Product Mutation
    const createMutation = useMutation({
        mutationFn: async (newProduct: any) => {
            return await productApi.post('/products', newProduct);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setIsOpen(false);
            setToast({ type: 'success', message: 'Product created successfully!' });
            setTimeout(() => setToast(null), 3000);
        },
        onError: (error: any) => {
            setToast({ type: 'error', message: error.response?.data?.message || 'Failed to create product' });
            setTimeout(() => setToast(null), 3000);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const payload = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: Number(formData.get('price')),
            brand: formData.get('brand'),
            category: formData.get('category'),
            skuCode: `SKU-${Date.now()}`,
            images: [formData.get('imageUrl') || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'],
            sizes: ['S', 'M', 'L', 'XL']
        };

        createMutation.mutate(payload);
    };

    const filteredProducts = products?.filter((product: any) =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 ${toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                    {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <p className="font-medium">{toast.message}</p>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Product Catalog
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage your product inventory and catalog</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="gradient-primary shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all">
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">Add New Product</DialogTitle>
                            <DialogDescription>
                                Create a new product to add to your catalog. Fill in all the details below.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Product Name *</label>
                                    <input
                                        name="name"
                                        required
                                        className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                        placeholder="e.g. Premium Cotton T-Shirt"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Brand *</label>
                                    <input
                                        name="brand"
                                        required
                                        className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                        placeholder="e.g. Nike"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Price (₹) *</label>
                                    <input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Category *</label>
                                    <select
                                        name="category"
                                        required
                                        className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                    >
                                        <option value="">Select category</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Footwear">Footwear</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description *</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    className="flex w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                                    placeholder="Detailed product description..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Image URL</label>
                                <div className="flex gap-2">
                                    <ImageIcon className="h-11 w-11 text-slate-400 border border-slate-300 rounded-lg p-2" />
                                    <input
                                        name="imageUrl"
                                        className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                        placeholder="https://example.com/image.jpg"
                                        defaultValue="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createMutation.isPending} className="gradient-primary">
                                    {createMutation.isPending ? 'Creating...' : 'Create Product'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="gradient-card shadow-premium border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
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
                                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                                <p className="text-3xl font-bold mt-2">{new Set(products?.map((p: any) => p.category)).size || 0}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <Filter className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="gradient-card shadow-premium border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Brands</p>
                                <p className="text-3xl font-bold mt-2">{new Set(products?.map((p: any) => p.brand)).size || 0}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="gradient-card shadow-premium border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg. Price</p>
                                <p className="text-3xl font-bold mt-2">
                                    ₹{products?.length ? Math.round(products.reduce((acc: number, p: any) => acc + p.price, 0) / products.length) : 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <span className="text-xl font-bold text-yellow-600">₹</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Products Table */}
            <Card className="gradient-card shadow-premium border-0">
                <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-xl">Product Inventory</CardTitle>
                            <CardDescription className="mt-1">A complete list of all products in your catalog</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
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
                                    <th className="h-12 px-6 text-left align-middle font-semibold text-slate-700">Product</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700">Brand</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700">Category</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-slate-700">Price</th>
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
                                                Loading products...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredProducts?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts?.map((product: any) => (
                                        <tr key={product.id} className="border-b transition-colors hover:bg-slate-50/50">
                                            <td className="p-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                                                        {product.images?.[0] ? (
                                                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <Package className="h-6 w-6 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{product.name}</p>
                                                        <p className="text-xs text-slate-500">{product.skuCode}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-slate-700">{product.brand}</span>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="bg-slate-50">
                                                    {product.category}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <span className="font-semibold text-slate-900">₹{product.price?.toLocaleString()}</span>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="success">Active</Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                                                    Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
