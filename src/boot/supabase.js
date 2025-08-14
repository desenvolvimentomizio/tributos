// src/boot/supabase.js
import { createClient } from '@supabase/supabase-js'
import useAuthUser from 'src/composables/UseAuthUser' // opcional, se você controla usuário reativo

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Mantém o usuário reativo (se você tiver esse composable)
try {
  const { user } = useAuthUser?.() || {}
  supabase.auth.onAuthStateChange((_event, session) => {
    if (user) user.value = session?.user ?? null
  })
} catch  {
  // se não tiver o composable, tudo bem
}

export default function useSupabase () {
  return { supabase }
}












