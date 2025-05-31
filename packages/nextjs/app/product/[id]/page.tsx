"use client";

import { useState } from "react";
import Link from "next/link";
// import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, CreditCard, Heart, Package, ShoppingCart, Star, User, Wallet, X } from "lucide-react";

// Mock data for a single product
const mockProduct = {
  id: 1,
  title: "Vintage Leather Jacket",
  price: "120 USDC",
  image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
  seller: "Alice Johnson",
  condition: "Like New",
  likes: 24,
  description:
    "Genuine leather jacket from the 90s in excellent condition. Made from premium leather with excellent craftsmanship. Shows minimal signs of wear and comes with original lining intact.",
  category: "Fashion",
  currentBids: [
    { bidder: "John Smith", amount: "150 USDC", timestamp: "2024-03-15T10:30:00" },
    { bidder: "Sarah Davis", amount: "140 USDC", timestamp: "2024-03-15T09:45:00" },
    { bidder: "Mike Wilson", amount: "130 USDC", timestamp: "2024-03-15T09:00:00" },
  ],
};

// Mock buyer data
const mockBuyer = {
  name: "David Wilson",
  walletAddress: "0x1234...5678",
  meritPoints: 450,
};

export default function ProductPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setActiveTab] = useState<"buy" | "bid">("buy");
  const [bidAmount, setBidAmount] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState<typeof mockBuyer | null>(null);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [showOrderConfirmationModal, setShowOrderConfirmationModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  });

  const handleConnectWallet = () => {
    setIsProcessing(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsWalletConnected(true);
      setBuyerInfo(mockBuyer); // Set buyer info when wallet is connected
      setIsProcessing(false);
    }, 1500);
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerInfo) {
      alert("Please connect your wallet first");
      return;
    }
    setIsProcessing(true);
    // Simulate bid placement
    setTimeout(() => {
      setIsProcessing(false);
      setBidAmount("");
      // Here you would typically update the bids list
      const newBid = {
        bidder: buyerInfo.name,
        amount: `${bidAmount} USDC`,
        timestamp: new Date().toISOString(),
      };
      mockProduct.currentBids.unshift(newBid);
    }, 1500);
  };

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle card payment submission
    setShowCardPayment(false);
    setShowOrderConfirmationModal(true);
    // Reset form
    setCardDetails({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      name: "",
    });
  };

  const handleCompletePurchase = () => {
    setShowOrderConfirmationModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50">
      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/buyer-marketplace" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TB</span>
              </div>
              <span className="text-xl font-bold text-slate-800">Trust Bazaar</span>
            </Link>
            <Link href="/buyer-marketplace?verified=true">
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-slate-100">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Marketplace</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image Section */}
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-xl">
              <img
                src={mockProduct.image}
                alt={mockProduct.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 py-6 text-lg rounded-2xl hover:bg-slate-50 transition-colors">
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" className="flex-1 py-6 text-lg rounded-2xl hover:bg-slate-50 transition-colors">
                <Package className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-slate-800">{mockProduct.title}</h1>
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-emerald-100 text-emerald-800 px-4 py-1 text-sm rounded-full">
                        {mockProduct.condition}
                      </Badge>
                      <Badge variant="outline" className="px-4 py-1 text-sm rounded-full">
                        {mockProduct.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-800">{mockProduct.price}</p>
                    <p className="text-sm text-slate-600">Current Price</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Seller</p>
                    <p className="text-slate-600">{mockProduct.seller}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800">Description</h3>
                  <p className="text-slate-600 leading-relaxed">{mockProduct.description}</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="buy" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 rounded-2xl">
                <TabsTrigger
                  value="buy"
                  onClick={() => setActiveTab("buy")}
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl"
                >
                  Buy Now
                </TabsTrigger>
                <TabsTrigger
                  value="bid"
                  onClick={() => setActiveTab("bid")}
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl"
                >
                  Place Bid
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buy">
                <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8 space-y-6">
                    {!isWalletConnected ? (
                      <div className="space-y-6">
                        <Button
                          onClick={handleConnectWallet}
                          disabled={isProcessing}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-white py-6 text-lg rounded-2xl"
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Wallet className="h-5 w-5 mr-2" />
                              Connect Wallet
                            </>
                          )}
                        </Button>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200"></span>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-500">or</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full py-6 text-lg rounded-2xl hover:bg-slate-50 text-slate-600"
                          onClick={() => setShowCardPayment(true)}
                        >
                          <CreditCard className="h-5 w-5 mr-2" />
                          Pay with Card
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-6 bg-emerald-50 rounded-2xl text-emerald-700">
                          <p className="font-medium text-lg">Wallet Connected</p>
                          <p className="text-sm mt-1">0x1234...5678</p>
                        </div>
                        <Button
                          className="w-full bg-slate-800 hover:bg-slate-700 text-white py-6 text-lg rounded-2xl"
                          onClick={handleCompletePurchase}
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Complete Purchase
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bid">
                <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-6">
                      {!buyerInfo ? (
                        <div className="text-center p-6 bg-slate-50 rounded-2xl">
                          <p className="text-slate-600 mb-4">Please connect your wallet to place a bid</p>
                          <Button
                            onClick={handleConnectWallet}
                            disabled={isProcessing}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-6 text-lg rounded-2xl"
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Wallet className="h-5 w-5 mr-2" />
                                Connect Wallet
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-slate-700" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">Your Account</p>
                              <p className="text-slate-600">{buyerInfo.name}</p>
                              <p className="text-sm text-slate-500">{buyerInfo.walletAddress}</p>
                            </div>
                            <div className="ml-auto text-right">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-amber-500" />
                                <span className="font-medium text-slate-800">{buyerInfo.meritPoints}</span>
                              </div>
                              <p className="text-sm text-slate-500">Merit Points</p>
                            </div>
                          </div>

                          <h3 className="text-xl font-semibold text-slate-800">Current Bids</h3>
                          <div className="space-y-4">
                            {mockProduct.currentBids.map((bid, index) => (
                              <div
                                key={index}
                                className={`flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors ${
                                  bid.bidder === buyerInfo.name ? "border-2 border-emerald-500" : ""
                                }`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-slate-700" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-800">{bid.bidder}</p>
                                    <p className="text-sm text-slate-500">{new Date(bid.timestamp).toLocaleString()}</p>
                                  </div>
                                </div>
                                <p className="text-lg font-bold text-slate-800">{bid.amount}</p>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={handlePlaceBid} className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Your Bid Amount (USDC)
                              </label>
                              <Input
                                type="number"
                                value={bidAmount}
                                onChange={e => setBidAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full py-6 text-lg rounded-2xl"
                                required
                              />
                            </div>
                            <Button
                              type="submit"
                              disabled={isProcessing}
                              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-6 text-lg rounded-2xl"
                            >
                              {isProcessing ? (
                                <>
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                                  Placing Bid...
                                </>
                              ) : (
                                "Place Bid"
                              )}
                            </Button>
                          </form>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Card Payment Modal */}
      {showCardPayment && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowCardPayment(false)} />
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-scale-up relative w-full max-w-2xl">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Card Payment</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCardPayment(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleCardPayment} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-name" className="text-lg font-semibold text-slate-900">
                      Cardholder Name *
                    </Label>
                    <Input
                      id="card-name"
                      value={cardDetails.name}
                      onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                      placeholder="Name on card"
                      required
                      className="h-12 text-base border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="card-number" className="text-lg font-semibold text-slate-900">
                      Card Number *
                    </Label>
                    <Input
                      id="card-number"
                      value={cardDetails.cardNumber}
                      onChange={e => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      required
                      maxLength={19}
                      className="h-12 text-base border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry-date" className="text-lg font-semibold text-slate-900">
                        Expiry Date *
                      </Label>
                      <Input
                        id="expiry-date"
                        value={cardDetails.expiryDate}
                        onChange={e => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        required
                        maxLength={5}
                        className="h-12 text-base border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cvv" className="text-lg font-semibold text-slate-900">
                        CVV *
                      </Label>
                      <Input
                        id="cvv"
                        type="password"
                        value={cardDetails.cvv}
                        onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        placeholder="123"
                        required
                        maxLength={3}
                        className="h-12 text-base border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-emerald-400 mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCardPayment(false)}
                    className="px-6 py-2 border-slate-200 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white">
                    Pay Now
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {showOrderConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowOrderConfirmationModal(false)}
          />
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-scale-up relative w-full max-w-md">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Order Confirmed!</h3>
              <div className="space-y-4 text-slate-600 mb-6">
                <p>
                  Thank you for your purchase on Trust Bazaar. Your order has been successfully processed and confirmed.
                </p>
                <p>
                  Our seller has been notified and will prepare your item for shipping. You&apos;ll receive a
                  notification once your order is shipped.
                </p>
                <p className="text-sm text-slate-500">
                  Order ID: #TB-
                  {Math.floor(Math.random() * 1000000)
                    .toString()
                    .padStart(6, "0")}
                </p>
              </div>
              <Button
                onClick={() => setShowOrderConfirmationModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
