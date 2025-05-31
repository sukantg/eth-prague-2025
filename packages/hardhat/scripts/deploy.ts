import { ethers } from "hardhat";
import { verify } from "../utils/verify";

async function main() {
  console.log("Starting deployment...");

  // Get the deployer's address
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Mock USDC for testing (use real USDC address in production)
  console.log("Deploying Mock USDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("Mock USDC deployed to:", mockUSDCAddress);

  // Deploy Escrow Contract
  console.log("Deploying Escrow Contract...");
  const EscrowContract = await ethers.getContractFactory("EscrowContract");
  const escrow = await EscrowContract.deploy(mockUSDCAddress);
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("Escrow Contract deployed to:", escrowAddress);

  // Deploy Marketplace Contract
  console.log("Deploying Marketplace Contract...");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    mockUSDCAddress,
    escrowAddress,
    deployer.address, // Using deployer as fee collector for testing
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace Contract deployed to:", marketplaceAddress);

  // Verify contracts on Etherscan (if not on a local network)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contracts on Etherscan...");

    // Wait for a few block confirmations
    await new Promise(resolve => setTimeout(resolve, 60000));

    // Verify Mock USDC
    await verify(mockUSDCAddress, []);

    // Verify Escrow Contract
    await verify(escrowAddress, [mockUSDCAddress]);

    // Verify Marketplace Contract
    await verify(marketplaceAddress, [mockUSDCAddress, escrowAddress, deployer.address]);
  }

  console.log("Deployment completed!");
  console.log("Contract Addresses:");
  console.log("Mock USDC:", mockUSDCAddress);
  console.log("Escrow Contract:", escrowAddress);
  console.log("Marketplace Contract:", marketplaceAddress);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
