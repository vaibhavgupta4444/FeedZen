'use client'

import React from "react";
import Image from "next/image";

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div className="p-6 border border-black rounded-lg hover:bg-black hover:text-white transition duration-300">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm">{description}</p>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white text-black font-sans">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-24 gap-12 bg-white text-black">
        {/* Left Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Speak Freely,<br />Stay Anonymous.
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-lg">
            FeedZen lets you collect genuine feedback from peers, teams, or users without revealing their identity.
          </p>
          <a
            href="/sign-up"
            className="border border-black text-black px-6 py-3 rounded-full font-medium hover:bg-black hover:text-white transition"
          >
            Get Started
          </a>
          <div className="mt-6 text-sm text-gray-600">
            No login required | Safe & Secure | Instant Sharing
          </div>
        </div>

        {/* Right Side Illustration */}
        <div className="flex-1 flex justify-center relative w-full max-w-md h-[400px]">
          <Image
            src="/image.jpg"
            alt="People in discussion, blurred black and white"
            className="rounded-lg shadow-lg filter grayscale object-cover"
            fill
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">What Makes FeedZen Different?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            title="100% Anonymous"
            description="Feedback is always private — no names, no tracking."
          />
          <FeatureCard
            title="Instant Setup"
            description="Share your feedback form with a link. No complex steps."
          />
          <FeatureCard
            title="Clean & Minimal"
            description="A distraction-free interface focused on honest input."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-200">
        <p className="text-sm">&copy; {new Date().getFullYear()} FeedZen by Vaibhav. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;