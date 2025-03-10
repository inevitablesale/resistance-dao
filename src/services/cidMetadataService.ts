
// This service handles the mapping of character CIDs from the smart contract

// Hardcoded CID mapping based on the contract data
export const characterCIDMapping: Record<string, string> = {
  // Sentinels
  "DAO Enforcer": "bafkreibo6bk5dezlsii7imuabncv7tihxwbi4f4urds75l7nuy2rnxfkru",
  "Insolvent Medic": "bafkreid7oobbrlbxcnnigfcwfbgr5m3dmsl6wemsuaxluzd54ioclneubq",
  "Liquidation Phantom": "bafkreicfsovqdpu3byxvyfev4y7xdmqz3hggewsuyx4brifoscercektpy",
  "Margin Call Marauder": "bafkreiaasojzt45tw5jkohgwvibtth6nl4jlognknercfpgir6zjpw335u",
  "Overleveraged Berserker": "bafkreihigf4xjzy4jrqkm7wsxxdtokwew4m3njdxt6hheb67nuit47byta",
  "Rugged Nomad": "bafkreibhb3upqoifbl77jbrqxp2puudelcrjf45jnfkdqipef6skzpewti",
  "Yield Farm Executioner": "bafkreibo5yjsmqlt2cc7olqeuz2wxref7oe54bmallzl4mgwkt3xsnjlqi",
  
  // Survivors
  "Rugpull Veteran": "bafkreiek2ihnc7fmpwzseitea2vflvwdmm6qvn4vydd5ww6wgipntf3w7a",
  "Blacklist Exile": "bafkreica5ugau5cjah7hkwz4ko36oqxkg2v4swqpxnhzi7z4wgftl76q5m",
  "Failed Validator": "bafkreigw5k75stzjhamdjtwlssbolhxepbeglfs3qoyowgu2q4n2fnfszy",
  
  // Bounty Hunters
  "Chain Reaper": "bafkreifepvbd2shm4uxfysdxtva5mjs7fqnxbxehutcoqfblmcgtp7h7ka",
  "Forked Hunter": "bafkreierebrs3yw24r7wgkezgok6lhbiwqwwgen5fnfqxm6cqul644x3fe",
  "Liquidated Tracker": "bafkreiajc2mwtirx3423mbf55scuniqlwh3ph2cglk7y2nbd764r6g6ine",
  "Oracle Stalker": "bafkreieytk2bsis7fdavqu74t3dgquew36ppycxnlbxt6dgzudjakcrexq",
  "Slippage Sniper": "bafkreidrcpfmaken4gsbeweqthzrg3bkcxi344bftqwndiapeo6pm4msda",
  "Sandwich Hunter": "bafkreigxfbvntll522na4la6b4cdvp5g74jztgjhgdmz2b5uv7uaieywie"
};

// Convert a CID to a Pinata gateway URL
export const getCIDGatewayUrl = (cid: string): string => {
  if (!cid) return '';
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};

// Get a character CID by name
export const getCharacterCIDByName = (name: string): string | undefined => {
  return characterCIDMapping[name];
};

// Get a character URL by CID
export const getCharacterUrlByCID = (cid: string): string => {
  return getCIDGatewayUrl(cid);
};

// Validate if a string is a valid CID
export const isValidCID = (cid: string): boolean => {
  // Simple validation - CIDs typically start with 'baf' for IPFS v1
  return cid.startsWith('baf') && cid.length > 40;
};
