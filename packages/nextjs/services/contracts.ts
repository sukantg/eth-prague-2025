import { ethers } from "ethers";

// Contract ABIs
const MARKETPLACE_ABI = [
  "function listItem(string tokenId, uint256 price) external",
  "function buyItem(string tokenId) external payable",
  "function confirmReceipt(string tokenId) external",
  "function placeBid(string tokenId, uint256 amount) external",
  "function acceptBid(string tokenId, address bidder) external",
  "function cancelBid(string tokenId, address bidder) external",
  "function cancelListing(string tokenId) external",
  "function getListing(string tokenId) external view returns (tuple(string tokenId, uint256 price, address seller, string status, bool isActive))",
  "function getBids(string tokenId) external view returns (tuple(address bidder, uint256 amount)[])",
  "function getUSDCBalance(address account) external view returns (uint256)",
];

export const getContract = (signer: ethers.Signer) => {
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "",
    MARKETPLACE_ABI,
    signer
  );
}; 