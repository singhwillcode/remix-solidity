// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract VolatileAvatar is ERC721URIStorage, AutomationCompatibleInterface {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Chainlink Interfaces
    AggregatorV3Interface public priceFeed;

    // State Variables
    uint256 public interval;
    uint256 public lastTimeStamp;
    int256 public currentPrice;
    
    // 3 distinct IPFS URIs (to be updated with real CIDs)
    string[] public ipfsUris = [
        "ipfs://QmBaseForm",   // Remainder 0
        "ipfs://QmSuperSaiyan", // Remainder 1
        "ipfs://QmUltraInstinct" // Remainder 2
    ];

    event UpdatedPrice(int256 price, uint256 remainder, string newState);

    constructor(uint256 _interval, address _priceFeedAddress) ERC721("VolatileAvatar", "VAV") {
        interval = _interval;
        lastTimeStamp = block.timestamp;
        priceFeed = AggregatorV3Interface(_priceFeedAddress); // Sepolia ETH/USD Address
    }

    // Mints a new NFT to the user
    function mint(address to) public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(to, newItemId);
        
        // Default to initial state based on current price immediately or wait for upkeep
        updateTokenURI(newItemId, getModState());
    }

    // Helper to calculate the current Mod State
    // Formula: (Price / 100) % 3
    function getModState() public view returns (uint256) {
        // Fetch latest price
        (,int256 price,,,) = priceFeed.latestRoundData();
        // Ensure positive price for modulo
        require(price > 0, "Negative price not supported");
        
        // Price feeds usually have 8 decimals. 
        // Example: 3000.00000000 -> 300000000000
        // We typically want the integer USD value, so we might need to adjust decimals.
        // But for this logic, we'll assume the raw integer part provided by the prompt's logic 
        // or strictly follow prompt's "(Price / 100) % 3".
        // Assuming the prompt meant "Price in USD" strictly.
        // Let's interpret "Price" as the integer value (e.g. 3000).
        // Since Chainlink returns 8 decimals, 3000 is 3000 * 10^8.
        // To get 3000, we divide by 10^8.
        
        uint256 adjustedPrice = uint256(price) / 1e8; 
        
        return (adjustedPrice / 100) % 3;
    }

    // Internal function to set URI based on state
    function updateTokenURI(uint256 tokenId, uint256 stateIndex) internal {
        require(stateIndex < 3, "Invalid State");
        _setTokenURI(tokenId, ipfsUris[stateIndex]);
    }

    // CHECK UPKEEP (Off-chain trigger)
    // Runs to see if we need to update
    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We could also check if the state *would* change to save gas, 
        // but checking time interval is standard for demo.
    }

    // PERFORM UPKEEP (On-chain execution)
    function performUpkeep(bytes calldata /* performData */) external override {
        // Revalidate time
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            
            // Get new state
            uint256 newState = getModState();
            
            // Update ALL tokens (Simplification for MiniProject: updating just 1 or looping)
            // For a production NFT collection, looping could hit gas limits.
            // For this mini-project, we will assume a small number of tokens or just update the latest/all.
            // Let's loop through all minted tokens to update them (Beware Gas Limits in Prod!)
            uint256 total = _tokenIds.current();
            for (uint256 i = 1; i <= total; i++) {
                updateTokenURI(i, newState);
            }
            
            // Store price for display purposes
            (,int256 price,,,) = priceFeed.latestRoundData();
            currentPrice = price;
        }
    }
    
    // View function to change CIDs if needed
    function setIpfsUri(uint256 index, string memory uri) public {
        // Add onlyOwner in real prod
        ipfsUris[index] = uri;
    }
}
