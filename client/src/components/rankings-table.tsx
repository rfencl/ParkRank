import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { ParkWithRank } from "@shared/schema";

export default function RankingsTable() {
  const { data: rankings, isLoading } = useQuery<ParkWithRank[]>({
    queryKey: ['/api/parks/rankings'],
  });

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800";
    if (rank <= 3) return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <Badge className="bg-green-100 text-green-800">
          ↑ {change}
        </Badge>
      );
    }
    if (change < 0) {
      return (
        <Badge className="bg-red-100 text-red-800">
          ↓ {Math.abs(change)}
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-800">
        — 0
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">rankings</h3>
        </div>
        <CardContent className="p-0">
          <div className="space-y-4 p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rankings || rankings.length === 0) {
    return (
      <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">rankings</h3>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">No rankings available yet.</p>
        </CardContent>
      </Card>
    );
  }

  const topRankings = rankings.slice(0, 10);

  return (
    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">rankings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Park</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topRankings.map((park) => (
              <tr key={park.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full ${getRankBadgeColor(park.rank)}`}>
                    {park.rank}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{park.emoji}</span>
                    <span className="text-sm font-medium text-gray-900">{park.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {park.elo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getChangeIndicator(park.change)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View all {rankings.length} parks →
        </Button>
      </div>
    </Card>
  );
}
