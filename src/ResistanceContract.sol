
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts@4.9.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.9.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.0/interfaces/IERC2981.sol";
import "@openzeppelin/contracts@4.9.0/utils/Strings.sol";
import "@openzeppelin/contracts@4.9.0/utils/Base64.sol";

contract ResistanceBase is ERC721URIStorage, IERC2981, Ownable {
    using Strings for uint256;

    // ===============================
    // Role Assignment & Supply Constants
    // ===============================
    enum NFTRole { SENTINEL, SURVIVOR, BOUNTY_HUNTER }
    
    uint256 public constant SENTINEL_PER_TYPE = 100;
    uint256 public constant OTHER_ROLES_PER_TYPE = 150;
    uint256 public constant SENTINEL_TYPES = 7;
    uint256 public constant SURVIVOR_TYPES = 6;
    uint256 public constant BOUNTY_HUNTER_TYPES = 6;
    
    uint256 public constant TOTAL_SENTINELS = SENTINEL_PER_TYPE * SENTINEL_TYPES;
    uint256 public constant TOTAL_SURVIVORS = OTHER_ROLES_PER_TYPE * SURVIVOR_TYPES;
    uint256 public constant TOTAL_BOUNTY_HUNTERS = OTHER_ROLES_PER_TYPE * BOUNTY_HUNTER_TYPES;
    uint256 public constant MAX_SUPPLY = TOTAL_SENTINELS + TOTAL_SURVIVORS + TOTAL_BOUNTY_HUNTERS;

    // Role Tracking
    mapping(uint256 => NFTRole) public nftRoles;
    mapping(NFTRole => uint256) public roleMintCount;
    mapping(address => NFTRole) public accountRoles;

    // ===============================
    // Character Type Management
    // ===============================
    struct CharacterType {
        NFTRole role;
        uint256 maxSupply;
        uint256 currentSupply;
        string name;
        string metadataURI; // Changed from uri to metadataURI
    }
    
    mapping(uint256 => CharacterType) public characterTypes;
    mapping(uint256 => uint256) public tokenCharacterType;
    uint256 public totalMinted;

    // ===============================
    // Character Metadata CIDs
    // ===============================
    // Mapping to store character metadata CIDs (to be filled in by admin)
    mapping(uint256 => string) public characterMetadataCID;
    string public baseMetadataURI = "https://gateway.pinata.cloud/ipfs/";
    bool public metadataLocked = false;

    // ===============================
    // Economic System
    // ===============================
    struct ReferralReward {
        address bountyHunter;
        uint256 amount;  
        bool claimed;
    }

    mapping(address => ReferralReward) public referralRewards;
    uint256 public treasuryBalance;

    // ===============================
    // Radiation & Cooldown System
    // ===============================
    uint256 public globalRadiation = 10000;
    uint256 public constant RADIATION_REDUCTION_PER_NFT = 10;
    uint256 public constant COOLDOWN_PERIOD = 1 days;
    mapping(uint256 => uint256) public lastTransferTimestamp;
    mapping(address => bool) private uniqueHolders;
    uint256 public uniqueHolderCount;

    // ===============================
    // Royalty System
    // ===============================
    uint256 public constant BASIS_POINTS = 10000;
    address private royaltyRecipient;
    uint96 private royaltyFraction;

    // ===============================
    // Events
    // ===============================
    event RadiationLevelUpdated(uint256 newLevel, uint256 uniqueHolderCount, uint256 timestamp);
    event CharacterMinted(address indexed owner, uint256 indexed tokenId, NFTRole role, string characterType);
    event ReferralRewardPaid(address indexed bountyHunter, uint256 amount);
    event MetadataUpdated(uint256 indexed characterTypeId, string newCID);
    event BaseURIUpdated(string newBaseURI);
    event MetadataLocked();

    // ===============================
    // Constructor
    // ===============================
    constructor(address _royaltyRecipient, uint96 _royaltyFraction)
        ERC721("Resistance Collection", "RESIST")
        Ownable()
    {
        require(_royaltyFraction <= BASIS_POINTS, "Royalty too high");
        royaltyRecipient = _royaltyRecipient;
        royaltyFraction = _royaltyFraction;

        // Initialize Character Types (without real metadata CIDs for now)
        for (uint256 i = 1; i <= 19; i++) {
            NFTRole role = i <= 7 ? NFTRole.SENTINEL : (i <= 13 ? NFTRole.SURVIVOR : NFTRole.BOUNTY_HUNTER);
            uint256 maxSupply = (role == NFTRole.SENTINEL) ? SENTINEL_PER_TYPE : OTHER_ROLES_PER_TYPE;
            
            // Initialize with placeholder names
            string memory typeName;
            if (role == NFTRole.SENTINEL) {
                typeName = string(abi.encodePacked("Sentinel Type ", Strings.toString(i)));
            } else if (role == NFTRole.SURVIVOR) {
                typeName = string(abi.encodePacked("Survivor Type ", Strings.toString(i - 7)));
            } else {
                typeName = string(abi.encodePacked("Bounty Hunter Type ", Strings.toString(i - 13)));
            }
            
            // Leave metadataURI empty to be filled later
            characterTypes[i] = CharacterType(role, maxSupply, 0, typeName, "");
        }
    }

    // ===============================
    // 🔹 Metadata Management
    // ===============================
    
    // Set metadata CID for a specific character type
    function setCharacterMetadataCID(uint256 characterTypeId, string calldata cid) external onlyOwner {
        require(!metadataLocked, "Metadata is locked");
        require(characterTypeId > 0 && characterTypeId <= 19, "Invalid character type ID");
        characterMetadataCID[characterTypeId] = cid;
        emit MetadataUpdated(characterTypeId, cid);
    }
    
    // Batch set metadata CIDs for multiple character types
    function batchSetCharacterMetadataCIDs(uint256[] calldata typeIds, string[] calldata cids) external onlyOwner {
        require(!metadataLocked, "Metadata is locked");
        require(typeIds.length == cids.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < typeIds.length; i++) {
            require(typeIds[i] > 0 && typeIds[i] <= 19, "Invalid character type ID");
            characterMetadataCID[typeIds[i]] = cids[i];
            emit MetadataUpdated(typeIds[i], cids[i]);
        }
    }
    
    // Update base URI (if IPFS gateway changes)
    function setBaseMetadataURI(string calldata newBaseURI) external onlyOwner {
        require(!metadataLocked, "Metadata is locked");
        baseMetadataURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }
    
    // Permanently lock metadata to prevent changes
    function lockMetadata() external onlyOwner {
        metadataLocked = true;
        emit MetadataLocked();
    }

    // ===============================
    // 🔹 Mint All NFTs to Owner (for OpenSea Listing)
    // ===============================
    function mintAllToOwner() external onlyOwner {
        require(totalMinted == 0, "Already minted");

        for (uint256 typeId = 1; typeId <= 19; typeId++) {
            CharacterType storage character = characterTypes[typeId];
            for (uint256 i = 0; i < character.maxSupply; i++) {
                uint256 tokenId = totalMinted + 1;
                _safeMint(owner(), tokenId);
                
                nftRoles[tokenId] = character.role;
                tokenCharacterType[tokenId] = typeId;
                character.currentSupply++;
                totalMinted++;

                emit CharacterMinted(owner(), tokenId, character.role, character.name);
            }
        }
    }

    // ===============================
    // 🔹 OpenSea Metadata Standard
    // ===============================
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        uint256 characterTypeId = tokenCharacterType[tokenId];
        
        // If we have a CID for this character type, return the full IPFS URI
        if (bytes(characterMetadataCID[characterTypeId]).length > 0) {
            return string(abi.encodePacked(baseMetadataURI, characterMetadataCID[characterTypeId]));
        }
        
        // Fallback to on-chain basic metadata if no CID is set
        CharacterType memory ct = characterTypes[characterTypeId];
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "', ct.name, " #", tokenId.toString(),
                        '", "description": "Limited Edition Resistance NFT. Metadata will be updated soon.", ',
                        '"image": "ipfs://bafybeiaka4nwivikersja2z3aujdgzhlo3bqcrtzcwixfbdfcjvrlyxmcq"}'
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    // ===============================
    // 🔹 IERC2981 (Royalties)
    // ===============================
    function royaltyInfo(uint256, uint256 salePrice) external view override returns (address, uint256) {
        return (royaltyRecipient, (salePrice * royaltyFraction) / BASIS_POINTS);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }

    // ===============================
    // 🔹 Transfer Cooldown
    // ===============================
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

        if (from != address(0) && to != address(0)) {
            require(
                block.timestamp - lastTransferTimestamp[firstTokenId] >= COOLDOWN_PERIOD,
                "Token is in cooldown period"
            );
            lastTransferTimestamp[firstTokenId] = block.timestamp;
        }
    }

    function _burn(uint256 tokenId) internal override(ERC721URIStorage) {
        super._burn(tokenId);
    }
}
