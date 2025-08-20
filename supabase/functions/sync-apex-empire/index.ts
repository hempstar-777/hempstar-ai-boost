
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('Starting ApexEmpire sync process...')

    // Discover available endpoints
    const endpoints = await discoverApexEmpireEndpoints()
    console.log('Discovered endpoints:', endpoints)

    // Sync data from each available endpoint
    const syncResults = []
    for (const endpoint of endpoints) {
      try {
        const data = await syncFromEndpoint(endpoint)
        if (data) {
          await saveDataToDatabase(supabaseClient, endpoint, data)
          syncResults.push({ endpoint, status: 'success', data })
        }
      } catch (error) {
        console.error(`Failed to sync from ${endpoint}:`, error)
        syncResults.push({ endpoint, status: 'error', error: error.message })
      }
    }

    // Log sync results
    await supabaseClient
      .from('performance_metrics')
      .insert([{
        metric_type: 'apex_empire_sync',
        value: syncResults.filter(r => r.status === 'success').length,
        unit: 'successful_syncs',
        metadata: { results: syncResults, timestamp: new Date().toISOString() }
      }])

    return new Response(
      JSON.stringify({ 
        message: 'ApexEmpire sync completed',
        results: syncResults,
        successful_syncs: syncResults.filter(r => r.status === 'success').length,
        total_endpoints: endpoints.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Sync process error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function discoverApexEmpireEndpoints(): Promise<string[]> {
  const commonEndpoints = [
    '/api/v1/analytics',
    '/api/analytics',
    '/api/traffic',
    '/api/data',
    '/api/metrics',
    '/api/integration',
    '/api/hempstar',
    '/api/cannabis',
    '/api/marketing'
  ]

  const discoveredEndpoints: string[] = []

  for (const endpoint of commonEndpoints) {
    try {
      const url = `https://apexempire.org${endpoint}`
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'HEMPSTAR-Sync-Bot/1.0'
        }
      })
      
      if (response.ok) {
        discoveredEndpoints.push(endpoint)
        console.log(`✅ Found API endpoint: ${endpoint}`)
      }
    } catch (error) {
      // Endpoint not available
    }
  }

  return discoveredEndpoints
}

async function syncFromEndpoint(endpoint: string): Promise<any> {
  const url = `https://apexempire.org${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'HEMPSTAR-Sync-Bot/1.0',
      'X-Integration': 'HEMPSTAR-Traffic-System'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return await response.json()
}

async function saveDataToDatabase(supabaseClient: any, endpoint: string, data: any) {
  // Determine data type based on endpoint
  let dataType = 'general'
  let tableName = 'performance_metrics'
  let processedData = data

  if (endpoint.includes('analytics') || endpoint.includes('traffic')) {
    dataType = 'traffic_data'
    tableName = 'traffic_analytics'
    processedData = processTrafficData(data)
  } else if (endpoint.includes('competitor')) {
    dataType = 'competitor_data'
    tableName = 'competitor_data'
    processedData = processCompetitorData(data)
  } else if (endpoint.includes('metrics')) {
    dataType = 'performance_metrics'
    tableName = 'performance_metrics'
    processedData = processMetricsData(data)
  }

  // Save to appropriate table
  if (tableName === 'performance_metrics') {
    await supabaseClient
      .from(tableName)
      .insert([{
        metric_type: `apex_empire_${dataType}`,
        value: Array.isArray(processedData) ? processedData.length : 1,
        unit: 'data_points',
        metadata: { source: endpoint, data: processedData }
      }])
  } else {
    await supabaseClient
      .from(tableName)
      .insert(Array.isArray(processedData) ? processedData : [processedData])
  }

  console.log(`✅ Saved ${dataType} data from ${endpoint}`)
}

function processTrafficData(data: any): any {
  // Process traffic analytics data
  if (data.traffic) {
    return {
      date: new Date().toISOString().split('T')[0],
      visitors: data.traffic.visitors || 0,
      page_views: data.traffic.page_views || 0,
      bounce_rate: data.traffic.bounce_rate || 0,
      avg_session_duration: data.traffic.avg_session_duration || 0,
      conversion_rate: data.traffic.conversion_rate || 0,
      traffic_sources: data.traffic.sources || {}
    }
  }
  return data
}

function processCompetitorData(data: any): any {
  // Process competitor data
  if (Array.isArray(data)) {
    return data.map(competitor => ({
      competitor_name: competitor.name || 'Unknown',
      website_url: competitor.url || '',
      traffic_estimate: competitor.traffic || 0,
      ranking_keywords: competitor.keywords || [],
      social_metrics: competitor.social || {},
      last_updated: new Date().toISOString()
    }))
  }
  return data
}

function processMetricsData(data: any): any {
  // Process performance metrics
  return data
}
