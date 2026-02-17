import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";
import { Input } from "../../components/ui/input";
import {
  Loader2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Image as ImageIcon,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../../components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { productService } from "../../features/products/productService";
import { getCategories } from "../../features/category/categorySlice";
import type { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { toast } from "react-hot-toast";

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  discount?: number;
  categoryId: string;
  category: {
    name: string;
  };
  images: string[];
  isNewArrival: boolean;
  isBestSeller: boolean;
}

const AdminProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { categories } = useSelector((state: RootState) => state.category);

  // Modal state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    discount: "",
    categoryId: "",
    isNewArrival: false,
    isBestSeller: false,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products");
      setProducts(response.data.data.products);
    } catch (error) {
      console.error("Failed to fetch admin products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, categories.length]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      discount: "",
      categoryId: "",
      isNewArrival: false,
      isBestSeller: false,
    });
    setSelectedFiles([]);
    setPreviews([]);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      discount: (product.discount || 0).toString(),
      categoryId: product.categoryId,
      isNewArrival: product.isNewArrival || false,
      isBestSeller: product.isBestSeller || false,
    });
    setSelectedFiles([]);
    setPreviews(product.images || []);
    setIsSheetOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const remainingSlots = 6 - previews.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);

      setSelectedFiles((prev) => [...prev, ...filesToAdd]);

      const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    const isExisting = !previews[index].startsWith("blob:");

    setPreviews((prev) => prev.filter((_, i) => i !== index));

    if (!isExisting) {
      // It's a new file, find its index in selectedFiles
      // This is slightly tricky if we keep appending.
      // Simplified: just filter selectedFiles by finding the blob match
      // For now, I'll just clear selectedFiles if index matches.
      // Better: find which one it corresponds to.
      const blobUrl = previews[index];
      setSelectedFiles((prev) =>
        prev.filter((file) => URL.createObjectURL(file) !== blobUrl),
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("price", formData.price);
      fd.append("stock", formData.stock);
      fd.append("discount", formData.discount);
      fd.append("categoryId", formData.categoryId);
      fd.append("isNewArrival", String(formData.isNewArrival));
      fd.append("isBestSeller", String(formData.isBestSeller));

      selectedFiles.forEach((file) => {
        fd.append("images", file);
      });

      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, fd);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", fd);
        toast.success("Product created successfully");
      }

      setIsSheetOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product", error);
      toast.error("Failed to save product");
    }
  };

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await productService.deleteProduct(productToDelete);
      fetchProducts();
      setIsAlertOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setIsAlertOpen(true);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (
      path.startsWith("http") ||
      path.startsWith("blob:") ||
      path.startsWith("data:")
    )
      return path;
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
    return `${baseUrl}${path}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-left">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Products Inventory
          </h2>
          <p className="text-gray-500 mt-1">
            Manage your catalog, stock and pricing.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-orange-500 hover:bg-orange-600 text-white gap-2 h-11 px-6 shadow-sm"
        >
          <Plus className="h-5 w-5" /> Add New Product
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-100 pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products by name or category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-20 font-bold">Image</TableHead>
                  <TableHead className="font-bold">Product Name</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Price</TableHead>
                  <TableHead className="font-bold">Stock</TableHead>
                  <TableHead className="font-bold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-gray-500"
                    >
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50/50">
                      <TableCell>
                        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden">
                          {product.images?.[0] ? (
                            <img
                              src={getImageUrl(product.images[0])}
                              alt={product.name}
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-300" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-800 border-none font-medium capitalize"
                        >
                          {product.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-gray-900">
                        ${Number(product.price).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-medium",
                            product.stock < 10
                              ? "text-red-600"
                              : "text-gray-600",
                          )}
                        >
                          {product.stock} units
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleOpenEdit(product)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => confirmDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl flex flex-col h-full bg-white gap-0 p-0"
        >
          <SheetHeader className="p-6 border-b bg-gray-50">
            <SheetTitle className="text-2xl font-bold">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </SheetTitle>
            <SheetDescription>
              Enter the product details below. Click save to finish.
            </SheetDescription>
          </SheetHeader>

          <form
            onSubmit={handleSubmit}
            className="flex-grow overflow-y-auto p-6 space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Wireless Noise Cancelling Headphones"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isNewArrival: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isNewArrival"
                  className="text-sm font-medium text-gray-700 select-none cursor-pointer"
                >
                  New Arrival
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isBestSeller: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isBestSeller"
                  className="text-sm font-medium text-gray-700 select-none cursor-pointer"
                >
                  Best Seller
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Product Images (Max 6)</Label>
              <div className="grid grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50"
                  >
                    <img
                      src={getImageUrl(preview)}
                      alt={`Preview ${index}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {previews.length < 6 && (
                  <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition-all">
                    <ImageIcon className="h-8 w-8 text-gray-400 group-hover:text-orange-500" />
                    <span className="text-xs text-gray-500 mt-2 font-medium">
                      Add Image
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="min-h-[150px] resize-none"
                required
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the product features and specifications..."
              />
            </div>
          </form>

          <SheetFooter className="p-6 border-t bg-gray-50 sm:flex-row flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSheetOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
            >
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProductsPage;
