import React from 'react';
import BlogList from '../components/BlogList';
import TeamSection from '../components/TeamSection';

const IndexPage = () => {
  return (
    <div className="container mx-auto px-4">
      <header className="text-center my-10">
        <h1 className="text-4xl font-bold">Welcome to Our Website</h1>
        <p className="text-lg text-gray-600 mt-2">Your one-stop solution for all your needs.</p>
      </header>

      <section className="my-10">
        <h2 className="text-3xl font-semibold text-center">Solutions</h2>
        <p className="text-gray-700 text-center mt-4">
          We offer a variety of solutions tailored to meet your specific requirements. Our team of experts is dedicated to providing you with the best service possible.
        </p>
      </section>

      <section className="my-10">
        <h2 className="text-3xl font-semibold text-center">Problem</h2>
        <p className="text-gray-700 text-center mt-4">
          Are you facing challenges in your business? We understand the complexities and are here to help you navigate through them with our innovative solutions.
        </p>
      </section>

      <section className="my-10">
        <h2 className="text-3xl font-semibold text-center">Latest Blog Posts</h2>
        <BlogList />
      </section>

      <section className="my-10">
        <h2 className="text-3xl font-semibold text-center">Meet Our Team</h2>
        <TeamSection />
      </section>
    </div>
  );
};

export default IndexPage;