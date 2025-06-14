import { useState, useEffect } from "react";
import { contractService } from "../services/contractService";

export const useContract = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {
      // Check if already connected
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      });

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      });
    }
  }, []);

  const connect = async () => {
    try {
      setLoading(true);
      setError(null);
      await contractService.connect();
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  const listItem = async (tokenId: number, price: number) => {
    try {
      setLoading(true);
      setError(null);
      const tx = await contractService.listItem(tokenId, price);
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to list item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buyItem = async (tokenId: number) => {
    try {
      setLoading(true);
      setError(null);
      const tx = await contractService.buyItem(tokenId);
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to buy item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmReceipt = async (tokenId: number) => {
    try {
      setLoading(true);
      setError(null);
      const tx = await contractService.confirmReceipt(tokenId);
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm receipt");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const placeBid = async (tokenId: number, amount: number) => {
    try {
      setLoading(true);
      setError(null);
      const tx = await contractService.placeBid(tokenId, amount);
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place bid");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const acceptBid = async (tokenId: number, bidIndex: number) => {
    try {
      setLoading(true);
      setError(null);
      const tx = await contractService.acceptBid(tokenId, bidIndex);
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept bid");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBid = async (tokenId: number, bidIndex: number) => {
    try {
      setLoading(true);
      setError(null);
      const tx = await contractService.cancelBid(tokenId, bidIndex);
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel bid");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelListing = async (tokenId: number) => {
    try {
      setLoading(true);
      setError(null);
      const tx = await contractService.cancelListing(tokenId);
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel listing");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getListing = async (tokenId: number) => {
    try {
      setLoading(true);
      setError(null);
      return await contractService.getListing(tokenId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get listing");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBids = async (tokenId: number) => {
    try {
      setLoading(true);
      setError(null);
      return await contractService.getBids(tokenId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get bids");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEscrow = async (tokenId: number) => {
    try {
      setLoading(true);
      setError(null);
      return await contractService.getEscrow(tokenId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get escrow");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveUSDC = async (spender: string, amount: number) => {
    try {
      setLoading(true);
      setError(null);
      const tx = await contractService.approveUSDC(spender, amount);
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve USDC");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUSDCAllowance = async (owner: string, spender: string) => {
    try {
      setLoading(true);
      setError(null);
      return await contractService.getUSDCAllowance(owner, spender);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get USDC allowance");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUSDCBalance = async (account: string) => {
    try {
      setLoading(true);
      setError(null);
      return await contractService.getUSDCBalance(account);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get USDC balance");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    isConnected,
    account,
    loading,
    error,
    connect,
    listItem,
    buyItem,
    confirmReceipt,
    placeBid,
    acceptBid,
    cancelBid,
    cancelListing,
    getListing,
    getBids,
    getEscrow,
    approveUSDC,
    getUSDCAllowance,
    getUSDCBalance,
  };
}; 