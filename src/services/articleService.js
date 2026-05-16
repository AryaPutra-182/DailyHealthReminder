

const BASE_URL = "https://6a0441eb2afe8349b4b63c3c.mockapi.io";
const ARTICLES_ENDPOINT = `${BASE_URL}/articles`;

/**
 * Mengambil semua artikel dari MockAPI
 * @returns {Promise<Array>} array of article objects
 */
export async function getArticles() {
  try {
    const response = await fetch(ARTICLES_ENDPOINT);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[articleService] getArticles error:", error);
    throw error;
  }
}

/**
 * Menambahkan artikel baru ke MockAPI (HTTP POST)
 * @param {{ title: string, category: string, readTime: string, image: string, description: string }} articleData
 * @returns {Promise<Object>} artikel yang baru dibuat (termasuk id dari server)
 */
export async function createArticle(articleData) {
  try {
    const response = await fetch(ARTICLES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articleData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[articleService] createArticle error:", error);
    throw error;
  }
}

/**
 * Mengupdate artikel berdasarkan id di MockAPI (HTTP PUT)
 * @param {string|number} id - id artikel yang akan diupdate
 * @param {{ title: string, category: string, readTime: string, image: string, description: string }} articleData
 * @returns {Promise<Object>} artikel yang sudah diperbarui
 */
export async function updateArticle(id, articleData) {
  try {
    const response = await fetch(`${ARTICLES_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articleData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[articleService] updateArticle error:", error);
    throw error;
  }
}

/**
 * Menghapus artikel berdasarkan id dari MockAPI (HTTP DELETE)
 * @param {string|number} id - id artikel yang akan dihapus
 * @returns {Promise<Object>} respon dari server
 */
export async function deleteArticle(id) {
  try {
    const response = await fetch(`${ARTICLES_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[articleService] deleteArticle error:", error);
    throw error;
  }
}
