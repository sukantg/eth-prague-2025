"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, Edit, Filter, Heart, Mail, MapPin, Search, ShoppingCart, User, X } from "lucide-react";
import { Textarea } from "~~/components/ui/textarea";

interface Profile {
  username: string;
  email: string;
  address: string;
}

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  seller: string;
  location: string;
  likes: number;
}

// Mock data for products
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    price: "120 USDC",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    seller: "John's Vintage Store",
    location: "Prague, Czech Republic",
    likes: 8,
  },
  {
    id: 2,
    title: "MacBook Pro 2019",
    price: "850 USDC",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    seller: "Tech Haven",
    location: "Berlin, Germany",
    likes: 32,
  },
  {
    id: 3,
    title: "Vintage Camera",
    price: "180 USDC",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    seller: "Camera Collector",
    location: "Vienna, Austria",
    likes: 15,
  },
];

export default function BuyerMarketplace() {
  const [profile, setProfile] = useState<Profile>({
    username: "Jane Smith",
    email: "jane@example.com",
    address: "123 Main St, Prague, Czech Republic",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState<Profile>({
    username: "",
    email: "",
    address: "",
  });
  const [products] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEditProfile = () => {
    setEditProfileForm(profile);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editProfileForm);
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50">
      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsEditingProfile(false)} />
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-scale-up relative w-full max-w-2xl">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Edit Profile</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-lg font-semibold text-slate-900">
                      Username *
                    </Label>
                    <Input
                      id="username"
                      value={editProfileForm.username}
                      onChange={e => setEditProfileForm({ ...editProfileForm, username: e.target.value })}
                      placeholder="Enter your username"
                      required
                      className="h-12 text-base border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-lg font-semibold text-slate-900">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editProfileForm.email}
                      onChange={e => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                      className="h-12 text-base border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-lg font-semibold text-slate-900">
                      Delivery Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={editProfileForm.address}
                      onChange={e => setEditProfileForm({ ...editProfileForm, address: e.target.value })}
                      placeholder="Enter your delivery address"
                      required
                      rows={3}
                      className="text-base border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
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
                Verified Buyer
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

      {/* Trust Points Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Buyer Marketplace</h1>
              <p className="text-lg text-slate-700">Browse and purchase verified products</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  <span className="text-3xl font-bold text-slate-900">Verified</span>
                </div>
                <p className="text-base font-medium text-slate-700">Account Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="marketplace" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-2xl">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace">
            <div className="space-y-6">
              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-base border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
                <Button variant="outline" className="h-12 px-6 border-slate-200 hover:bg-slate-50">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <Card key={product.id} className="shadow-lg rounded-2xl border-0 overflow-hidden">
                    <div className="aspect-square bg-slate-100 relative">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      >
                        <Heart className="h-4 w-4 text-slate-600" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{product.title}</h3>
                      <div className="flex items-center text-base text-slate-700 mb-3">
                        <span className="font-medium">{product.seller}</span>
                        <span className="mx-2">•</span>
                        <span>{product.location}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-slate-900">{product.price}</span>
                        <div className="flex items-center space-x-2 text-slate-700">
                          <Heart className="h-5 w-5" />
                          <span className="font-medium">{product.likes}</span>
                        </div>
                      </div>
                      <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-xl rounded-3xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3 text-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span>Profile Information</span>
                    </CardTitle>
                    <Button
                      variant="outline"
                      onClick={handleEditProfile}
                      className="font-semibold text-slate-800 hover:text-slate-900 hover:bg-slate-50 border-slate-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold text-slate-800">Username</Label>
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5 text-slate-500" />
                          <p className="text-lg text-slate-900">{profile.username}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold text-slate-800">Email</Label>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-5 w-5 text-slate-500" />
                          <p className="text-lg text-slate-900">{profile.email}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold text-slate-800">Delivery Address</Label>
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-5 w-5 text-slate-500 mt-1" />
                          <p className="text-lg text-slate-900">{profile.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Account Status</h4>
                        <div className="flex items-center space-x-2 text-emerald-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Verified Buyer</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                          Your account is verified and ready to make purchases
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
