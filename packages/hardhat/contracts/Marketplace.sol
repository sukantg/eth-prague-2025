// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is ReentrancyGuard, Pausable, Ownable {
    enum ListingStatus { Open, Accepted, Cancelled }

    struct Item {
        uint256 itemId;
        string name;
        string metadata;
        address tokenAddress;
        uint256 tokenId;
    }

    struct Listing {
        address seller;
        uint256 price;
        address tokenAddress;
        uint256 tokenId;
        string metadata;
        bool isActive;
        uint256 timestamp;
        ListingStatus status;
        bytes32 itemHash;
    }

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
        bool isActive;
    }

    struct EscrowItem {
        address seller;
        address buyer;
        address tokenAddress;
        uint256 tokenId;
        uint256 amount;
    }

    IERC20 public usdc;
    address public escrowContract;
    uint256 public constant MIN_BID_INCREMENT = 100; // 1% in basis points
    uint256 public constant LISTING_TIMEOUT = 30 days;
    uint256 public constant MAX_PRICE = 1000000 * 10**6; // 1M USDC (6 decimals)
    uint256 public constant MIN_BID = 100 * 10**6; // 100 USDC (6 decimals)
    uint256 public platformFee = 250; // 2.5% in basis points
    address public feeCollector;

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Bid[]) public bids;
    mapping(uint256 => uint256) public highestBid;
    mapping(address => bool) public supportedTokens;
    mapping(bytes32 => bool) public itemListed; // Track if item is already listed
    mapping(uint256 => EscrowItem) public escrows;

    event ItemListed(address indexed seller, uint256 indexed tokenId, uint256 price, bytes32 itemHash);
    event ItemBought(address indexed buyer, uint256 indexed tokenId, uint256 price);
    event BidPlaced(address indexed bidder, uint256 indexed tokenId, uint256 amount);
    event BidCancelled(address indexed bidder, uint256 indexed tokenId);
    event BidAccepted(address indexed seller, uint256 indexed tokenId, address indexed bidder, uint256 amount);
    event ListingCancelled(address indexed seller, uint256 indexed tokenId);
    event TokenSupportUpdated(address indexed token, bool supported);
    event PlatformFeeUpdated(uint256 newFee);
    event FeeCollectorUpdated(address newCollector);
    event EscrowCreated(uint256 indexed tokenId, address seller, address buyer, uint256 amount);
    event EscrowReleased(uint256 indexed tokenId, address buyer, address seller);

    modifier onlyEscrow() {
        require(msg.sender == escrowContract, "Only escrow can call this");
        _;
    }

    modifier onlySupportedToken(address token) {
        require(supportedTokens[token], "Token not supported");
        _;
    }

    constructor(address _usdc, address _escrow, address _feeCollector) 
        Ownable(msg.sender)  // Pass msg.sender as initialOwner
    {
        require(_usdc != address(0), "Invalid USDC address");
        require(_escrow != address(0), "Invalid escrow address");
        require(_feeCollector != address(0), "Invalid fee collector");
        
        usdc = IERC20(_usdc);
        escrowContract = _escrow;
        feeCollector = _feeCollector;
        supportedTokens[_usdc] = true;
    }

    function setTokenSupport(address token, bool supported) external onlyOwner {
        supportedTokens[token] = supported;
        emit TokenSupportUpdated(token, supported);
    }

    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }

    function setFeeCollector(address newCollector) external onlyOwner {
        require(newCollector != address(0), "Invalid address");
        feeCollector = newCollector;
        emit FeeCollectorUpdated(newCollector);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function generateItemHash(address tokenAddress, uint256 tokenId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(tokenAddress, tokenId));
    }

    function listItem(address tokenAddress, uint256 tokenId, uint256 price, string calldata metadata) 
        external 
        nonReentrant 
        whenNotPaused
        onlySupportedToken(tokenAddress)
    {
        require(tokenAddress != address(0), "Invalid token address");
        require(price > 0 && price <= MAX_PRICE, "Invalid price");
        require(!listings[tokenId].isActive, "Item already listed");
        require(IERC721(tokenAddress).ownerOf(tokenId) == msg.sender, "Not token owner");
        require(IERC721(tokenAddress).isApprovedForAll(msg.sender, address(this)) || 
                IERC721(tokenAddress).getApproved(tokenId) == address(this), "Not approved");

        bytes32 itemHash = generateItemHash(tokenAddress, tokenId);
        require(!itemListed[itemHash], "Item already listed elsewhere");

        IERC721(tokenAddress).transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            tokenAddress: tokenAddress,
            tokenId: tokenId,
            metadata: metadata,
            isActive: true,
            timestamp: block.timestamp,
            status: ListingStatus.Open,
            itemHash: itemHash
        });

        itemListed[itemHash] = true;
        emit ItemListed(msg.sender, tokenId, price, itemHash);
    }

    function buyItem(uint256 tokenId) external nonReentrant whenNotPaused {
        Listing memory item = listings[tokenId];
        require(item.isActive, "Item not listed");
        require(item.status == ListingStatus.Open, "Item not available for purchase");
        require(block.timestamp <= item.timestamp + LISTING_TIMEOUT, "Listing expired");
        require(IERC20(usdc).allowance(msg.sender, address(this)) >= item.price, "Insufficient allowance");

        uint256 feeAmount = (item.price * platformFee) / 10000;
        uint256 sellerAmount = item.price - feeAmount;

        usdc.transferFrom(msg.sender, escrowContract, sellerAmount);
        usdc.transferFrom(msg.sender, feeCollector, feeAmount);
        IERC721(item.tokenAddress).transferFrom(address(this), escrowContract, item.tokenId);

        escrows[tokenId] = EscrowItem({
            seller: item.seller,
            buyer: msg.sender,
            tokenAddress: item.tokenAddress,
            tokenId: tokenId,
            amount: sellerAmount
        });

        itemListed[item.itemHash] = false;
        delete listings[tokenId];
        emit ItemBought(msg.sender, tokenId, item.price);
    }

    function confirmReceipt(uint256 tokenId) external nonReentrant {
        EscrowItem memory item = escrows[tokenId];
        require(msg.sender == item.buyer, "Only buyer can confirm");

        IERC721(item.tokenAddress).transferFrom(address(this), item.buyer, item.tokenId);
        require(usdc.transfer(item.seller, item.amount), "Transfer failed");

        delete escrows[tokenId];
        emit EscrowReleased(tokenId, item.buyer, item.seller);
    }

    function placeBid(uint256 tokenId, uint256 amount) external nonReentrant whenNotPaused {
        Listing memory item = listings[tokenId];
        require(item.isActive, "Item not listed");
        require(item.status == ListingStatus.Open, "Item not available for bidding");
        require(block.timestamp <= item.timestamp + LISTING_TIMEOUT, "Listing expired");
        require(amount >= MIN_BID, "Bid too low");
        require(amount > highestBid[tokenId], "Bid too low");
        require(amount >= highestBid[tokenId] + (highestBid[tokenId] * MIN_BID_INCREMENT / 10000), "Bid increment too small");
        require(IERC20(usdc).allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");

        usdc.transferFrom(msg.sender, address(this), amount);
        
        // Return previous highest bid if exists
        if (highestBid[tokenId] > 0) {
            for (uint i = 0; i < bids[tokenId].length; i++) {
                if (bids[tokenId][i].amount == highestBid[tokenId] && bids[tokenId][i].isActive) {
                    usdc.transfer(bids[tokenId][i].bidder, highestBid[tokenId]);
                    bids[tokenId][i].isActive = false;
                    break;
                }
            }
        }

        bids[tokenId].push(Bid({
            bidder: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            isActive: true
        }));

        highestBid[tokenId] = amount;
        emit BidPlaced(msg.sender, tokenId, amount);
    }

    function cancelBid(uint256 tokenId, uint256 bidIndex) external nonReentrant whenNotPaused {
        require(bidIndex < bids[tokenId].length, "Invalid bid index");
        Bid storage bid = bids[tokenId][bidIndex];
        require(bid.bidder == msg.sender, "Not bidder");
        require(bid.isActive, "Bid not active");
        require(bid.amount == highestBid[tokenId], "Can only cancel highest bid");

        usdc.transfer(msg.sender, bid.amount);
        bid.isActive = false;
        highestBid[tokenId] = 0;

        // Find new highest bid
        for (uint i = 0; i < bids[tokenId].length; i++) {
            if (bids[tokenId][i].isActive && bids[tokenId][i].amount > highestBid[tokenId]) {
                highestBid[tokenId] = bids[tokenId][i].amount;
            }
        }

        emit BidCancelled(msg.sender, tokenId);
    }

    function acceptBid(uint256 tokenId, uint256 bidIndex) external nonReentrant whenNotPaused {
        Listing memory item = listings[tokenId];
        require(item.isActive, "Item not listed");
        require(item.status == ListingStatus.Open, "Item not available for bidding");
        require(item.seller == msg.sender, "Not seller");
        require(bidIndex < bids[tokenId].length, "Invalid bid index");
        require(block.timestamp <= item.timestamp + LISTING_TIMEOUT, "Listing expired");

        Bid memory acceptedBid = bids[tokenId][bidIndex];
        require(acceptedBid.isActive, "Bid not active");

        uint256 feeAmount = (acceptedBid.amount * platformFee) / 10000;
        uint256 sellerAmount = acceptedBid.amount - feeAmount;

        usdc.transfer(item.seller, sellerAmount);
        usdc.transfer(feeCollector, feeAmount);
        IERC721(item.tokenAddress).transferFrom(address(this), acceptedBid.bidder, tokenId);

        // Return other active bids
        for (uint i = 0; i < bids[tokenId].length; i++) {
            if (bids[tokenId][i].isActive && i != bidIndex) {
                usdc.transfer(bids[tokenId][i].bidder, bids[tokenId][i].amount);
            }
        }

        itemListed[item.itemHash] = false;
        delete listings[tokenId];
        delete bids[tokenId];
        delete highestBid[tokenId];

        emit BidAccepted(msg.sender, tokenId, acceptedBid.bidder, acceptedBid.amount);
    }

    function cancelListing(uint256 tokenId) external nonReentrant whenNotPaused {
        Listing memory item = listings[tokenId];
        require(item.isActive, "Item not listed");
        require(item.seller == msg.sender, "Not seller");
        require(item.status == ListingStatus.Open, "Cannot cancel an accepted listing");

        // Return NFT to seller
        IERC721(item.tokenAddress).transferFrom(address(this), item.seller, item.tokenId);

        // Return all active bids
        for (uint i = 0; i < bids[tokenId].length; i++) {
            if (bids[tokenId][i].isActive) {
                usdc.transfer(bids[tokenId][i].bidder, bids[tokenId][i].amount);
            }
        }

        itemListed[item.itemHash] = false;
        delete listings[tokenId];
        delete bids[tokenId];
        delete highestBid[tokenId];

        emit ListingCancelled(msg.sender, tokenId);
    }
}

interface IMarketplaceEscrow {
    function deposit(address seller, address buyer, address tokenAddress, uint256 tokenId, uint256 amount) external;
}
