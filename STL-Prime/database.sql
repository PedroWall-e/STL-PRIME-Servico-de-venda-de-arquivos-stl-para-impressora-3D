-- =========================================================================================
-- STL PRIME: ESQUEMA DE BANCO DE DADOS (PostgreSQL - Otimizado para Supabase)
-- =========================================================================================

-- 1. ATIVAR EXTENSÃO UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABELA: users (Perfil de Usuários)
-- Nota: Autenticação base fica no auth.users do Supabase, 
-- esta tabela estende o perfil público.
-- ==========================================
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    is_creator BOOLEAN DEFAULT false,
    
    -- Campos de Assinatura
    stripe_customer_id TEXT,
    subscription_status VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'premium'
    subscription_id TEXT,

    -- Endereço e Localização
    address_street TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip TEXT,
    address_country TEXT DEFAULT 'Brasil',

    -- Administrativo
    role VARCHAR(20) DEFAULT 'user', -- 'user', 'admin'

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: categories
-- ==========================================
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon_name VARCHAR(50), -- ex: 'Cpu', 'Printer' (para mapear ícones Lucide)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INSERIR CATEGORIAS BASE
INSERT INTO public.categories (name, slug) VALUES 
('Prototipagem', 'prototipagem'),
('Cases IoT', 'cases-iot'),
('Engrenagens', 'engrenagens'),
('Gridfinity', 'gridfinity'),
('Miniaturas', 'miniaturas'),
('Utilidades', 'utilidades'),
('Ferramentas', 'ferramentas'),
('Robótica', 'robotica');

-- ==========================================
-- TABELA: models (Arquivos 3D Publicados)
-- ==========================================
CREATE TABLE public.models (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    format VARCHAR(50) NOT NULL, -- ex: '3MF + STL', 'STL'
    
    -- Arquivos e Mídia
    thumbnail_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    file_url TEXT NOT NULL, -- Caminho no Storage Bucket
    
    -- Relacionamentos
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    
    -- Estatísticas Cache (Atualizadas via Triggers/Functions)
    downloads_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    
    is_published BOOLEAN DEFAULT true,
    specs JSONB DEFAULT '{}', -- Dimensões, peso, compatibilidade, etc.
    files_list JSONB DEFAULT '[]', -- Lista de arquivos incluídos: [{name, size, format}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: likes (Favoritos/Curtidas)
-- ==========================================
CREATE TABLE public.likes (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    model_id UUID REFERENCES public.models(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, model_id)
);

-- ==========================================
-- TABELA: purchases (Histórico de Compras/Downloads)
-- ==========================================
CREATE TABLE public.purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    model_id UUID REFERENCES public.models(id) ON DELETE SET NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    stripe_session_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'completed', -- 'completed', 'refunded'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: user_subscriptions (Histórico de Assinaturas)
-- ==========================================
CREATE TABLE public.user_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    plan_type VARCHAR(50) NOT NULL, -- 'pro', 'premium'
    status VARCHAR(50) NOT NULL, -- 'active', 'canceled', 'past_due'
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: reviews (Avaliações dos Modelos)
-- ==========================================
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    model_id UUID REFERENCES public.models(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    print_photo_url TEXT, -- O usuário pode subir uma foto de como ficou a impressão (Make)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, model_id) -- Usuário só pode avaliar um modelo 1 vez
);

-- ============================================================================
-- SEGURANÇA: RLS (Row Level Security) - SUPABASE
-- Regras para garantir que usuários só modifiquem seus próprios dados
-- ============================================================================

-- Ativar RLS nas tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura
CREATE POLICY "Public profiles are visible to everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Categories are visible to everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Published models are visible to everyone" ON public.models FOR SELECT USING (is_published = true);
CREATE POLICY "Reviews are visible to everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can see own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Políticas de Modificação (Apenas dono)
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Creators can insert own models" ON public.models FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Creators can update own models" ON public.models FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can like/unlike" ON public.likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can see own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can leave reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- TRIGGER: Atualizar count de likes na tabela de models
-- ==========================================
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.models SET likes_count = likes_count + 1 WHERE id = NEW.model_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.models SET likes_count = likes_count - 1 WHERE id = OLD.model_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER like_inserted_deleted
AFTER INSERT OR DELETE ON public.likes
FOR EACH ROW EXECUTE FUNCTION update_likes_count();
-- ==========================================
-- TABELA: post_categories
-- ==========================================
CREATE TABLE public.post_categories (
    id VARCHAR(50) PRIMARY KEY, -- ex: 'showcase', 'doubt'
    label VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.post_categories (id, label) VALUES 
('showcase', '🎨 Showcase'),
('doubt', '❓ Dúvidas'),
('tutorial', '📚 Tutoriais'),
('challenge', '🏆 Desafios');

-- ==========================================
-- TABELA: posts (Comunidade)
-- ==========================================
CREATE TABLE public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category VARCHAR(50) REFERENCES public.post_categories(id),
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    model_id UUID REFERENCES public.models(id) ON DELETE SET NULL, -- Vínculo opcional com um modelo
    images TEXT[] DEFAULT '{}',
    
    -- Stats cache
    likes_count INTEGER DEFAULT 0,
    useful_count INTEGER DEFAULT 0,
    fire_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: post_comments (Comentários de Posts)
-- ==========================================
CREATE TABLE public.post_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: post_reactions (Reações de Posts)
-- ==========================================
CREATE TABLE public.post_reactions (
    PRIMARY KEY (post_id, user_id, type)
);

-- ==========================================
-- TABELA: collections (Coleções de Usuários)
-- ==========================================
CREATE TABLE public.collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- TABELA: collection_items (Itens das Coleções)
-- ==========================================
CREATE TABLE public.collection_items (
    collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
    model_id UUID REFERENCES public.models(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (collection_id, model_id)
);

-- ============================================================================
-- SEGURANÇA: RLS - COMUNIDADE
-- ============================================================================
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post categories are visible to everyone" ON public.post_categories FOR SELECT USING (true);
CREATE POLICY "Posts are visible to everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Comments are visible to everyone" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Reactions are visible to everyone" ON public.post_reactions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authenticated users can comment" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authenticated users can react" ON public.post_reactions FOR ALL USING (auth.uid() = user_id);

-- Coleções RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collections are visible to owners" ON public.collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public collections are visible to everyone" ON public.collections FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage own collections" ON public.collections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Collection items are visible to collection owners" ON public.collection_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.collections WHERE id = collection_id AND (user_id = auth.uid() OR is_public = true))
);
CREATE POLICY "Users can manage items in own collections" ON public.collection_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.collections WHERE id = collection_id AND user_id = auth.uid())
);

-- ==========================================
-- TRIGGERS: Atualizar counts de posts
-- ==========================================
CREATE OR REPLACE FUNCTION update_post_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (TG_TABLE_NAME = 'post_comments') THEN
      UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    ELSIF (TG_TABLE_NAME = 'post_reactions') THEN
      IF NEW.type = 'like' THEN UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
      ELSIF NEW.type = 'useful' THEN UPDATE public.posts SET useful_count = useful_count + 1 WHERE id = NEW.post_id;
      ELSIF NEW.type = 'fire' THEN UPDATE public.posts SET fire_count = fire_count + 1 WHERE id = NEW.post_id;
      END IF;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF (TG_TABLE_NAME = 'post_comments') THEN
      UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    ELSIF (TG_TABLE_NAME = 'post_reactions') THEN
      IF OLD.type = 'like' THEN UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
      ELSIF OLD.type = 'useful' THEN UPDATE public.posts SET useful_count = useful_count - 1 WHERE id = OLD.post_id;
      ELSIF OLD.type = 'fire' THEN UPDATE public.posts SET fire_count = fire_count - 1 WHERE id = OLD.post_id;
      END IF;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_comment_stat_trigger AFTER INSERT OR DELETE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION update_post_stats();
CREATE TRIGGER post_reaction_stat_trigger AFTER INSERT OR DELETE ON public.post_reactions FOR EACH ROW EXECUTE FUNCTION update_post_stats();
