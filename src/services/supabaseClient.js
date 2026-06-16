import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wmwdfyzwqqlemzebwkmr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PspBUzDiZn-dDmuzstlj4g_6ZsW8yEZ";

// SecureStore hanya mendukung max 2048 karakter per item.
// JWT Supabase bisa melebihi batas ini, jadi kita pakai chunking.
const CHUNK_SIZE = 1800;

const ChunkedSecureStore = {
  // Simpan value dengan cara memecahnya menjadi beberapa chunk
  setItem: async (key, value) => {
    const chunks = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) {
      chunks.push(value.slice(i, i + CHUNK_SIZE));
    }
    // Simpan jumlah chunk, lalu simpan setiap chunk
    await SecureStore.setItemAsync(`${key}_count`, String(chunks.length));
    await Promise.all(
      chunks.map((chunk, i) => SecureStore.setItemAsync(`${key}_${i}`, chunk))
    );
  },

   

  // Ambil value dengan menggabungkan semua chunk
  getItem: async (key) => {
    const countStr = await SecureStore.getItemAsync(`${key}_count`);
    if (!countStr) return null;
    const count = parseInt(countStr, 10);
    const chunks = await Promise.all(
      Array.from({ length: count }, (_, i) =>
        SecureStore.getItemAsync(`${key}_${i}`)
      )
    );
    return chunks.join("");
  },

  // Hapus semua chunk milik key ini
  removeItem: async (key) => {
    const countStr = await SecureStore.getItemAsync(`${key}_count`);
    if (!countStr) return;
    const count = parseInt(countStr, 10);
    await Promise.all([
      SecureStore.deleteItemAsync(`${key}_count`),
      ...Array.from({ length: count }, (_, i) =>
        SecureStore.deleteItemAsync(`${key}_${i}`)
      ),
    ]);
  },
};

// Inisialisasi Supabase client dengan SecureStore sebagai session storage
// agar session pengguna tetap tersimpan saat app ditutup/dibuka kembali
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ChunkedSecureStore,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
