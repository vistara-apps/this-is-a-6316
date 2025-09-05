import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Using local storage fallback.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database schema setup SQL (for reference)
export const DATABASE_SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT ENCRYPTED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free',
  privy_user_id TEXT UNIQUE
);

-- Dream entries table
CREATE TABLE IF NOT EXISTS dream_entries (
  dream_entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  dream_date DATE NOT NULL,
  dream_text TEXT ENCRYPTED,
  interpretation TEXT ENCRYPTED,
  tags TEXT[] ENCRYPTED,
  emotions TEXT[] ENCRYPTED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dream_entries_user_id ON dream_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_dream_entries_dream_date ON dream_entries(dream_date);
CREATE INDEX IF NOT EXISTS idx_users_privy_user_id ON users(privy_user_id);
`;

// User operations
export const userService = {
  async createUser(userData) {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByPrivyId(privyUserId) {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('privy_user_id', privyUserId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateUser(userId, updates) {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Dream entry operations
export const dreamService = {
  async createDreamEntry(dreamEntry) {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('dream_entries')
      .insert([dreamEntry])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getDreamEntries(userId, limit = 50, offset = 0) {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('dream_entries')
      .select('*')
      .eq('user_id', userId)
      .order('dream_date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data || [];
  },

  async updateDreamEntry(dreamEntryId, updates) {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('dream_entries')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('dream_entry_id', dreamEntryId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteDreamEntry(dreamEntryId) {
    if (!supabase) return null;
    
    const { error } = await supabase
      .from('dream_entries')
      .delete()
      .eq('dream_entry_id', dreamEntryId);
    
    if (error) throw error;
    return true;
  }
};
