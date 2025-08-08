import { ref } from 'vue'
import useSupabase from 'boot/supabase'
import useNotify from 'src/composables/UseNotify'
import {translateSupabaseError} from 'src/utils/translateSupabaseError.ts'
// user is set outside of the useAuthUser function
// so that it will act as global state and always refer to a single user

// o usuário é definido fora da função useAuthUser para que atue como um estado global
// e sempre se refira a um único usuário
const user = ref(null)
    const { notifyError } = useNotify()
export default function useAuthUser() {
  const { supabase } = useSupabase()
  /**
   * Login with email and password
   */

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data.user
  }

  // original  const login = async ({ email, password }) => {
  //    const { user, error } = await supabase.auth.signIn({ email, password })
  //    if (error) throw error
  //    return user
  //  }

  /**
   * Login with google, github, etc
   */
  const loginWithSocialProvider = async (provider) => {
    const { user, error } = await supabase.auth.signIn({ provider })
    if (error) throw error
    return user
  }

  /**
   * Logout
   */
  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  /**
   * Check if the user is logged in or not
   */
  const isLoggedIn = () => {
    return !!user.value
  }


  /**
   * Register
   */


  const register = async ({ email, password, ...meta }) => {
    const { user, error } = await supabase.auth.signUp(
      { email, password },
      {
        data: meta,
        emailRedirectTo: `${window.location.origin}/me?fromEmail=registrationConfirmation`,
     //   redirectTo: `${window.location.origin}/me?fromEmail=registrationConfirmation`,
      },
    )
    if (error) {
    const friendlyMessage = translateSupabaseError(error)
    notifyError.create({
      type: 'negative',
      message: friendlyMessage,
      position: 'top',
    })
    throw new Error('Erro ao registrar suaário')
  }


    if (error) throw error
    return user
  }





  /**
   * Update user email, password, or meta data
   */
  const update = async (data) => {
    const { user, error } = await supabase.auth.update(data)
    if (error) throw error
    return user
  }

  /**
   * Send user an email to reset their password
   * (ie. support "Forgot Password?")
   */
  const sendPasswordRestEmail = async (email) => {
    const { user, error } = await supabase.auth.api.resetPasswordForEmail(email)
    if (error) throw error
    return user
  }

  const resetPassword = async (accessToken, newPassword) => {
    const { user, error } = await supabase.auth.api.updateUser(accessToken, {
      password: newPassword,
    })
    if (error) throw error
    return user
  }

  return {
    user,
    login,
    loginWithSocialProvider,
    isLoggedIn,
    logout,
    register,
    update,
    sendPasswordRestEmail,
    resetPassword,
    // maybeHandleEmailConfirmation,
  }
}
