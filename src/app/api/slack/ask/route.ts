import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

// Handle Slack slash command
export async function POST(request: NextRequest) {
  try {
    // Slack sends form-urlencoded data
    const formData = await request.formData();
    const text = formData.get('text') as string;
    const userId = formData.get('user_id') as string;
    const userName = formData.get('user_name') as string;
    const channelId = formData.get('channel_id') as string;
    const responseUrl = formData.get('response_url') as string;

    if (!text) {
      return NextResponse.json({
        response_type: 'ephemeral',
        text: 'Please provide a question. Usage: `/ask how do I setup mailboxes?`',
      });
    }

    // Generate embedding and query
    const embedding = await getEmbedding(text);
    
    const { data, error } = await supabase.rpc('match_knowledge', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 3,
      filter_source: null,
    });

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        response_type: 'ephemeral',
        text: `Sorry, I couldn't find anything related to "${text}". Try rephrasing your question.`,
      });
    }

    // Format the results for Slack
    const blocks: any[] = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Question:* ${text}`,
        },
      },
      { type: 'divider' },
    ];

    data.forEach((result: any, index: number) => {
      const sourceEmoji = result.source === 'team_faq' ? '❓' : '📢';
      const similarity = Math.round(result.similarity * 100);
      
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${sourceEmoji} *${result.title}*\n${result.content.slice(0, 500)}${result.content.length > 500 ? '...' : ''}\n_Relevance: ${similarity}%_`,
        },
      });
      
      if (result.metadata?.url) {
        blocks.push({
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `<${result.metadata.url}|View in Notion>`,
            },
          ],
        });
      }
      
      if (index < data.length - 1) {
        blocks.push({ type: 'divider' });
      }
    });

    return NextResponse.json({
      response_type: 'in_channel',
      blocks,
      text: `Found ${data.length} results for "${text}"`,
    });
  } catch (error) {
    console.error('Slack ask error:', error);
    return NextResponse.json({
      response_type: 'ephemeral',
      text: 'Sorry, something went wrong. Please try again.',
    });
  }
}
