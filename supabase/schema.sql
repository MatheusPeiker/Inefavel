-- Criar tabela para armazenar submissões do formulário de contato
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  objective TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar índice para melhorar performance de consultas por data
CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON contact_submissions(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir inserções públicas (anônimas)
CREATE POLICY "Permitir inserções públicas" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Criar política para permitir leituras apenas para usuários autenticados
CREATE POLICY "Permitir leituras autenticadas" ON contact_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated');
