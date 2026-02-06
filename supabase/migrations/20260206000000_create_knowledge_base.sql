-- Enable the pgvector extension
create extension if not exists vector;

-- Create the knowledge_base table
create table if not exists public.knowledge_base (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  source text not null, -- 'team_faq' or 'lgj_updates'
  source_id text not null, -- Notion page ID
  title text not null,
  content text not null, -- Combined searchable content
  metadata jsonb, -- Store category, tags, date, etc.
  embedding vector(1536), -- OpenAI text-embedding-3-small dimension
  unique(source, source_id)
);

-- Create index for vector similarity search
create index if not exists knowledge_base_embedding_idx 
  on public.knowledge_base 
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Create index for source filtering
create index if not exists knowledge_base_source_idx 
  on public.knowledge_base(source);

-- Create function for similarity search
create or replace function match_knowledge(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5,
  filter_source text default null
)
returns table (
  id uuid,
  source text,
  title text,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    kb.id,
    kb.source,
    kb.title,
    kb.content,
    kb.metadata,
    1 - (kb.embedding <=> query_embedding) as similarity
  from public.knowledge_base kb
  where 
    (filter_source is null or kb.source = filter_source)
    and 1 - (kb.embedding <=> query_embedding) > match_threshold
  order by kb.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Enable RLS
alter table public.knowledge_base enable row level security;

-- Allow read access (for the chatbot)
create policy "Allow read access to knowledge_base"
  on public.knowledge_base
  for select
  using (true);
