import React, { useState, useEffect, useCallback } from "react";
import { useContract } from "../hooks/useContract";
import { ethers } from "ethers";

interface Bid {
  bidder: string;
  amount: string;
}

interface Listing {
  id: string;
  tokenId: string;
  price: string;
  seller: string;
  status: string;
  isActive: boolean;
}

export const Marketplace: React.FC = () => {
  const {
    isConnected,
    account,
    loading,
    error,
    connect,
    listItem,
    buyItem,
    placeBid,
    acceptBid,
    cancelBid,
    cancelListing,
    getListing,
    getBids,
    getUSDCBalance,
  } = useContract();

  const [tokenId, setTokenId] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<string>("");
  const [listing, setListing] = useState<Listing | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [usdcBalance, setUsdcBalance] = useState<string>("0");

  const loadListing = useCallback(async () => {
    if (!account) return;
    const listingData = await getListing(account);
    setListing(listingData);
  }, [account, getListing]);

  const loadBids = useCallback(async () => {
    if (!account) return;
    const bidsData = await getBids(account);
    setBids(bidsData);
  }, [account, getBids]);

  const loadData = useCallback(async () => {
    if (!account) return;
    const balance = await getUSDCBalance(account);
    setUsdcBalance(balance);
    await Promise.all([loadListing(), loadBids()]);
  }, [account, loadListing, loadBids, getUSDCBalance]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleList = async () => {
    if (!tokenId || !price) return;
    try {
      await listItem(parseInt(tokenId), parseFloat(price));
      await loadData();
    } catch (err) {
      console.error("Error listing item:", err);
    }
  };

  const handleBuy = async () => {
    if (!listing) return;
    try {
      await buyItem(parseInt(listing.tokenId));
      await loadData();
    } catch (err) {
      console.error("Error buying item:", err);
    }
  };

  const handlePlaceBid = async () => {
    if (!listing || !bidAmount) return;
    try {
      await placeBid(parseInt(listing.tokenId), parseFloat(bidAmount));
      await loadData();
    } catch (err) {
      console.error("Error placing bid:", err);
    }
  };

  const handleAcceptBid = async (bidder: string) => {
    if (!listing) return;
    try {
      await acceptBid(parseInt(listing.tokenId), bidder);
      await loadData();
    } catch (err) {
      console.error("Error accepting bid:", err);
    }
  };

  const handleCancelBid = async (bidder: string) => {
    if (!listing) return;
    try {
      await cancelBid(parseInt(listing.tokenId), bidder);
      await loadData();
    } catch (err) {
      console.error("Error canceling bid:", err);
    }
  };

  const handleCancelListing = async () => {
    if (!listing) return;
    try {
      await cancelListing(parseInt(listing.tokenId));
      await loadData();
    } catch (err) {
      console.error("Error canceling listing:", err);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Marketplace</h1>
        <button
          onClick={connect}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Listing Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">List Item</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Token ID</label>
              <input
                type="text"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (USDC)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleList}
              disabled={loading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "List Item"}
            </button>
          </div>
        </div>

        {/* Buy Item */}
        {listing && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Buy Item</h2>
            <div className="space-y-4">
              <p>Price: {ethers.formatUnits(listing.price, 6)} USDC</p>
              <button
                onClick={handleBuy}
                disabled={loading}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
              >
                {loading ? "Loading..." : "Buy Now"}
              </button>
            </div>
          </div>
        )}

        {/* Place Bid */}
        {listing && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Place Bid</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bid Amount (USDC)</label>
                <input
                  type="text"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handlePlaceBid}
                disabled={loading}
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
              >
                {loading ? "Loading..." : "Place Bid"}
              </button>
            </div>
          </div>
        )}

        {/* Listing Details */}
        {listing && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Listing Details</h2>
            <div className="space-y-4">
              <p>Token ID: {listing.tokenId}</p>
              <p>Price: {ethers.formatUnits(listing.price, 6)} USDC</p>
              <p>Seller: {listing.seller}</p>
              <p>Status: {listing.isActive ? "Active" : "Inactive"}</p>
              {listing.isActive && (
                <button
                  onClick={handleCancelListing}
                  disabled={loading}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors disabled:bg-gray-400"
                >
                  {loading ? "Loading..." : "Cancel Listing"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bids */}
        {bids.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Bids</h2>
            <div className="space-y-4">
              {bids.map((bid, index) => (
                <div key={index} className="border-b pb-4">
                  <p>Bidder: {bid.bidder}</p>
                  <p>Amount: {ethers.formatUnits(bid.amount, 6)} USDC</p>
                  {listing?.seller === account && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleAcceptBid(bid.bidder)}
                        disabled={loading}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleCancelBid(bid.bidder)}
                        disabled={loading}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors disabled:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* USDC Balance */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p>Your USDC Balance: {ethers.formatUnits(usdcBalance, 6)} USDC</p>
      </div>
    </div>
  );
}; 