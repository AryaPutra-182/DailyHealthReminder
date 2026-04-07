import React, { useState } from "react";
import ListBlog from "../components/ListBlog";
import { 
  INITIAL_FEATURED_ARTICLE, 
  INITIAL_HABITS, 
  INITIAL_ARTICLES 
} from "../data/blogData";
import { PROFILE_DATA } from "../data/profile";

export default function Home() {
  const [userData] = useState(PROFILE_DATA);

  const [featuredArticle] = useState(INITIAL_FEATURED_ARTICLE);
  const [habits] = useState(INITIAL_HABITS);
  const [articles] = useState(INITIAL_ARTICLES);

  return (
    <ListBlog 
      userData={userData}
      featuredArticle={featuredArticle}
      habits={habits}
      articles={articles}
    />
  );
}
