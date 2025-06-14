export const FLOW_CONFIG = {
  mainnet: {
    chainId: 747,
    rpcUrl: "https://mainnet.evm.nodes.onflow.org",
    explorerUrl: "https://evm.flowscan.io",
    usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    blockConfirmations: 5,
    verifyDelay: 60000, // 60 seconds
    gasPrice: 50000000000, // 50 gwei
    gasMultiplier: 1.2,
  },
  testnet: {
    chainId: 545,
    rpcUrl: "https://testnet.evm.nodes.onflow.org",
    explorerUrl: "https://evm-testnet.flowscan.io",
    usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    blockConfirmations: 3,
    verifyDelay: 30000, // 30 seconds
    gasPrice: 50000000000, // 50 gwei
    gasMultiplier: 1.2,
  },
};

export const getFlowConfig = (network: string) => {
  return network === "flow" ? FLOW_CONFIG.mainnet : FLOW_CONFIG.testnet;
};

export const getExplorerUrl = (network: string, type: "address" | "tx") => {
  const config = getFlowConfig(network);
  return `${config.explorerUrl}/${type}`;
}; 