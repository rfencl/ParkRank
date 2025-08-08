import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const parks = pgTable("parks", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  elo: integer("elo").notNull().default(1500),
  totalVotes: integer("total_votes").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  dateEstablished: text("date_established"),
  area: text("area"),
  visitors: text("visitors"),
  emoji: text("emoji").notNull().default("🏞️"),
});

export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  winnerId: varchar("winner_id").references(() => parks.id).notNull(),
  loserId: varchar("loser_id").references(() => parks.id).notNull(),
  winnerEloChange: integer("winner_elo_change").notNull(),
  loserEloChange: integer("loser_elo_change").notNull(),
  winnerEloAfter: integer("winner_elo_after").notNull(),
  loserEloAfter: integer("loser_elo_after").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertParkSchema = createInsertSchema(parks).omit({
  totalVotes: true,
  wins: true, 
  losses: true,
});

// Simple vote schema for frontend submissions (just winner and loser)
export const submitVoteSchema = z.object({
  winnerId: z.string(),
  loserId: z.string(),
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

export type InsertPark = z.infer<typeof insertParkSchema>;
export type Park = typeof parks.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;

export interface ParkWithRank extends Park {
  rank: number;
  change: number;
}

export interface VoteWithParks extends Vote {
  winnerName: string;
  loserName: string;
}
