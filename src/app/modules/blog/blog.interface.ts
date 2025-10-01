import { Document, Types } from "mongoose";

// Blog status enum
export enum BlogStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived"
}

// Blog category enum
export enum BlogCategory {
  TECHNOLOGY = "Technology",
  WEB_DEVELOPMENT = "Web Development",
  PROGRAMMING = "Programming",
  TUTORIAL = "Tutorial",
  PERSONAL = "Personal",
  OTHER = "Other"
}

// Main Blog interface (simplified)
export interface IBlog extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: Types.ObjectId;        // Reference to User model
  category: BlogCategory;
  tags: string[];               // Simple string array
  status: BlogStatus;
  isFeature: boolean;
  viewCount: number;
  commentCount: number;
  comments: IBlogComment[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Blog comment interface (anonymous commenting)
export interface IBlogComment {
  _id?: Types.ObjectId;
  author: string;               // Commenter name
  email: string;                // Commenter email
  website?: string;             // Optional website
  content: string;              // Comment text
  isApproved: boolean;          // Admin approval required
  createdAt: Date;
  updatedAt: Date;
}

// Create blog interface (Admin only)
export interface ICreateBlog {
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  status?: BlogStatus;          // Default: DRAFT
  isFeature?: boolean;          // Default: false
}

// Update blog interface (Admin only)
export interface IUpdateBlog {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: BlogCategory;
  tags?: string[];
  status?: BlogStatus;
  isFeature?: boolean;
}

// Comment creation interface (Public)
export interface ICreateComment {
  author: string;
  email: string;
  website?: string;
  content: string;
}

// Query interface for filtering blogs
export interface IBlogQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: BlogCategory;
  status?: BlogStatus;          // For admin filtering
  featured?: boolean;           // For public filtering
}