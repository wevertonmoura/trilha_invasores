import { createClient } from '@supabase/supabase-js'

// Aqui nós apenas LEMOS o que está no arquivo .env.local
// O "process.env" vai buscar o valor lá automaticamente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)