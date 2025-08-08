import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ParkWithRank } from "@shared/schema";

export default function ParksGrid() {
  const [sortBy, setSortBy] = useState<'rank' | 'name'>('rank');
  const [showCount, setShowCount] = useState(16);

  const { data: parks, isLoading } = useQuery<ParkWithRank[]>({
    queryKey: ['/api/parks/rankings'],
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">All National Parks</h3>
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 16 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-40" />
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-5 w-8" />
                </div>
                <Skeleton className="h-4 w-16 mb-2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!parks || parks.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No parks available</h3>
        <p className="text-gray-600">There was an error loading the national parks data.</p>
      </div>
    );
  }

  const sortedParks = [...parks].sort((a, b) => {
    if (sortBy === 'rank') {
      return a.rank - b.rank;
    }
    return a.name.localeCompare(b.name);
  });

  const displayedParks = sortedParks.slice(0, showCount);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">All National Parks</h3>
        <div className="flex space-x-4">
          <Button
            variant={sortBy === 'rank' ? 'default' : 'outline'}
            onClick={() => setSortBy('rank')}
            className="px-4 py-2"
          >
            Sort by Rank
          </Button>
          <Button
            variant={sortBy === 'name' ? 'default' : 'outline'}
            onClick={() => setSortBy('name')}
            className="px-4 py-2"
          >
            Sort by Name
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedParks.map((park) => (
          <Card key={park.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img 
              src={park.imageUrl}
              alt={`${park.name} National Park`}
              className="w-full h-40 object-cover"
            />
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span>{park.emoji}</span>
                  {park.name}
                </h4>
                <span className="text-sm font-medium text-blue-600">#{park.rank}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{park.location}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">ELO Score</span>
                <span className="text-lg font-bold text-gray-900">{park.elo}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCount < parks.length && (
        <div className="mt-8 text-center">
          <Button 
            onClick={() => setShowCount(prev => prev + 16)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            Load More Parks ({parks.length - showCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
