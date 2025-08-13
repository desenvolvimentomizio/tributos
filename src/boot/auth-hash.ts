import { boot } from 'quasar/wrappers'
import useSupabase from 'src/boot/supabase' // importa o composable (default)

function normalizeSupabaseHash () {
  // Corrige "#/access_token=..." -> "#access_token=..."
  if (window.location.hash.startsWith('#/access_token=')) {
    const fixed = window.location.hash.replace('#/access_token=', '#access_token=')
    // preserva pathname + search (se houver) e aplica o hash corrigido
    history.replaceState(null, '', window.location.pathname + window.location.search + fixed)
  }
}

function readHashParams () {
  // remove '#' ou '#/' do início
  const raw = window.location.hash.replace(/^#\/?/, '')
  const p = new URLSearchParams(raw)
  return {
    access_token: p.get('access_token'),
    refresh_token: p.get('refresh_token'),
    type: p.get('type')
  }
}

export default boot(async () => {
  // Evita rodar no SSR
  if (typeof window === 'undefined') return

  // pega o cliente pelo composable default
  const { supabase } = useSupabase()

  try {
    normalizeSupabaseHash()

    const { access_token, refresh_token } = readHashParams()
    if (access_token && refresh_token) {
      await supabase.auth.setSession({ access_token, refresh_token })
    }
  } catch (e) {
    console.warn('auth-hash boot error:', e)
  }
})
