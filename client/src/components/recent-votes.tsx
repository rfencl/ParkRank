import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTimeAgo } from "@/lib/elo";
import type { VoteWithParks } from "@shared/schema";

interface StatsData {
  totalVotes: number;
  votesToday: number;
  activeParks: number;
  topElo: number;
}

export default function RecentVotes() {
  const { data: recentVotes, isLoading: votesLoading } = useQuery<VoteWithParks[]>({
    queryKey: ['/api/votes/recent'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<StatsData>({
    queryKey: ['/api/stats'],
  });

  return (
    <div className="space-y-6">
      {/* Recent Votes Card */}
      <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Recent Votes</h3>
        </div>
        <CardContent className="p-0">
          {votesLoading ? (
            <div className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-3 w-16 mt-1" />
                </div>
              ))}
            </div>
          ) : !recentVotes || recentVotes.length === 0 ? (
            <div className="px-6 py-4">
              <p className="text-gray-500 text-center">No votes yet. Be the first to vote!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentVotes.map((vote) => (
                <div key={vote.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">{vote.winnerName}</span>
                      <span className="text-gray-400">beat</span>
                      <span className="text-sm text-gray-600">{vote.loserName}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(new Date(vote.createdAt))}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {vote.winnerEloChange > 0 ? '+' : ''}{vote.winnerEloChange} ELO
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Statistics</h3>
        </div>
        <CardContent className="p-6">
          {statsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : !stats ? (
            <p className="text-gray-500 text-center">Failed to load statistics</p>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Votes</span>
                <span className="text-lg font-bold text-gray-900">{stats.totalVotes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Parks</span>
                <span className="text-lg font-bold text-gray-900">{stats.activeParks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Votes Today</span>
                <span className="text-lg font-bold text-green-600">{stats.votesToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Top Park ELO</span>
                <span className="text-lg font-bold text-blue-600">{stats.topElo}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
