-- =========================================================================================
-- STL PRIME: MIGRAÇÃO DA FASE 10 (Moderação & Nível de Confiança)
-- =========================================================================================
-- Instruções: Copie este código e cole no SQL Editor do seu projeto Supabase e clique em RUN.
-- OBS: Esta migração não apaga nenhum dado existente.

-- 1. Adicionar o nível de confiança na tabela USERS
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS trust_level INTEGER DEFAULT 1;

-- 2. Atualizar usuários que já são "Criadores Oficiais" ou Admins para Nível 2
UPDATE public.users SET trust_level = 2 WHERE is_creator = true OR role = 'admin';

-- 3. Adicionar o status de moderação na tabela MODELS
ALTER TABLE public.models 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- 4. Atualizar os modelos antigos para "approved" para não derrubar o site atual
UPDATE public.models SET status = 'approved' WHERE status = 'pending';

-- Finalizando com sucesso!
