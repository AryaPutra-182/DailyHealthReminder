import React, { useState } from "react";
import ListBlog from "../components/ListBlog";
import { 
  INITIAL_FEATURED_ARTICLE, 
  INITIAL_HABITS, 
  INITIAL_ARTICLES 
} from "../data/blogData";
import { PROFILE_DATA } from "../data/profile";

// Screen Home: Menampilkan halaman utama aplikasi kesehatan
export default function Home() {
  // Inisialisasi state untuk data profil pengguna
  const [userData] = useState(PROFILE_DATA);

  // Inisialisasi state untuk artikel utama, kebiasaan, dan daftar artikel
  const [featuredArticle] = useState(INITIAL_FEATURED_ARTICLE);
  const [habits] = useState(INITIAL_HABITS);
  const [articles] = useState(INITIAL_ARTICLES);

  return (
    // Merender komponen ListBlog dengan data yang sudah diinisialisasi
    <ListBlog 
      userData={userData}
      featuredArticle={featuredArticle}
      habits={habits}
      articles={articles}
    />
  );
}

