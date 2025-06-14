import { ethers } from "ethers";
import { getContract } from "./contracts";


export const contractService = {
  async getSigner() {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner();
  },

  async listItem(tokenId: string, price: string) {
    const signer = await this.getSigner();
    const contract = getContract(signer);
    const tx = await contract.listItem(tokenId, ethers.parseUnits(price, 6));
    await tx.wait();
  },

  async buyItem(tokenId: string) {
    const signer = await this.getSigner();
    const contract = getContract(signer);
    const listing = await contract.getListing(tokenId);
    const tx = await contract.buyItem(tokenId, { value: listing.price });
    await tx.wait();
  },

  async confirmReceipt(tokenId: string) {
    const signer = await this.getSigner();
    const contract = getContract(signer);
    const tx = await contract.confirmReceipt(tokenId);
    await tx.wait();
  },

  async placeBid(tokenId: string, amount: string) {
    const signer = await this.getSigner();
    const contract = getContract(signer);
    const tx = await contract.placeBid(tokenId, ethers.parseUnits(amount, 6));
    await tx.wait();
  },

  async acceptBid(tokenId: string, bidder: string) {
    const signer = await this.getSigner();
    const contract = getContract(signer);
    const tx = await contract.acceptBid(tokenId, bidder);
    await tx.wait();
  },

  async cancelBid(tokenId: string, bidder: string) {
    const signer = await this.getSigner();
    const contract = getContract(signer);
    const tx = await contract.cancelBid(tokenId, bidder);
    await tx.wait();
  },

  async cancelListing(tokenId: string) {
    const signer = await this.getSigner();
    const contract = getContract(signer);
    const tx = await contract.cancelListing(tokenId);
    await tx.wait();
  },

  async getListing(account: string) {
    const signer = await this.getSigner();
    const contract = getContract(signer);
    return await contract.getListing(account);
  },

  async getBids(account: string) {
    const signer = await this.getSigner();
    const contract = getContract(signer);
    return await contract.getBids(account);
  },

  async getUSDCBalance(account: string) {
    const signer = await this.getSigner();
    const contract = getContract(signer);
    const balance = await contract.getUSDCBalance(account);
    return ethers.formatUnits(balance, 6);
  },
}; 