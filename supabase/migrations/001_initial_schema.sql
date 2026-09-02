-- gym_progress: tracks 40 gym leaders (5 regions x 8 leaders)
CREATE TABLE gym_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  gym_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, gym_id)
);

-- berry_crops: active farming crops
CREATE TABLE berry_crops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  berry_type TEXT NOT NULL,
  location TEXT,
  planted_at TIMESTAMPTZ NOT NULL,
  water_count INTEGER DEFAULT 0,
  last_watered_at TIMESTAMPTZ,
  harvested BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- pokemon_caught: national dex IDs caught by user
CREATE TABLE pokemon_caught (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pokemon_id INTEGER NOT NULL,
  caught_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, pokemon_id)
);

-- user_preferences: all user settings
CREATE TABLE user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  active_tab TEXT DEFAULT 'gyms',
  dex_region TEXT DEFAULT 'Kanto',
  dex_filters JSONB DEFAULT '{}',
  amulet_coin_enabled BOOLEAN DEFAULT true,
  breeding_config JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- pokedex_suggestions: user-submitted corrections
CREATE TABLE pokedex_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pokemon_id INTEGER NOT NULL,
  field TEXT NOT NULL,
  current_value TEXT,
  suggested_value TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE gym_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE berry_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE pokemon_caught ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE pokedex_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their own gym progress" ON gym_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own berry crops" ON berry_crops FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own caught pokemon" ON pokemon_caught FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own suggestions" ON pokedex_suggestions FOR ALL USING (auth.uid() = user_id);
