// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price;
        address tokenAddress;
        uint256 tokenId;
        string metadata;
        bool isActive;
        uint256 timestamp;
    }

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
        bool isActive;
    }

    IERC20 public usdc;
    address public escrowContract;
    uint256 public constant MIN_BID_INCREMENT = 100; // 1% in basis points
    uint256 public constant LISTING_TIMEOUT = 30 days;

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Bid[]) public bids;
    mapping(uint256 => uint256) public highestBid;

    event ItemListed(address indexed seller, uint256 indexed tokenId, uint256 price);
    event ItemBought(address indexed buyer, uint256 indexed tokenId, uint256 price);
    event BidPlaced(address indexed bidder, uint256 indexed tokenId, uint256 amount);
    event BidCancelled(address indexed bidder, uint256 indexed tokenId);
    event BidAccepted(address indexed seller, uint256 indexed tokenId, address indexed bidder, uint256 amount);
    event ListingCancelled(address indexed seller, uint256 indexed tokenId);

    modifier onlyEscrow() {
        require(msg.sender == escrowContract, "Only escrow can call this");
        _;
    }

    constructor(address _usdc, address _escrow) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_escrow != address(0), "Invalid escrow address");
        usdc = IERC20(_usdc);
        escrowContract = _escrow;
    }

    function listItem(address tokenAddress, uint256 tokenId, uint256 price, string calldata metadata) 
        external 
        nonReentrant 
    {
        require(tokenAddress != address(0), "Invalid token address");
        require(price > 0, "Price must be greater than 0");
        require(!listings[tokenId].isActive, "Item already listed");

        IERC721(tokenAddress).transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            tokenAddress: tokenAddress,
            tokenId: tokenId,
            metadata: metadata,
            isActive: true,
            timestamp: block.timestamp
        });

        emit ItemListed(msg.sender, tokenId, price);
    }

    function buyItem(uint256 tokenId) external nonReentrant {
        Listing memory item = listings[tokenId];
        require(item.isActive, "Item not listed");
        require(block.timestamp <= item.timestamp + LISTING_TIMEOUT, "Listing expired");

        usdc.transferFrom(msg.sender, escrowContract, item.price);
        IERC721(item.tokenAddress).transferFrom(address(this), escrowContract, item.tokenId);

        IMarketplaceEscrow(escrowContract).deposit(
            item.seller,
            msg.sender,
            item.tokenAddress,
            item.tokenId,
            item.price
        );

        delete listings[tokenId];
        emit ItemBought(msg.sender, tokenId, item.price);
    }

    function placeBid(uint256 tokenId, uint256 amount) external nonReentrant {
        Listing memory item = listings[tokenId];
        require(item.isActive, "Item not listed");
        require(block.timestamp <= item.timestamp + LISTING_TIMEOUT, "Listing expired");
        require(amount > highestBid[tokenId], "Bid too low");
        require(amount >= highestBid[tokenId] + (highestBid[tokenId] * MIN_BID_INCREMENT / 10000), "Bid increment too small");

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

    function cancelBid(uint256 tokenId, uint256 bidIndex) external nonReentrant {
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

    function acceptBid(uint256 tokenId, uint256 bidIndex) external nonReentrant {
        Listing memory item = listings[tokenId];
        require(item.isActive, "Item not listed");
        require(item.seller == msg.sender, "Not seller");
        require(bidIndex < bids[tokenId].length, "Invalid bid index");
        require(block.timestamp <= item.timestamp + LISTING_TIMEOUT, "Listing expired");

        Bid memory acceptedBid = bids[tokenId][bidIndex];
        require(acceptedBid.isActive, "Bid not active");

        usdc.transfer(item.seller, acceptedBid.amount);
        IERC721(item.tokenAddress).transferFrom(address(this), acceptedBid.bidder, tokenId);

        // Return other active bids
        for (uint i = 0; i < bids[tokenId].length; i++) {
            if (bids[tokenId][i].isActive && i != bidIndex) {
                usdc.transfer(bids[tokenId][i].bidder, bids[tokenId][i].amount);
            }
        }

        delete listings[tokenId];
        delete bids[tokenId];
        delete highestBid[tokenId];

        emit BidAccepted(msg.sender, tokenId, acceptedBid.bidder, acceptedBid.amount);
    }

    function cancelListing(uint256 tokenId) external nonReentrant {
        Listing memory item = listings[tokenId];
        require(item.isActive, "Item not listed");
        require(item.seller == msg.sender, "Not seller");

        // Return NFT to seller
        IERC721(item.tokenAddress).transferFrom(address(this), item.seller, tokenId);

        // Return all active bids
        for (uint i = 0; i < bids[tokenId].length; i++) {
            if (bids[tokenId][i].isActive) {
                usdc.transfer(bids[tokenId][i].bidder, bids[tokenId][i].amount);
            }
        }

        delete listings[tokenId];
        delete bids[tokenId];
        delete highestBid[tokenId];

        emit ListingCancelled(msg.sender, tokenId);
    }
}

interface IMarketplaceEscrow {
    function deposit(address seller, address buyer, address tokenAddress, uint256 tokenId, uint256 amount) external;
}
