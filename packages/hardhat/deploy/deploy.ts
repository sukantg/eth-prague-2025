import { ethers } from "hardhat";
import { verify } from "../utils/verify";
import { network } from "hardhat";

async function main() {
  console.log("Starting deployment...");
  console.log("Network:", network.name);

  // Get the deployer's address
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get USDC address based on network
  let usdcAddress: string;
  if (network.name === "flow" || network.name === "flowTestnet") {
    // Use real USDC address for Flow networks
    usdcAddress =
      network.name === "flow"
        ? "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" // Flow Mainnet USDC
        : "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Flow Testnet USDC
    console.log("Using USDC address:", usdcAddress);
  } else {
    // Deploy Mock USDC for testing on other networks
    console.log("Deploying Mock USDC...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();
    usdcAddress = await mockUSDC.getAddress();
    console.log("Mock USDC deployed to:", usdcAddress);
  }

  // Deploy Escrow Contract
  console.log("Deploying Escrow Contract...");
  const EscrowContract = await ethers.getContractFactory("EscrowContract");
  const escrow = await EscrowContract.deploy(usdcAddress);
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("Escrow Contract deployed to:", escrowAddress);

  // Deploy Marketplace Contract
  console.log("Deploying Marketplace Contract...");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    usdcAddress,
    escrowAddress,
    deployer.address, // Using deployer as fee collector for testing
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace Contract deployed to:", marketplaceAddress);

  // Verify contracts on Etherscan/Flowscan
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Verifying contracts...");

    // Wait for a few block confirmations
    console.log("Waiting for block confirmations...");
    await new Promise(resolve => setTimeout(resolve, 60000));

    // Verify Escrow Contract
    console.log("Verifying Escrow Contract...");
    await verify(escrowAddress, [usdcAddress]);

    // Verify Marketplace Contract
    console.log("Verifying Marketplace Contract...");
    await verify(marketplaceAddress, [usdcAddress, escrowAddress, deployer.address]);

    // Verify Mock USDC only if it was deployed
    if (network.name !== "flow" && network.name !== "flowTestnet") {
      console.log("Verifying Mock USDC...");
      await verify(usdcAddress, []);
    }
  }

  console.log("\nDeployment completed!");
  console.log("Contract Addresses:");
  if (network.name !== "flow" && network.name !== "flowTestnet") {
    console.log("Mock USDC:", usdcAddress);
  } else {
    console.log("USDC:", usdcAddress);
  }
  console.log("Escrow Contract:", escrowAddress);
  console.log("Marketplace Contract:", marketplaceAddress);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
