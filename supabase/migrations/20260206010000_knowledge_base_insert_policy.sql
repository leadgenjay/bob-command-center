-- Allow inserts to knowledge_base
CREATE POLICY "Allow inserts to knowledge_base"
  ON public.knowledge_base
  FOR INSERT
  WITH CHECK (true);

-- Allow updates (for upserts)
CREATE POLICY "Allow updates to knowledge_base"
  ON public.knowledge_base
  FOR UPDATE
  USING (true);
