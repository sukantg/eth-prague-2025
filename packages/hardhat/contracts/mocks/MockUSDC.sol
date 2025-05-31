// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("Mock USDC", "mUSDC") Ownable(msg.sender) {
        // Mint 1,000,000 USDC to the deployer (6 decimals)
        _mint(msg.sender, 1000000 * 10**6);
    }

    // Function to mint more tokens for testing
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Override decimals to match USDC's 6 decimals
    function decimals() public pure override returns (uint8) {
        return 6;
    }
} 