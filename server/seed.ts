import { storage } from "./storage";

async function seed() {
  const users = await storage.getProjects(); 
  
  const user1 = await storage.createUser({
    username: "john_doe",
    password: "password123",
    name: "John Doe",
    domain: "Software Engineering",
    skills: "React, Node.js, TypeScript",
    linkedin: "https://linkedin.com/in/johndoe",
    instagram: "@johndoe_dev"
  });

  const user2 = await storage.createUser({
    username: "jane_smith",
    password: "password123",
    name: "Jane Smith",
    domain: "UI/UX Design",
    skills: "Figma, Illustrator, CSS",
    linkedin: "https://linkedin.com/in/janesmith",
    instagram: "@jane_designs"
  });

  await storage.updateUserCoins(user1.id, 500);
  await storage.updateUserCoins(user2.id, 300);

  await storage.createProject({
    title: "Eco-friendly Habits Tracker",
    description: "Looking for frontend developers to help build a mobile-first web app that tracks daily eco-friendly habits and awards points.",
    authorId: user1.id,
    isOpen: true
  });

  await storage.createProject({
    title: "AI Study Assistant",
    description: "Seeking a designer and a backend dev to create an AI tool that summarizes lecture notes.",
    authorId: user2.id,
    isOpen: true
  });

  await storage.createMarketplaceItem({
    title: "Used Monitor 24 inch",
    description: "Selling my old 1080p monitor. Great condition. DM me on Instagram to buy.",
    type: "sale",
    authorId: user1.id
  });

  await storage.createMarketplaceItem({
    title: "Seeking study partner for Algorithms",
    description: "Looking for someone to study algorithms with twice a week.",
    type: "seeking",
    authorId: user2.id
  });

  await storage.createPremiumContent({
    title: "Intro to System Design",
    description: "A comprehensive guide on basic system design concepts for interviews.",
    content: "System design is the process of defining the architecture, modules, interfaces, and data for a system to satisfy specified requirements...",
    cost: 50,
    authorId: user1.id
  });

  console.log("Database seeded successfully!");
}

seed().catch(console.error).finally(() => process.exit(0));