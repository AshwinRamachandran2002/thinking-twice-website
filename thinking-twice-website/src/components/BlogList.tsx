import React from 'react';
import BlogPostCard from './BlogPostCard';
import blogPosts from '../data/blogPosts';

const BlogList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogPosts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogList;