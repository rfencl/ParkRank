import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVoteSchema, submitVoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all parks
  app.get("/api/parks", async (req, res) => {
    try {
      const parks = await storage.getAllParks();
      res.json(parks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parks" });
    }
  });

  // Get ranked parks
  app.get("/api/parks/rankings", async (req, res) => {
    try {
      const rankedParks = await storage.getRankedParks();
      res.json(rankedParks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rankings" });
    }
  });

  // Get random matchup
  app.get("/api/matchup", async (req, res) => {
    try {
      const matchup = await storage.getRandomMatchup();
      if (!matchup) {
        return res.status(404).json({ message: "No matchup available" });
      }
      res.json({ parkA: matchup[0], parkB: matchup[1] });
    } catch (error) {
      res.status(500).json({ message: "Failed to get matchup" });
    }
  });

  // Submit vote
  app.post("/api/vote", async (req, res) => {
    try {
      const voteData = submitVoteSchema.parse(req.body);
      
      // Calculate ELO changes
      const winner = await storage.getPark(voteData.winnerId);
      const loser = await storage.getPark(voteData.loserId);
      
      if (!winner || !loser) {
        return res.status(404).json({ message: "Park not found" });
      }

      // ELO calculation with K-factor of 32
      const K = 32;
      const expectedWinner = 1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400));
      const expectedLoser = 1 / (1 + Math.pow(10, (winner.elo - loser.elo) / 400));
      
      const winnerEloChange = Math.round(K * (1 - expectedWinner));
      const loserEloChange = Math.round(K * (0 - expectedLoser));
      
      const winnerNewElo = winner.elo + winnerEloChange;
      const loserNewElo = loser.elo + loserEloChange;

      // Update parks
      await storage.updatePark(voteData.winnerId, {
        elo: winnerNewElo,
        totalVotes: winner.totalVotes + 1,
        wins: winner.wins + 1
      });

      await storage.updatePark(voteData.loserId, {
        elo: loserNewElo,
        totalVotes: loser.totalVotes + 1,
        losses: loser.losses + 1
      });

      // Create vote record
      const vote = await storage.createVote({
        winnerId: voteData.winnerId,
        loserId: voteData.loserId,
        winnerEloChange,
        loserEloChange,
        winnerEloAfter: winnerNewElo,
        loserEloAfter: loserNewElo
      });

      res.json({
        vote,
        winnerEloChange,
        loserEloChange,
        winnerNewElo,
        loserNewElo
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vote data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit vote" });
    }
  });

  // Get recent votes
  app.get("/api/votes/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentVotes = await storage.getRecentVotes(limit);
      res.json(recentVotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent votes" });
    }
  });

  // Get statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const totalVotes = await storage.getTotalVotes();
      const votesToday = await storage.getVotesToday();
      const parks = await storage.getAllParks();
      const topElo = Math.max(...parks.map(p => p.elo));
      
      res.json({
        totalVotes,
        votesToday,
        activeParks: parks.length,
        topElo
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
