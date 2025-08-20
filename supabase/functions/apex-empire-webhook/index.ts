
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { event, data, signature } = await req.json()

    console.log('ApexEmpire webhook received:', { event, data })

    // Verify webhook signature (in production)
    // const isValid = verifySignature(signature, JSON.stringify({ event, data }))
    // if (!isValid) {
    //   return new Response('Invalid signature', { status: 401, headers: corsHeaders })
    // }

    // Process different webhook events
    switch (event) {
      case 'traffic_spike':
        await handleTrafficSpike(supabaseClient, data)
        break
      case 'competitor_change':
        await handleCompetitorChange(supabaseClient, data)
        break
      case 'seo_alert':
        await handleSEOAlert(supabaseClient, data)
        break
      case 'market_trend':
        await handleMarketTrend(supabaseClient, data)
        break
      default:
        console.log('Unknown webhook event:', event)
    }

    return new Response(
      JSON.stringify({ message: 'Webhook processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function handleTrafficSpike(supabaseClient: any, data: any) {
  console.log('Processing traffic spike:', data)
  
  // Create alert for traffic spike
  const { error } = await supabaseClient
    .from('traffic_alerts')
    .insert([{
      alert_type: 'traffic_spike',
      title: 'Traffic Spike Detected',
      message: `Traffic spike detected: ${data.increase}% increase from ApexEmpire insights`,
      severity: 'info',
      data: data,
      read: false
    }])

  if (error) {
    console.error('Error creating traffic alert:', error)
  }

  // Update performance metrics
  await supabaseClient
    .from('performance_metrics')
    .insert([{
      metric_type: 'traffic_spike',
      value: data.increase || 0,
      unit: 'percentage',
      metadata: data
    }])
}

async function handleCompetitorChange(supabaseClient: any, data: any) {
  console.log('Processing competitor change:', data)
  
  // Update competitor data
  const { error } = await supabaseClient
    .from('competitor_data')
    .upsert([{
      competitor_name: data.competitor_name,
      website_url: data.website_url,
      traffic_estimate: data.traffic_estimate,
      ranking_keywords: data.keywords || [],
      social_metrics: data.social_metrics || {},
      last_updated: new Date().toISOString()
    }], { onConflict: 'website_url' })

  if (error) {
    console.error('Error updating competitor data:', error)
  }

  // Create alert for significant changes
  if (data.significant_change) {
    await supabaseClient
      .from('traffic_alerts')
      .insert([{
        alert_type: 'competitor_change',
        title: 'Competitor Activity Detected',
        message: `${data.competitor_name} has made significant changes`,
        severity: 'warning',
        data: data,
        read: false
      }])
  }
}

async function handleSEOAlert(supabaseClient: any, data: any) {
  console.log('Processing SEO alert:', data)
  
  // Create SEO alert
  const { error } = await supabaseClient
    .from('traffic_alerts')
    .insert([{
      alert_type: 'seo_alert',
      title: 'SEO Optimization Opportunity',
      message: data.message || 'New SEO opportunity detected',
      severity: data.severity || 'info',
      data: data,
      read: false
    }])

  if (error) {
    console.error('Error creating SEO alert:', error)
  }

  // Log SEO metric
  await supabaseClient
    .from('performance_metrics')
    .insert([{
      metric_type: 'seo_score',
      value: data.score || 0,
      unit: 'score',
      metadata: data
    }])
}

async function handleMarketTrend(supabaseClient: any, data: any) {
  console.log('Processing market trend:', data)
  
  // Save market trend data
  const { error } = await supabaseClient
    .from('performance_metrics')
    .insert([{
      metric_type: 'market_trend',
      value: data.trend_score || 0,
      unit: 'trend_score',
      metadata: data
    }])

  if (error) {
    console.error('Error saving market trend:', error)
  }

  // Create alert for significant trends
  if (data.significance === 'high') {
    await supabaseClient
      .from('traffic_alerts')
      .insert([{
        alert_type: 'market_trend',
        title: 'Market Trend Alert',
        message: `Significant market trend detected: ${data.description}`,
        severity: 'info',
        data: data,
        read: false
      }])
  }
}
