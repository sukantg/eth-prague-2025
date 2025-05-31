// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EscrowContract is ReentrancyGuard {
    struct EscrowItem {
        address seller;
        address buyer;
        address tokenAddress;
        uint256 tokenId;
        uint256 amount;
        uint256 timestamp;
        bool isActive;
    }

    IERC20 public usdc;
    mapping(uint256 => EscrowItem) public escrows;
    uint256 public constant ESCROW_TIMEOUT = 7 days;

    event EscrowCreated(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 amount);
    event EscrowReleased(uint256 indexed tokenId, address buyer, address seller);
    event EscrowCancelled(uint256 indexed tokenId, address seller, address buyer);
    event EscrowTimeout(uint256 indexed tokenId, address seller, address buyer);

    constructor(address _usdc) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = IERC20(_usdc);
    }

    function deposit(address seller, address buyer, address tokenAddress, uint256 tokenId, uint256 amount) 
        external 
        nonReentrant 
    {
        require(seller != address(0), "Invalid seller address");
        require(buyer != address(0), "Invalid buyer address");
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        require(!escrows[tokenId].isActive, "Escrow already exists");

        escrows[tokenId] = EscrowItem({
            seller: seller,
            buyer: buyer,
            tokenAddress: tokenAddress,
            tokenId: tokenId,
            amount: amount,
            timestamp: block.timestamp,
            isActive: true
        });

        emit EscrowCreated(tokenId, seller, buyer, amount);
    }

    function confirmReceipt(uint256 tokenId) external nonReentrant {
        EscrowItem memory item = escrows[tokenId];
        require(item.isActive, "Escrow not active");
        require(msg.sender == item.buyer, "Only buyer can confirm");
        require(block.timestamp <= item.timestamp + ESCROW_TIMEOUT, "Escrow timed out");

        // Transfer NFT to buyer
        IERC721(item.tokenAddress).transferFrom(address(this), item.buyer, item.tokenId);

        // Transfer USDC to seller
        require(usdc.transfer(item.seller, item.amount), "USDC transfer failed");

        delete escrows[tokenId];

        emit EscrowReleased(tokenId, item.buyer, item.seller);
    }

    function cancelEscrow(uint256 tokenId) external nonReentrant {
        EscrowItem memory item = escrows[tokenId];
        require(item.isActive, "Escrow not active");
        require(msg.sender == item.seller || msg.sender == item.buyer, "Only seller or buyer can cancel");
        require(block.timestamp <= item.timestamp + ESCROW_TIMEOUT, "Escrow timed out");

        // Return NFT to seller
        IERC721(item.tokenAddress).transferFrom(address(this), item.seller, item.tokenId);

        // Return USDC to buyer
        require(usdc.transfer(item.buyer, item.amount), "USDC transfer failed");

        delete escrows[tokenId];

        emit EscrowCancelled(tokenId, item.seller, item.buyer);
    }

    function handleTimeout(uint256 tokenId) external nonReentrant {
        EscrowItem memory item = escrows[tokenId];
        require(item.isActive, "Escrow not active");
        require(block.timestamp > item.timestamp + ESCROW_TIMEOUT, "Escrow not timed out");

        // Return NFT to seller
        IERC721(item.tokenAddress).transferFrom(address(this), item.seller, item.tokenId);

        // Return USDC to buyer
        require(usdc.transfer(item.buyer, item.amount), "USDC transfer failed");

        delete escrows[tokenId];

        emit EscrowTimeout(tokenId, item.seller, item.buyer);
    }
}
