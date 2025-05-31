"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Globe,
  Heart,
  Package,
  Search,
  Shield,
  ShoppingCart,
  Star,
  User,
} from "lucide-react";

// Mock data for marketplace items
const mockMarketplaceItems = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    price: "120 USDC",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    seller: "Alice.eth",
    condition: "Like New",
    likes: 24,
    description: "Genuine leather jacket from the 90s in excellent condition.",
    category: "Fashion",
  },
  {
    id: 2,
    title: "MacBook Pro 2019",
    price: "850 USDC",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    seller: "Bob.eth",
    condition: "Good",
    likes: 89,
    description: "13-inch MacBook Pro with Touch Bar, 512GB SSD.",
    category: "Electronics",
  },
  {
    id: 3,
    title: "Vintage Camera",
    price: "180 USDC",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    seller: "Charlie.eth",
    condition: "Fair",
    likes: 45,
    description: "Canon AE-1 film camera with 50mm lens.",
    category: "Electronics",
  },
  {
    id: 4,
    title: "Designer Handbag",
    price: "450 USDC",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
    seller: "Diana.eth",
    condition: "Like New",
    likes: 67,
    description: "Authentic designer handbag with certificate.",
    category: "Fashion",
  },
  {
    id: 5,
    title: "Gaming Chair",
    price: "150 USDC",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=500&fit=crop",
    seller: "Eve.eth",
    condition: "Good",
    likes: 32,
    description: "Ergonomic gaming chair with lumbar support.",
    category: "Furniture",
  },
  {
    id: 6,
    title: "Wireless Headphones",
    price: "80 USDC",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    seller: "Frank.eth",
    condition: "Good",
    likes: 56,
    description: "Premium wireless headphones with noise cancellation.",
    category: "Electronics",
  },
];

// Mock data for past purchases
const mockPastPurchases = [
  {
    id: 1,
    title: "Vintage Watch",
    price: "280 USDC",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop",
    seller: "Grace.eth",
    purchaseDate: "2024-01-15",
    status: "Delivered",
  },
  {
    id: 2,
    title: "Smartphone",
    price: "320 USDC",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
    seller: "Henry.eth",
    purchaseDate: "2024-01-10",
    status: "Delivered",
  },
  {
    id: 3,
    title: "Coffee Table",
    price: "95 USDC",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26f?w=500&h=500&fit=crop",
    seller: "Ivy.eth",
    purchaseDate: "2024-01-05",
    status: "In Transit",
  },
];

export default function BuyerMarketplace() {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [meritPoints] = useState(450);

  const categories = ["All", "Electronics", "Fashion", "Furniture", "Books", "Sports"];

  const handleWorldIDVerification = async () => {
    setIsVerifying(true);
    // Simulate World ID verification process
    setTimeout(() => {
      setIsVerified(true);
      setIsVerifying(false);
    }, 2000);
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
                To browse the marketplace, you need to verify your identity with World ID to prove youre a real human.
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
                  This process is powered by Worldcoins World ID and ensures every buyer is a unique, verified human.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredItems = mockMarketplaceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleLike = (itemId: number) => {
    setLikedItems(prev => (prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]));
  };

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

      {/* Merit Points Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Marketplace</h1>
              <p className="text-slate-600">Discover verified items from trusted sellers</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span className="text-2xl font-bold text-slate-800">{meritPoints}</span>
                </div>
                <p className="text-sm text-slate-600">Merit Points</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">{mockPastPurchases.length}</div>
                <p className="text-sm text-slate-600">Purchases</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">{likedItems.length}</div>
                <p className="text-sm text-slate-600">Liked Items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="marketplace" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="purchases">My Purchases</TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace">
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search for items..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-slate-200 rounded-xl"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className={`whitespace-nowrap rounded-xl ${
                        selectedCategory === category
                          ? "bg-slate-800 text-white"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <Card
                    key={item.id}
                    className="shadow-lg rounded-2xl border-0 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-square bg-slate-100 relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(item.id)}
                        className={`absolute top-3 right-3 h-8 w-8 rounded-full ${
                          likedItems.includes(item.id)
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-white/80 text-slate-600 hover:bg-white"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${likedItems.includes(item.id) ? "fill-current" : ""}`} />
                      </Button>
                      <Badge className="absolute top-3 left-3 bg-emerald-100 text-emerald-800">{item.condition}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-slate-800">{item.price}</span>
                        <div className="flex items-center space-x-1 text-sm text-slate-500">
                          <Heart className="h-4 w-4" />
                          <span>{item.likes}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-slate-600" />
                          </div>
                          <span className="text-sm text-slate-600">{item.seller}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">No items found</h3>
                  <p className="text-slate-600">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* My Purchases Tab */}
          <TabsContent value="purchases">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Your Purchase History</h2>
                <p className="text-slate-600">{mockPastPurchases.length} total purchases</p>
              </div>

              <div className="space-y-4">
                {mockPastPurchases.map(purchase => (
                  <Card key={purchase.id} className="shadow-lg rounded-2xl border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden">
                          <img
                            src={purchase.image || "/placeholder.svg"}
                            alt={purchase.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 mb-1">{purchase.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{purchase.seller}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-slate-800">{purchase.price}</span>
                            <Badge
                              className={`${
                                purchase.status === "Delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              <Package className="h-3 w-3 mr-1" />
                              {purchase.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {mockPastPurchases.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">No purchases yet</h3>
                  <p className="text-slate-600 mb-4">Start exploring the marketplace to find great deals.</p>
                  <Button
                    onClick={() => {
                      const element = document.querySelector('[value="marketplace"]');
                      if (element instanceof HTMLElement) {
                        element.click();
                      }
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    Browse Marketplace
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
