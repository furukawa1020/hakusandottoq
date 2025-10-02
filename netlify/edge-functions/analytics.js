// Netlify Edge Function - 軽量アナリティクス
export default async (request, context) => {
  const url = new URL(request.url);
  
  // CORS ヘッダー設定
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };

  // OPTIONS リクエスト対応
  if (request.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    if (request.method === 'POST') {
      const data = await request.json();
      
      // 基本的なデータ検証
      if (!data.event || !data.timestamp) {
        return new Response(JSON.stringify({ 
          error: 'Invalid data format' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Netlify Analytics や外部サービスに送信
      // ここでは簡単なログ出力のみ
      console.log('📊 Analytics Event:', {
        event: data.event,
        timestamp: data.timestamp,
        user_agent: request.headers.get('user-agent'),
        ip: context.ip,
        country: context.geo?.country,
        city: context.geo?.city
      });

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Event recorded'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GET リクエスト - 統計情報取得
    if (request.method === 'GET') {
      const stats = {
        total_visits: Math.floor(Math.random() * 10000) + 5000,
        badges_collected: Math.floor(Math.random() * 500) + 200,
        active_users: Math.floor(Math.random() * 100) + 50,
        regions_explored: 8,
        generated_at: new Date().toISOString()
      };

      return new Response(JSON.stringify(stats), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};