import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { ParkWithRank } from "@shared/schema";

interface Matchup {
  parkA: {
    id: string;
    name: string;
    location: string;
    description: string;
    imageUrl: string;
    elo: number;
    emoji: string;
  };
  parkB: {
    id: string;
    name: string;
    location: string;
    description: string;
    imageUrl: string;
    elo: number;
    emoji: string;
  };
}

export default function VotingInterface() {
  const { toast } = useToast();

  const { data: matchup, isLoading, refetch } = useQuery<Matchup>({
    queryKey: ['/api/matchup'],
    refetchOnWindowFocus: false,
  });

  const voteMutation = useMutation({
    mutationFn: async (vote: { winnerId: string; loserId: string }) => {
      const response = await apiRequest('POST', '/api/vote', vote);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Vote recorded!",
        description: `ELO updated: +${data.winnerEloChange} for winner, ${data.loserEloChange} for loser`,
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/matchup'] });
      queryClient.invalidateQueries({ queryKey: ['/api/parks/rankings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/votes/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVote = (winnerId: string, loserId: string) => {
    voteMutation.mutate({ winnerId, loserId });
  };

  const { data: rankings } = useQuery<ParkWithRank[]>({
    queryKey: ['/api/parks/rankings'],
  });

  const parkARank = rankings?.find(p => p.id === matchup?.parkA.id)?.rank;
  const parkBRank = rankings?.find(p => p.id === matchup?.parkB.id)?.rank;

  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Which park would you rather visit?</h2>
        <p className="text-center text-gray-600 mb-8">Help us rank the best National Parks by voting head-to-head</p>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
          <Skeleton className="w-full lg:w-80 h-96 rounded-2xl" />
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-2xl font-bold text-gray-700">VS</span>
            </div>
          </div>
          <Skeleton className="w-full lg:w-80 h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!matchup) {
    return (
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">No matchup available</h2>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Which park would you rather visit?</h2>
      <p className="text-center text-gray-600 mb-8">Help us rank the best National Parks by voting head-to-head</p>
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
        {/* Park A Card */}
        <Card className="w-full lg:w-80 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="relative">
          <img 
            src={matchup.parkA.imageUrl} 
            alt={`${matchup.parkA.name} National Park`}
            className="w-full h-48 object-cover"
          />
         {parkARank && (
            <span className="absolute top-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-lg shadow">
              rank #{parkARank}
            </span>
            )}
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>{matchup.parkA.emoji}</span>
              {matchup.parkA.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{matchup.parkA.location}</p>
            <p className="text-xs text-gray-500 mb-4">{matchup.parkA.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Current ELO</span>
              <span className="text-lg font-bold text-blue-600">{matchup.parkA.elo}</span>
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              onClick={() => handleVote(matchup.parkA.id, matchup.parkB.id)}
              disabled={voteMutation.isPending}
            >
              Vote for {matchup.parkA.name}
            </Button>
          </CardContent>
        </Card>

        {/* VS Element */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-2xl font-bold text-gray-700">VS</span>
          </div>
        </div>

        {/* Park B Card */}
        <Card className="w-full lg:w-80 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="relative">
          <img 
            src={matchup.parkB.imageUrl}
            alt={`${matchup.parkB.name} National Park`}
            className="w-full h-48 object-cover"
          />
          {parkBRank && (
            <span className="absolute top-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-lg shadow">
              rank #{parkBRank}
            </span>
            )}   
          </div>  
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>{matchup.parkB.emoji}</span>
              {matchup.parkB.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{matchup.parkB.location}</p>
            <p className="text-xs text-gray-500 mb-4">{matchup.parkB.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Current ELO</span>
              <span className="text-lg font-bold text-blue-600">{matchup.parkB.elo}</span>
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              onClick={() => handleVote(matchup.parkB.id, matchup.parkA.id)}
              disabled={voteMutation.isPending}
            >
              Vote for {matchup.parkB.name}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Skip Button */}
      <div className="text-center mt-6">
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          disabled={voteMutation.isPending}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
        >
          Skip this matchup →
        </Button>
      </div>
    </div>
  );
}
