import React from 'react';
import BlogList from '../components/BlogList';

const BlogPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Our Blog</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Stay updated with our latest insights, articles, and news.
      </p>
      <BlogList />
    </div>
  );
};

export default BlogPage;