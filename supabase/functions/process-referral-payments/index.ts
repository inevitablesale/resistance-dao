
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReferralPayment {
  id: string;
  referrer_address: string;
  referred_address: string;
  payment_amount: number;
  payment_tx_hash: string;
  payment_date: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
    })
  }

  // Create a Supabase client with the service role key
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // Get unpaid referrals where an NFT has been purchased
    console.log("Fetching unpaid referrals with NFT purchases");
    const { data: unpaidReferrals, error: fetchError } = await supabase
      .from('referrals')
      .select('*')
      .eq('nft_purchased', true)
      .eq('payment_processed', false)

    if (fetchError) throw fetchError

    if (!unpaidReferrals || unpaidReferrals.length === 0) {
      console.log("No unpaid referrals found");
      return new Response(
        JSON.stringify({ message: 'No unpaid referrals found', processed: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    console.log(`Found ${unpaidReferrals.length} unpaid referrals`);
    
    // Process each referral
    const processed: ReferralPayment[] = [];
    const errors: { id: string, error: string }[] = [];
    
    for (const referral of unpaidReferrals) {
      try {
        console.log(`Processing referral ${referral.id} for ${referral.referrer_address}`);
        
        // In a real implementation, this would trigger a payment to the referrer
        // Generate a fake transaction hash for demo purposes
        const txHash = `0x${crypto.randomUUID().replace(/-/g, '')}`
        const paymentAmount = 25; // $25 per successful referral
        const paymentDate = new Date().toISOString();
        
        const { error: updateError } = await supabase
          .from('referrals')
          .update({
            payment_processed: true,
            payment_date: paymentDate,
            payment_amount: paymentAmount,
            payment_tx_hash: txHash
          })
          .eq('id', referral.id)

        if (updateError) {
          console.error(`Error processing referral ${referral.id}:`, updateError);
          errors.push({ id: referral.id, error: updateError.message });
          continue;
        }
        
        processed.push({
          id: referral.id,
          referrer_address: referral.referrer_address,
          referred_address: referral.referred_address,
          payment_amount: paymentAmount,
          payment_tx_hash: txHash,
          payment_date: paymentDate
        });
        
        console.log(`Successfully processed payment for referral ${referral.id}`);
      } catch (innerError) {
        console.error(`Error processing referral ${referral.id}:`, innerError);
        errors.push({ id: referral.id, error: (innerError as Error).message });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Referral payments processed', 
        processed: processed.length,
        payments: processed,
        errors: errors.length > 0 ? errors : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
