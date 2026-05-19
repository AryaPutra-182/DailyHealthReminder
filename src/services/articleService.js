import { supabase } from "./supabaseClient";

// Nama tabel dan bucket di Supabase
const TABLE = "articles";
const BUCKET = "article-images";

/**
 * Mengambil semua artikel dari Supabase, diurutkan dari terbaru
 * @returns {Promise<Array>} array of article objects
 */
export async function getArticles() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[articleService] getArticles error:", error.message);
    throw new Error(error.message);
  }
  return data;
}

// Implementasi Native Decode Base64 → ArrayBuffer yang super cepat & akurat
// Supabase membutuhkan ArrayBuffer untuk file biner agar gambar tidak rusak (corrupted)
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}

function decodeBase64(base64) {
  let bufferLength = base64.length * 0.75;
  let len = base64.length;
  let p = 0;

  if (base64[base64.length - 1] === "=") {
    bufferLength--;
    if (base64[base64.length - 2] === "=") {
      bufferLength--;
    }
  }

  const arraybuffer = new ArrayBuffer(bufferLength);
  const bytes = new Uint8Array(arraybuffer);

  for (let i = 0; i < len; i += 4) {
    let encoded1 = lookup[base64.charCodeAt(i)];
    let encoded2 = lookup[base64.charCodeAt(i + 1)];
    let encoded3 = lookup[base64.charCodeAt(i + 2)];
    let encoded4 = lookup[base64.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return arraybuffer;
}

/**
 * Upload gambar artikel ke Supabase Storage
 * @param {string} uri - local URI file gambar
 * @param {string} base64String - base64 gambar
 * @returns {Promise<string>} public URL gambar yang sudah diupload
 */
export async function uploadArticleImage(uri, base64String) {
  if (!base64String) throw new Error("Base64 string is missing");

  // Buat nama file unik berdasarkan timestamp
  const ext = uri.split(".").pop()?.split("?")[0]?.toLowerCase() || "jpg";
  const filename = `article_${Date.now()}.${ext}`;
  const contentType = `image/${ext === "jpg" ? "jpeg" : ext}`;

  // Supabase di React Native mewajibkan konversi ke ArrayBuffer
  // Fungsi decodeBase64 ini mencegah gambar dari korupsi (corrupted file)
  const fileBody = decodeBase64(base64String);

  // Upload ke Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, fileBody, {
      contentType,
      upsert: false,
    });

  if (error) {
    console.error("[articleService] uploadArticleImage error:", error.message);
    throw new Error(error.message);
  }

  // Ambil public URL gambar yang sudah diupload
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Menambahkan artikel baru ke Supabase (INSERT)
 * @param {{ title, category, read_time, image_url, description }} articleData
 * @returns {Promise<Object>} artikel yang baru dibuat
 */
export async function createArticle(articleData) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([articleData])
    .select()
    .single();

  if (error) {
    console.error("[articleService] createArticle error:", error.message);
    throw new Error(error.message);
  }
  return data;
}

/**
 * Mengupdate artikel berdasarkan id di Supabase (UPDATE)
 * @param {string} id - UUID artikel yang akan diupdate
 * @param {{ title, category, read_time, image_url, description }} articleData
 * @returns {Promise<Object>} artikel yang sudah diperbarui
 */
export async function updateArticle(id, articleData) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(articleData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[articleService] updateArticle error:", error.message);
    throw new Error(error.message);
  }
  return data;
}

/**
 * Menghapus artikel berdasarkan id dari Supabase (DELETE)
 * @param {string} id - UUID artikel yang akan dihapus
 * @returns {Promise<void>}
 */
export async function deleteArticle(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[articleService] deleteArticle error:", error.message);
    throw new Error(error.message);
  }
}
