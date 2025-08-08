import { useState } from "react";
import VotingInterface from "@/components/voting-interface";
import RankingsTable from "@/components/rankings-table";
import RecentVotes from "@/components/recent-votes";
import ParksGrid from "@/components/parks-grid";

export default function Home() {
  const [showAllParks, setShowAllParks] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">nps rank</h1>
              <span className="ml-3 text-sm text-gray-500">National Parks Voting & Rankings</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setShowAllParks(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Rankings
              </button>
              <button 
                onClick={() => setShowAllParks(false)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Vote
              </button>
              <button 
                onClick={() => setShowAllParks(true)}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                All Parks
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAllParks ? (
          <ParksGrid />
        ) : (
          <>
            {/* Voting Interface */}
            <VotingInterface />

            {/* Rankings and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RankingsTable />
              </div>
              <div className="lg:col-span-1">
                <RecentVotes />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-bold text-gray-900">nps rank</h4>
              <p className="text-sm text-gray-600">Helping you discover America's best National Parks</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Methodology</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">API</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Contact</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">Data from National Park Service. Rankings based on community voting using ELO rating system.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
