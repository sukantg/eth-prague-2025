"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle,
  Edit,
  Eye,
  Globe,
  Plus,
  Shield,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Textarea } from "~~/components/ui/textarea";

interface Listing {
  id: number;
  title: string;
  price: string;
  image: string;
  status: "Active" | "Sold";
  views: number;
  likes: number;
  description: string;
}

interface NewProduct {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
}

// Mock data for listings
const mockListings: Listing[] = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    price: "120 USDC",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    status: "Active",
    views: 24,
    likes: 8,
    description: "Genuine leather jacket from the 90s in excellent condition.",
  },
  {
    id: 2,
    title: "MacBook Pro 2019",
    price: "850 USDC",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    status: "Sold",
    views: 156,
    likes: 32,
    description: "13-inch MacBook Pro with Touch Bar, 512GB SSD.",
  },
  {
    id: 3,
    title: "Vintage Camera",
    price: "180 USDC",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    status: "Active",
    views: 89,
    likes: 15,
    description: "Canon AE-1 film camera with 50mm lens.",
  },
];

export default function SellerDashboard() {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
  });
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newListingId, setNewListingId] = useState<number | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const deleteTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
  });

  const handleWorldIDVerification = async () => {
    setIsVerifying(true);
    // Simulate World ID verification process
    setTimeout(() => {
      setIsVerified(true);
      setIsVerifying(false);
    }, 2000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = 3 - uploadedImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length > 0) {
      const newImages = [...uploadedImages, ...filesToAdd];
      setUploadedImages(newImages);

      // Create preview URLs
      const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    setUploadedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = listings.length + 1;
    const product: Listing = {
      id: newId,
      title: newProduct.title,
      price: `${newProduct.price} USDC`,
      image: imagePreviews[0] || "/placeholder.svg?height=200&width=200",
      status: "Active" as const,
      views: 0,
      likes: 0,
      description: newProduct.description,
    };
    setListings([product, ...listings]);
    setNewListingId(newId);
    setNewProduct({ title: "", description: "", price: "", category: "", condition: "" });
    setUploadedImages([]);
    setImagePreviews([]);

    // Show success animation
    setShowSuccessAnimation(true);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animationTimeoutRef.current = setTimeout(() => {
      setShowSuccessAnimation(false);
      setNewListingId(null);
    }, 2000);
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setShowDeleteConfirmation(true);
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setListings(listings.filter(listing => listing.id !== itemToDelete));
      setShowDeleteConfirmation(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  const handleEditClick = (listing: Listing) => {
    setEditingListing(listing);
    setEditForm({
      title: listing.title,
      description: listing.description,
      price: listing.price.replace(" USDC", ""),
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingListing) {
      const updatedListings = listings.map(listing => {
        if (listing.id === editingListing.id) {
          return {
            ...listing,
            title: editForm.title,
            description: editForm.description,
            price: `${editForm.price} USDC`,
          };
        }
        return listing;
      });
      setListings(updatedListings);
      setShowEditModal(false);
      setEditingListing(null);
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50">
        {/* Header */}
        <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TB</span>
                </div>
                <span className="text-xl font-bold text-slate-800">Trust Bazaar</span>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Verification Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Globe className="h-12 w-12 text-slate-700" />
              </div>

              <h1 className="text-3xl font-bold text-slate-800 mb-4">Verify Your Identity</h1>
              <p className="text-lg text-slate-600 mb-8">
                To start selling on Trust Bazaar, you need to verify your identity with World ID to prove youre a real
                human.
              </p>

              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-4 text-slate-600">
                  <Shield className="h-5 w-5" />
                  <span>Secure & Private</span>
                  <span>•</span>
                  <CheckCircle className="h-5 w-5" />
                  <span>One-time verification</span>
                </div>

                <Button
                  onClick={handleWorldIDVerification}
                  disabled={isVerifying}
                  size="lg"
                  className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying with World ID...
                    </>
                  ) : (
                    <>
                      <Globe className="h-5 w-5 mr-2" />
                      Get Verified with World ID
                    </>
                  )}
                </Button>

                <p className="text-sm text-slate-500">
                  This process is powered by Worldcoins World ID and ensures every seller is a unique, verified human.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50">
      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl animate-scale-up">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Product Listed!</h3>
              <p className="text-slate-600">Your item has been successfully added to the marketplace</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={handleCancelDelete} />
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-scale-up relative">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <AlertTriangle className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Delete Listing?</h3>
              <p className="text-slate-600 mb-6 text-center">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={handleCancelDelete}
                  className="px-6 py-2 border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-scale-up relative w-full max-w-2xl">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Edit Listing</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title" className="text-base font-semibold text-slate-800">
                      Product Title *
                    </Label>
                    <Input
                      id="edit-title"
                      value={editForm.title}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Enter a descriptive title"
                      required
                      className="h-12 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-price" className="text-base font-semibold text-slate-800">
                      Price (USDC) *
                    </Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                      placeholder="Enter price in USDC"
                      required
                      className="h-12 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-description" className="text-base font-semibold text-slate-800">
                      Description *
                    </Label>
                    <Textarea
                      id="edit-description"
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Describe your product in detail"
                      rows={4}
                      required
                      className="border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 border-slate-200 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TB</span>
              </div>
              <span className="text-xl font-bold text-slate-800">Trust Bazaar</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 px-3 py-1">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verified Seller
              </Badge>
              <Link href="/">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Merit Points Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Seller Dashboard</h1>
              <p className="text-slate-600">Manage your listings and track your performance</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span className="text-2xl font-bold text-slate-800">1,247</span>
                </div>
                <p className="text-sm text-slate-600">Merit Points</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">{listings.length}</div>
                <p className="text-sm text-slate-600">Active Listings</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {listings.filter(l => l.status === "Sold").length}
                </div>
                <p className="text-sm text-slate-600">Items Sold</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="add-product" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
          </TabsList>

          {/* Add Product Tab */}
          <TabsContent value="add-product">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-xl rounded-3xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl flex items-center justify-center">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <span>Add New Product</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <form onSubmit={handleAddProduct} className="space-y-8">
                    {/* Product Images Section */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold text-slate-800">Product Images</Label>
                      <p className="text-sm text-slate-600">Upload up to 3 high-quality images of your product</p>

                      {/* Image Upload Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* Uploaded Images */}
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square border-2 border-emerald-200 rounded-2xl overflow-hidden bg-white shadow-lg">
                              <img
                                src={preview || "/placeholder.svg"}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}

                        {/* Upload Slots */}
                        {Array.from({ length: 3 - imagePreviews.length }).map((_, index) => (
                          <div key={`empty-${index}`}>
                            <input
                              ref={index === 0 ? fileInputRef : undefined}
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="hidden"
                              id={`image-upload-${index}`}
                            />
                            <label
                              htmlFor={`image-upload-${index}`}
                              className="aspect-square border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 bg-white shadow-sm"
                            >
                              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                                <Camera className="h-6 w-6 text-slate-500" />
                              </div>
                              <p className="text-sm font-medium text-slate-600 text-center">
                                {index === 0 && imagePreviews.length === 0 ? "Add Photos" : "Add More"}
                              </p>
                              <p className="text-xs text-slate-500 text-center mt-1">PNG, JPG up to 10MB</p>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="title" className="text-base font-semibold text-slate-800">
                            Product Title *
                          </Label>
                          <Input
                            id="title"
                            value={newProduct.title}
                            onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                            placeholder="Enter a descriptive title"
                            required
                            className="h-12 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="price" className="text-base font-semibold text-slate-800">
                            Price (USDC) *
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="Enter price in USDC"
                            required
                            className="h-12 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="category" className="text-base font-semibold text-slate-800">
                            Category *
                          </Label>
                          <Input
                            id="category"
                            value={newProduct.category}
                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                            placeholder="e.g., Electronics, Fashion, Books"
                            required
                            className="h-12 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400"
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="condition" className="text-base font-semibold text-slate-800">
                            Condition *
                          </Label>
                          <Input
                            id="condition"
                            value={newProduct.condition}
                            onChange={e => setNewProduct({ ...newProduct, condition: e.target.value })}
                            placeholder="e.g., Like New, Good, Fair"
                            required
                            className="h-12 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="description" className="text-base font-semibold text-slate-800">
                            Description *
                          </Label>
                          <Textarea
                            id="description"
                            value={newProduct.description}
                            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                            placeholder="Describe your product in detail. Include condition, features, and any defects."
                            rows={6}
                            required
                            className="border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-slate-200">
                      <Button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        List your Product
                      </Button>
                      <p className="text-sm text-slate-500 text-center mt-3">
                        Your item will be minted as an NFT and listed on the marketplace
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="my-listings">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Your Listings</h2>
                <p className="text-slate-600">{listings.length} total items</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <Card
                    key={listing.id}
                    className={`shadow-lg rounded-2xl border-0 overflow-hidden transition-all duration-500 ${
                      listing.id === newListingId ? "animate-slide-in" : ""
                    }`}
                  >
                    <div className="aspect-square bg-slate-100 relative">
                      <img
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        className={`absolute top-3 right-3 ${
                          listing.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {listing.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-slate-800 mb-2">{listing.title}</h3>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-slate-800">{listing.price}</span>
                        <div className="flex items-center space-x-3 text-sm text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{listing.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4" />
                            <span>{listing.likes}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(listing)} className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(listing.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {listings.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">No listings yet</h3>
                  <p className="text-slate-600 mb-4">Start by adding your first product to the marketplace.</p>
                  <Button
                    onClick={() => {
                      const element = document.querySelector('[value="add-product"]');
                      if (element instanceof HTMLElement) {
                        element.click();
                      }
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    Add Your First Product
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const styles = `
@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleUp {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out forwards;
}

.animate-scale-up {
  animation: scaleUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}
`;

// Add the styles to the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
