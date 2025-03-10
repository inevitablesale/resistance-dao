
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

// Fetch metadata from a CID using Pinata gateway - THIS IS THE MAIN FUNCTION
export const fetchMetadataFromCID = async (cid: string): Promise<any> => {
  if (!isValidCID(cid)) {
    throw new Error(`Invalid CID format: ${cid}`);
  }
  
  try {
    const url = getCIDGatewayUrl(cid);
    console.log('Fetching from Pinata URL:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Direct request to Pinata gateway
    const response = await fetch(url, { 
      signal: controller.signal,
      cache: 'no-store', // Don't use cache to ensure we get fresh data
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Pinata request failed: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('Raw Pinata response:', responseText);
    
    let metadata;
    try {
      metadata = JSON.parse(responseText);
      console.log('Parsed Pinata metadata:', metadata);
    } catch (e) {
      console.error('Failed to parse Pinata response as JSON:', e);
      throw new Error('Invalid JSON response from Pinata');
    }
    
    // Add a property to track whether we've already shown a notification for this metadata
    metadata.notified = false;
    
    return metadata;
  } catch (error) {
    console.error(`Error fetching metadata for CID ${cid}:`, error);
    
    // Return a basic fallback metadata object instead of throwing
    return { 
      error: true,
      message: error instanceof Error ? error.message : 'Failed to fetch metadata',
      fallback: true,
      notified: true // Prevent notification for fallback metadata
    };
  }
};

// Fetch character metadata by name
export const fetchCharacterMetadataByName = async (name: string): Promise<any> => {
  const cid = getCharacterCIDByName(name);
  if (!cid) {
    throw new Error(`No CID found for character: ${name}`);
  }
  
  return fetchMetadataFromCID(cid);
};
