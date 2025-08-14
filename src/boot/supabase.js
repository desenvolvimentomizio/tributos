// src/boot/supabase.js
import { createClient } from '@supabase/supabase-js'

// OBS: no Quasar, normalmente você injeta variáveis no build.env.
// Se estiver usando quasar.config.* com build.env, process.env.* funciona.
// Caso esteja usando Vite puro, troque para import.meta.env.VITE_SUPABASE_*
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('[supabase] SUPABASE_URL ou SUPABASE_KEY não definidos nas envs.')
}

// Singleton do client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Registro opcional de listeners de auth (para evitar import circular)
const authListeners = new Set()
let unsubscribe = null

/**
 * Permite que outros módulos registrem um callback para mudanças de auth,
 * sem precisar importar composables aqui (evita ciclo).
 */
export function onAuthStateChange (cb) {
  if (typeof cb === 'function') {
    authListeners.add(cb)
  }
  // inicia assinatura uma única vez
  if (!unsubscribe) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // notifica todos listeners
      authListeners.forEach(fn => {
        try { fn(event, session) } catch  { /* noop */ }
      })
    })
    unsubscribe = data?.subscription?.unsubscribe || null
  }
  // retorna função para remover o listener
  return () => authListeners.delete(cb)
}

/**
 * Composable simples para obter o client
 */
export default function useSupabase () {
  return { supabase }
}
