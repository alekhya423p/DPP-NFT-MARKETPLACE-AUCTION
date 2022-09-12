// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";
contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    using SafeMath for uint256;  //For Future use
    uint256 listingPrice = 0.0000001 ether;
    address payable owner;
    //address contractAddress;

    mapping(uint256 => MarketItem) private idToMarketItem;
    //mapping(uint256 => uint) public bids;
    mapping(uint256 => mapping(address => uint256)) public bids; 
    //mapping(uint256 => uint) private idToMarketItem;
    //bool firsttime = false;  //to mart first successfull bid

    struct MarketItem {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      uint256 duration;
      uint256 maxBid;
      address maxBidUser;
      bool isActive;
      uint256 bidprice;
      uint256[] bidAmounts;
      address[] users;
      bool sold;
    }
    
    event MarketItemCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
       uint256 duration,
      uint256 maxBid,
      address maxBidUser,
      bool isActive,
      uint256 bidprice,
      uint256[] bidAmounts,
      address[] users,
      bool sold
    );

event MarketItemsold (
      //uint256 indexed tokenId,
      address seller,
      address owner,
     
     // uint256 maxBid,
      address maxBidUser

    );
    constructor() ERC721("DPP Tokens", "DPP") {
      owner = payable(msg.sender);
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
      require(owner == msg.sender, "Only marketplace owner can update listing price.");
      listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);

      createMarketItem(newTokenId, price);
      
     
      return newTokenId;
    }

    function createMarketItem(
      uint256 tokenId,
      uint256 price
    ) private {
      require(price > 0, "Price must be at least 1 wei");
    //  require(msg.value == listingPrice, "Price must be equal to listing price");

      idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        price,
        0,
        0,
        address(0),
        true,
        0,
        new uint256[](0),
        new address[](0),
        false
      );

      _transfer(msg.sender, address(this), tokenId);
      emit MarketItemCreated(
        tokenId,
        msg.sender,
        address(this),
       price,
        0,
        0,
        address(0),
        true,
        0,
        new uint256[](0),
        new address[](0),
        false
      );
    }
     function createAuctionToken(string memory tokenURI, uint256 price, uint256 duration) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
     //  setApprovalForAll(contractAddress, true);
      //createMarketItem(newTokenId, price);
      
      addMarketItem(newTokenId, price,duration);
      return newTokenId;
    }

    function addMarketItem(uint256 tokenId, uint256 price,uint256 duration) private {
           
       require(msg.sender != address(0), "Invalid Address");
        //require(_nft != address(0), "Invalid Account");
        require(price > 0, "Price should be more than 0");
        require(duration > 0, "Invalid duration value");
       // uint time = block.timestamp;
       // require(msg.value == listingPrice, "Price must be equal to listing price");

      idToMarketItem [tokenId] =  MarketItem (     
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        price,
        duration,
        0,
        address(0),
        true,
        0,
        new uint256[](0),
        new address[](0),
        false
      );

      _transfer(msg.sender, address(this), tokenId);
       emit MarketItemCreated (
        tokenId,
        msg.sender,
        address(this),
        price,
        duration,
        0,
        address(0),
        true,
        0,
        new uint256[](0),
        new address[](0),
        false
    );
   
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
      require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      require(msg.value == listingPrice, "Price must be equal to listing price");
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].price = price;
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].owner = payable(address(this));
      _itemsSold.decrement();

      _transfer(msg.sender, address(this), tokenId);
    }
    function createMarketSale(
      uint256 tokenId
      ) public payable {
      uint price = idToMarketItem[tokenId].price;
      address seller = idToMarketItem[tokenId].seller;
     require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));
      _itemsSold.increment();
      _transfer(address(this), msg.sender, tokenId);
     payable(owner).transfer(listingPrice);
      payable(seller).transfer(msg.value);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _tokenIds.current();
      uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

   /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
             //  MarketItem storage items =  idToMarketItem[_tokenId];
                  address maxBidUser;

      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender || idToMarketItem[i + 1].maxBidUser == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender || idToMarketItem[i + 1].maxBidUser == msg.sender ) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
    

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
/* Returns all sold market items */
function fetchsoldItems() public view returns (MarketItem[] memory) {
      uint itemCount =  _tokenIds.current();
      uint soldItemCount = _itemsSold.current();
      uint currentIndex = 0;
      MarketItem[] memory items = new MarketItem[](soldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
   
        
     function bid(uint256 _tokenId) external payable {
        //uint itemCount = _tokenIds.current();

         MarketItem storage items =  idToMarketItem[_tokenId];
        //require(msg.value >= items.price, "bid price is less than current price");
        //require(items.isActive, "auction not active");
       // require(items.duration > block.timestamp, "Deadline already passed");
        if (bids[_tokenId][msg.sender] > 0) {
            (bool success, ) = msg.sender.call{value: bids[_tokenId][msg.sender]}("");
            require(success);
        }
        bids[_tokenId][msg.sender] = msg.value;
        if (items.bidAmounts.length == 0) {
            items.maxBid = msg.value;
            items.maxBidUser = msg.sender;
        } else {
            uint256 lastIndex = items.bidAmounts.length - 1;
            require(items.bidAmounts[lastIndex] < msg.value, "Current max bid is higher than your bid");
            items.maxBid = msg.value;
            items.maxBidUser = msg.sender;
        }
        items.users.push(msg.sender);
        items.bidAmounts.push(msg.value);
    }
    
 function cancelAuction(uint256 _tokenId) external {
          MarketItem storage items =  idToMarketItem[_tokenId];

        require(items.seller == msg.sender, "Not seller");
        require(items.isActive, "auction not active");
        items.isActive = false;
        bool success;
        for (uint256 i = 0; i < items.users.length; i++) {
        (success, ) = items.users[i].call{value: bids[_tokenId][items.users[i]]}("");        
        require(success);
        }
         _transfer(address(this), items.seller, _tokenId);
    }

   
function executeSale(uint256 tokenId) external {
         MarketItem storage items =  idToMarketItem[tokenId];
       // require(items.duration <= block.timestamp, "Deadline did not pass yet");
        require(items.seller == msg.sender, "Not seller");
        //require(items.isActive, "auction not active");
        items.isActive = false;
        address maxBidUser;
        
        if (items.bidAmounts.length == 0) {
          _transfer(address(this), items.seller, tokenId);
            // ERC721(_nft).safeTransferFrom(
            //     address(this),
            //     items.seller,
            //     _tokenId
            // ); 0xb27A31f1b0AF2946B7F582768f03239b1eC07c2c
        } else {
            (bool success, ) = items.seller.call{value: items.maxBid}("");
            require(success);
            for (uint256 i = 0; i < items.users.length; i++) {
                if (items.users[i] != items.maxBidUser) {
                    (success, ) = items.users[i].call{
                        value: bids[tokenId][items.users[i]]
                    }("");
                    require(success);
                }
            }
      items.owner = payable(maxBidUser);
      items.sold = true;
      items.seller = payable(address(0));
      _itemsSold.increment();

            _transfer(address(this), items.maxBidUser, tokenId);
            // ERC721(_nft).safeTransferFrom(
            //     address(this),
            //     items.maxBidUser,
            //     _tokenId
            // );

           emit MarketItemsold(
        //_tokenId,  
           msg.sender,
           address(items.maxBidUser),
           address(items.maxBidUser)
        
    );
        payable(owner).transfer(listingPrice);  
        
    }
 }
}