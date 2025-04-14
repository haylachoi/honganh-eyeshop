import React, { Suspense } from "react";
import Hero from "./_components/hero";
import Trending from "./_components/trending";
import Featured from "./_components/featured";
import NewArrival from "./_components/new-arrival";
import RecentBlog from "./_components/recent-blogs";

const sections = [Hero, Trending, Featured, NewArrival, RecentBlog];

const HomePage = () => {
  return (
    <div className="space-y-12">
      {sections.map((Section, index) => (
        <Suspense key={index} fallback={<div>Loading...</div>}>
          <Section />
        </Suspense>
      ))}
    </div>
  );
};

export default HomePage;
