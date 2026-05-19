import { supabase } from "./supabaseClient";

/**
 * Mendaftarkan pengguna baru menggunakan Supabase Auth
 * @param {string} email
 * @param {string} password
 * @param {string} fullName - disimpan ke user_metadata
 * @returns {Promise<{ user, session }>}
 */
export async function registerUser(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Login pengguna menggunakan email dan password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user, session }>}
 */
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Logout pengguna yang sedang login
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/**
 * Mengambil data sesi pengguna yang sedang aktif
 * @returns {Promise<{ session } | null>}
 */
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

/**
 * Mengambil data user yang sedang login
 * @returns {Promise<User | null>}
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
