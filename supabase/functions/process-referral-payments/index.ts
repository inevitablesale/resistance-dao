
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const { data: unpaidReferrals, error: fetchError } = await supabase
      .from('referrals')
      .select('*')
      .eq('nft_purchased', true)
      .eq('payment_processed', false)

    if (fetchError) throw fetchError

    if (!unpaidReferrals || unpaidReferrals.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No unpaid referrals found', processed: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Process each referral
    const processed = []
    for (const referral of unpaidReferrals) {
      // In a real implementation, this would trigger a payment to the referrer
      // For now, we'll just mark it as processed with a fake transaction hash
      const txHash = `0x${crypto.randomUUID().replace(/-/g, '')}`
      
      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          payment_processed: true,
          payment_date: new Date().toISOString(),
          payment_tx_hash: txHash
        })
        .eq('id', referral.id)

      if (updateError) {
        console.error(`Error processing referral ${referral.id}:`, updateError)
        continue
      }
      
      processed.push(referral.id)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Referral payments processed', 
        processed: processed.length,
        referralIds: processed 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
