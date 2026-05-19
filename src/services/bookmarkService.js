import * as FileSystem from 'expo-file-system/legacy';

const FILE_URI = FileSystem.documentDirectory + 'bookmarks.json';

export async function getBookmarks() {
  try {
    const fileInfo = await FileSystem.getInfoAsync(FILE_URI);
    if (!fileInfo.exists) {
      return [];
    }
    const content = await FileSystem.readAsStringAsync(FILE_URI);
    return JSON.parse(content) || [];
  } catch (err) {
    console.error("Gagal membaca bookmarks:", err);
    return [];
  }
}

export async function toggleBookmark(article) {
  try {
    const currentBookmarks = await getBookmarks();
    const index = currentBookmarks.findIndex(b => b.title === article.title);
    let newBookmarks = [];
    
    if (index >= 0) {
      // Hapus jika sudah ada
      newBookmarks = currentBookmarks.filter(b => b.title !== article.title);
    } else {
      // Tambah jika belum ada
      newBookmarks = [article, ...currentBookmarks];
    }
    
    await FileSystem.writeAsStringAsync(FILE_URI, JSON.stringify(newBookmarks));
    return newBookmarks;
  } catch (err) {
    console.error("Gagal menyimpan bookmark:", err);
    throw err;
  }
}

export async function isBookmarked(articleTitle) {
  const bookmarks = await getBookmarks();
  return bookmarks.some(b => b.title === articleTitle);
}
