import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-50 animate-fadeInSlide">
      <h1 className="text-5xl font-bold text-gray-800 mb-6 text-center">
        Nonso Nkire's Fabulous Movie Searching Website
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        I hope you find the movie you're after!
      </p>
      <Link
        to="/movies"
        className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
        Explore Movies
      </Link>
    </div>
  );
}

export default Home;

