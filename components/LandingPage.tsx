/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { EraserIcon, LandscapeIcon, SunIcon } from './icons';

interface LandingPageProps {
  onLaunchApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  return (
    <div className="w-full max-w-6xl mx-auto text-center p-4 md:p-8 animate-fade-in">
      {/* Hero Section */}
      <section className="py-16 md:py-20">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-100 sm:text-6xl md:text-7xl">
          AIEnhance
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300 md:text-xl">
          Instantly Enhance & Edit Photos with AI
        </p>
        <div className="mt-10">
          <button
            onClick={onLaunchApp}
            className="px-10 py-5 text-xl font-bold text-white bg-blue-600 rounded-full cursor-pointer group hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50"
          >
            Launch App
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black/20 p-8 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-6">
              <EraserIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100">Remove objects</h3>
            <p className="mt-2 text-gray-400">Erase unwanted people, objects, or blemishes from your photos with a simple click.</p>
          </div>
          <div className="bg-black/20 p-8 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-6">
              <LandscapeIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100">Change backgrounds</h3>
            <p className="mt-2 text-gray-400">Transport your subjects anywhere by replacing the background with a text description.</p>
          </div>
          <div className="bg-black/20 p-8 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-6">
              <SunIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100">One‑click photo enhancements</h3>
            <p className="mt-2 text-gray-400">Apply professional adjustments and artistic filters to instantly improve your images.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20">
        <h2 className="text-4xl font-bold tracking-tight text-gray-100 mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto text-left space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-100">What is AIEnhance?</h3>
            <p className="mt-2 text-gray-400">AIEnhance is an AI-powered photo editor that lets you instantly enhance, remove objects, and improve your photos.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-100">Is AIEnhance free?</h3>
            <p className="mt-2 text-gray-400">Yes, there is a free tier with limited daily usage. Paid plans are coming soon.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-100">Do I need Photoshop?</h3>
            <p className="mt-2 text-gray-400">No. AIEnhance works in the browser with no downloads required.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <h2 className="text-4xl font-bold tracking-tight text-gray-100">Ready to Create?</h2>
        <div className="mt-8">
          <button
            onClick={onLaunchApp}
            className="px-10 py-5 text-xl font-bold text-white bg-blue-600 rounded-full cursor-pointer group hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50"
          >
            Launch App
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;