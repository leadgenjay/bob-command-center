import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Generate embedding via OpenAI
async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text.slice(0, 8000),
    }),
  });
  
  const data = await response.json();
  return data.data[0].embedding;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, source, limit = 5, threshold = 0.5 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Generate embedding for the query
    const embedding = await getEmbedding(query);

    // Call the match_knowledge function
    const { data, error } = await supabase.rpc('match_knowledge', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
      filter_source: source || null,
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      results: data,
      query,
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Knowledge query error:', error);
    return NextResponse.json(
      { error: 'Failed to query knowledge base' },
      { status: 500 }
    );
  }
}

// GET endpoint for simple queries via URL params
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const source = searchParams.get('source');
  const limit = parseInt(searchParams.get('limit') || '5');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  // Reuse POST logic
  const fakeRequest = {
    json: async () => ({ query, source, limit }),
  } as NextRequest;
  
  return POST(fakeRequest);
}
