"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, Edit, Eye, Globe, Plus, Shield, Star, Trash2, Upload } from "lucide-react";
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
    price: "0.5 FLOW",
    image: "/placeholder.svg?height=200&width=200",
    status: "Active",
    views: 24,
    likes: 8,
    description: "Genuine leather jacket from the 90s in excellent condition.",
  },
  {
    id: 2,
    title: "MacBook Pro 2019",
    price: "15.2 FLOW",
    image: "/placeholder.svg?height=200&width=200",
    status: "Sold",
    views: 156,
    likes: 32,
    description: "13-inch MacBook Pro with Touch Bar, 512GB SSD.",
  },
  {
    id: 3,
    title: "Vintage Camera",
    price: "2.1 FLOW",
    image: "/placeholder.svg?height=200&width=200",
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

  const handleWorldIDVerification = async () => {
    setIsVerifying(true);
    // Simulate World ID verification process
    setTimeout(() => {
      setIsVerified(true);
      setIsVerifying(false);
    }, 2000);
  };

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const product: Listing = {
      id: listings.length + 1,
      title: newProduct.title,
      price: `${newProduct.price} FLOW`,
      image: "/placeholder.svg?height=200&width=200",
      status: "Active",
      views: 0,
      likes: 0,
      description: newProduct.description,
    };
    setListings([product, ...listings]);
    setNewProduct({ title: "", description: "", price: "", category: "", condition: "" });
  };

  const handleDeleteListing = (id: number) => {
    setListings(listings.filter(listing => listing.id !== id));
  };

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
            <Card className="max-w-2xl mx-auto shadow-lg rounded-2xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add New Product</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title</Label>
                    <Input
                      id="title"
                      value={newProduct.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewProduct({ ...newProduct, title: e.target.value })
                      }
                      placeholder="Enter product title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setNewProduct({ ...newProduct, description: e.target.value })
                      }
                      placeholder="Describe your product in detail"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (FLOW)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.1"
                        value={newProduct.price}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewProduct({ ...newProduct, price: e.target.value })
                        }
                        placeholder="0.0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newProduct.category}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewProduct({ ...newProduct, category: e.target.value })
                        }
                        placeholder="e.g., Electronics, Fashion"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Input
                      id="condition"
                      value={newProduct.condition}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewProduct({ ...newProduct, condition: e.target.value })
                      }
                      placeholder="e.g., Like New, Good, Fair"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-slate-400 transition-colors">
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600">Click to upload images or drag and drop</p>
                      <p className="text-sm text-slate-500">PNG, JPG up to 10MB</p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl">
                    Create NFT & List Product
                  </Button>
                </form>
              </CardContent>
            </Card>
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
                  <Card key={listing.id} className="shadow-lg rounded-2xl border-0 overflow-hidden">
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
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteListing(listing.id)}
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
