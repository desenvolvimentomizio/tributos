// src/boot/auth-hash.ts
import { boot } from 'quasar/wrappers'
import useSupabase from 'src/boot/supabase'

function readHashParams () {
  // remove "#", "#/" do início
  const raw = window.location.hash.replace(/^#\/?/, '')
  const p = new URLSearchParams(raw)
  return {
    access_token: p.get('access_token') ?? '',
    refresh_token: p.get('refresh_token') ?? ''
  }
}




function normalizeSupabaseHash () {
  // Corrige "#/access_token=..." -> "#access_token=..."
  if (window.location.hash.startsWith('#/access_token=')) {
    const fixed = window.location.hash.replace('#/access_token=', '#access_token=')
    // preserva pathname + search (se houver) e aplica o hash corrigido
    history.replaceState(null, '', window.location.pathname + window.location.search + fixed)
  }
}



export default boot(async () => {
  const { supabase } = useSupabase()

  // Supabase manda tokens no fragmento (#...), mesmo usando history mode
  const { access_token, refresh_token } = readHashParams()

  if (access_token && refresh_token) {
    try {
      await supabase.auth.setSession({ access_token, refresh_token })
    } finally {
      // limpa o hash da URL para não poluir
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }
})



