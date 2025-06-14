import { ethers } from "hardhat";
import { verify } from "../utils/verify";
import { network } from "hardhat";
import { getFlowConfig, getExplorerUrl } from "../utils/flowConfig";

async function main() {
  console.log("Starting deployment...");
  console.log("Network:", network.name);

  // Get the deployer's address
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider?.getBalance(deployer.address))?.toString());

  // Get USDC address based on network
  let usdcAddress: string;
  if (network.name === "flow" || network.name === "flowTestnet") {
    const config = getFlowConfig(network.name);
    usdcAddress = config.usdc;
    console.log("Using Flow USDC address:", usdcAddress);
  } else {
    // Deploy Mock USDC for testing on other networks
    console.log("Deploying Mock USDC...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();
    usdcAddress = await mockUSDC.getAddress();
    console.log("Mock USDC deployed to:", usdcAddress);
  }

  // Deploy Escrow Contract with gas estimation
  console.log("Deploying Escrow Contract...");
  const EscrowContract = await ethers.getContractFactory("EscrowContract");
  const escrowDeployTx = await EscrowContract.getDeployTransaction(usdcAddress);
  const gasEstimate = await deployer.estimateGas(escrowDeployTx);
  console.log("Estimated gas for Escrow deployment:", gasEstimate.toString());
  
  const escrow = await EscrowContract.deploy(usdcAddress);
  const escrowDeployReceipt = await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("Escrow Contract deployed to:", escrowAddress);
  console.log("Deployment transaction hash:", escrowDeployReceipt.deploymentTransaction()?.hash);

  // Deploy Marketplace Contract with gas estimation
  console.log("Deploying Marketplace Contract...");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplaceDeployTx = await Marketplace.getDeployTransaction(
    usdcAddress,
    escrowAddress,
    deployer.address
  );
  const marketplaceGasEstimate = await deployer.estimateGas(marketplaceDeployTx);
  console.log("Estimated gas for Marketplace deployment:", marketplaceGasEstimate.toString());

  const marketplace = await Marketplace.deploy(
    usdcAddress,
    escrowAddress,
    deployer.address
  );
  const marketplaceDeployReceipt = await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace Contract deployed to:", marketplaceAddress);
  console.log("Deployment transaction hash:", marketplaceDeployReceipt.deploymentTransaction()?.hash);

  // Verify contracts on Etherscan/Flowscan
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Verifying contracts...");

    const config = getFlowConfig(network.name);
    
    // Wait for block confirmations
    console.log(`Waiting for ${config.blockConfirmations} block confirmations...`);
    await escrowDeployReceipt.deploymentTransaction()?.wait(config.blockConfirmations);
    await marketplaceDeployReceipt.deploymentTransaction()?.wait(config.blockConfirmations);

    // Wait additional time for Flowscan indexing
    console.log(`Waiting ${config.verifyDelay/1000} seconds for Flowscan indexing...`);
    await new Promise(resolve => setTimeout(resolve, config.verifyDelay));

    try {
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
    } catch (error) {
      console.error("Verification failed:", error);
      console.log("You can verify the contracts manually using the following commands:");
      console.log(`npx hardhat verify --network ${network.name} ${escrowAddress} ${usdcAddress}`);
      console.log(`npx hardhat verify --network ${network.name} ${marketplaceAddress} ${usdcAddress} ${escrowAddress} ${deployer.address}`);
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
  
  // Print explorer links
  const explorerBase = getExplorerUrl(network.name, "address");
  console.log("\nExplorer Links:");
  console.log(`Escrow Contract: ${explorerBase}/${escrowAddress}`);
  console.log(`Marketplace Contract: ${explorerBase}/${marketplaceAddress}`);
}

main().catch(error => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
