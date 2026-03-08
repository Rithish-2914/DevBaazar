import { db } from "./db";
import { 
  users, projects, marketplaceItems, premiumContent,
  type User, type InsertUser, 
  type Project, type InsertProject,
  type MarketplaceItem, type InsertMarketplaceItem,
  type PremiumContent, type InsertPremiumContent
} from "@shared/schema";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCoins(id: number, coins: number): Promise<User>;

  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;

  getMarketplaceItems(): Promise<MarketplaceItem[]>;
  createMarketplaceItem(item: InsertMarketplaceItem): Promise<MarketplaceItem>;

  getPremiumContent(): Promise<PremiumContent[]>;
  createPremiumContent(content: InsertPremiumContent): Promise<PremiumContent>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserCoins(id: number, coins: number): Promise<User> {
    const [user] = await db.update(users).set({ coins }).where(eq(users.id, id)).returning();
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return await db.select().from(marketplaceItems);
  }

  async createMarketplaceItem(item: InsertMarketplaceItem): Promise<MarketplaceItem> {
    const [newItem] = await db.insert(marketplaceItems).values(item).returning();
    return newItem;
  }

  async getPremiumContent(): Promise<PremiumContent[]> {
    return await db.select().from(premiumContent);
  }

  async createPremiumContent(content: InsertPremiumContent): Promise<PremiumContent> {
    const [newContent] = await db.insert(premiumContent).values(content).returning();
    return newContent;
  }
}

export const storage = new DatabaseStorage();