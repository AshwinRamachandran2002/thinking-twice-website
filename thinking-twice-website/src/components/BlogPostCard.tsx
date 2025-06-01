import React from 'react';
import { Link } from 'react-router-dom';

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  slug: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ title, excerpt, slug }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-xl font-semibold mb-2">
        <Link to={`/blog/${slug}`} className="text-blue-600 hover:underline">
          {title}
        </Link>
      </h2>
      <p className="text-gray-700">{excerpt}</p>
      <Link to={`/blog/${slug}`} className="text-blue-600 hover:underline mt-2 block">
        Read more
      </Link>
    </div>
  );
};

export default BlogPostCard;