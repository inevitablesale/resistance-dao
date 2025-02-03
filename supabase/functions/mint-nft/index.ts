import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ethers } from 'https://esm.sh/ethers@6.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address, governancePower, metadata } = await req.json();
    console.log('Received metadata processing request:', { address, governancePower });

    if (!address || !governancePower || !metadata) {
      throw new Error('Missing required parameters');
    }

    // Here we just verify and process the metadata
    // The actual minting will be handled by Dynamic's wallet on the client side
    console.log('Verifying metadata and governance power...');
    
    if (!metadata.fullName || !metadata.attributes || !Array.isArray(metadata.attributes)) {
      throw new Error('Invalid metadata format');
    }

    // Return the processed metadata and verification status
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Metadata verified successfully',
        metadata,
        verificationStatus: 'approved'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error in mint-nft function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});