// src/composables/UseAuthUser.js
import { ref, onMounted, onBeforeUnmount } from 'vue'
import useSupabase, { onAuthStateChange } from 'boot/supabase' // ✅ chame useSupabase()
import useNotify from 'src/composables/UseNotify'
import { translateSupabaseError } from 'src/utils/translateSupabaseError' // sem .ts

// estado compartilhado
const user = ref(null)

export default function useAuthUser () {
  const { notifyError } = useNotify()
  const { supabase } = useSupabase() // ✅ pegue o client aqui
  let off = null

  // sanity-check para evitar o erro silencioso
  function assertSupabaseAuth () {
    if (!supabase || !supabase.auth || typeof supabase.auth.updateUser !== 'function') {
      // dicas úteis pro dev:
      // - confira se SUPABASE_URL/KEY estão definidas no build
      // - confira se o import é "useSupabase()" (com parênteses)
      // - evite importar "supabase" default (que é a função) por engano
      throw new Error('[UseAuthUser] Supabase auth client não inicializado')
    }
  }

  onMounted(async () => {
    assertSupabaseAuth()
    try {
      const { data, error } = await supabase.auth.getUser()
      if (!error) user.value = data.user || null
    } catch (_) {
      /* ignore */
    }
    off = onAuthStateChange((_event, session) => {
      user.value = session?.user || null
    })
  })

  onBeforeUnmount(() => {
    if (typeof off === 'function') {
      off()
      off = null
    }
  })

  // --- login email/senha ---
  async function login ({ email, password }) {
    assertSupabaseAuth()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  }

  // --- login social (OAuth) ---
  async function loginWithSocialProvider (provider) {
    assertSupabaseAuth()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/me` }
    })
    if (error) throw error
    return data
  }

  // --- logout ---
  async function logout () {
    assertSupabaseAuth()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // --- checar login rapidamente ---
  function isLoggedIn () {
    return !!user.value
  }

  // --- registrar ---
  async function register ({ email, password, ...meta }) {
    assertSupabaseAuth()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: meta,
        emailRedirectTo: `${window.location.origin}/me?fromEmail=registrationConfirmation`
      }
    })
    if (error) {
      const friendly = translateSupabaseError(error)
      notifyError(friendly)
      throw new Error('Erro ao registrar usuário')
    }
    return data.user
  }

  // --- atualizar dados do usuário (email/senha/metadata) ---
  async function update (payload) {
    assertSupabaseAuth()
    const { data, error } = await supabase.auth.updateUser(payload)
    if (error) throw error
    return data.user
  }

  // --- enviar email de reset de senha (etapa 1) ---
  async function sendPasswordResetEmail (email) {
    assertSupabaseAuth()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
    return true
  }

  // --- definir nova senha após clicar no link (etapa 2) ---
  async function resetPassword (newPassword) {
    assertSupabaseAuth()
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    return data.user
  }

  return {
    user,
    isLoggedIn,
    login,
    loginWithSocialProvider,
    logout,
    register,
    update,
    sendPasswordResetEmail,
    resetPassword
  }
}
