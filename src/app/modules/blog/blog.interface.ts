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
  MOBILE_DEVELOPMENT = "Mobile Development",
  PROGRAMMING = "Programming",
  TUTORIAL = "Tutorial",
  PERSONAL = "Personal",
  CAREER = "Career",
  TOOLS = "Tools",
  REVIEW = "Review",
  OTHER = "Other"
}

// Blog tag interface
export interface IBlogTag {
  name: string;
  slug: string;
  color?: string;
}

// Blog comment interface (anonymous commenting)
export interface IBlogComment {
  _id?: Types.ObjectId;
  author: string;        // Name provided by commenter
  email: string;         // Email provided by commenter
  website?: string;      // Optional website URL
  content: string;       // Comment text
  isApproved: boolean;   // Admin approval required
  ipAddress?: string;    // Track IP for moderation
  userAgent?: string;    // Track browser for spam detection
  createdAt: Date;
  updatedAt: Date;
}

// Blog SEO interface
export interface IBlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

// Blog reading time interface
export interface IReadingTime {
  minutes: number;
  words: number;
}

// Main Blog interface (Admin created only)
export interface IBlog extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  gallery?: string[];
  author: Types.ObjectId;  // Reference to User model (_id)
  category: BlogCategory;
  tags: IBlogTag[];
  status: BlogStatus;
  isFeature: boolean;
  isPinned: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  comments: IBlogComment[];  // Anonymous comments from visitors
  readingTime: IReadingTime;
  seo: IBlogSEO;
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Blog creation interface (Admin only - requires authentication)
export interface ICreateBlogByAdmin {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  gallery?: string[];
  category: BlogCategory;
  tags: IBlogTag[];
  status?: BlogStatus;        // Default: DRAFT
  isFeature?: boolean;        // Default: false
  isPinned?: boolean;         // Default: false
  seo?: IBlogSEO;
  publishedAt?: Date;         // Auto-set if status is PUBLISHED
  scheduledAt?: Date;         // For future publishing
  // Author info will be extracted from JWT token, not from request body
}

// Blog update interface (Admin only - requires authentication)
export interface IUpdateBlogByAdmin {
  title?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  gallery?: string[];
  category?: BlogCategory;
  tags?: IBlogTag[];
  status?: BlogStatus;        // Can change DRAFT → PUBLISHED → ARCHIVED
  isFeature?: boolean;        // Admin can feature/unfeature posts
  isPinned?: boolean;         // Admin can pin/unpin posts
  seo?: IBlogSEO;
  publishedAt?: Date;         // Auto-update when status changes to PUBLISHED
  scheduledAt?: Date;         // Admin can reschedule posts
  // Author info cannot be changed (always the authenticated admin)
}

// Blog query interface (for filtering and searching)
export interface IBlogQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  category?: BlogCategory;
  status?: BlogStatus;
  tags?: string;
  author?: string;
  isFeature?: boolean;
  isPinned?: boolean;
  startDate?: Date;
  endDate?: Date;
}

// Simple blog analytics for admin dashboard
export interface IBlogAnalytics {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: number;
  totalComments: number;
  pendingComments: number;  // Comments awaiting approval
  popularCategories: Array<{ category: string; count: number }>;
  recentComments: IBlogComment[];  // Latest comments for moderation
}


// Anonymous comment creation interface (no auth required)
export interface ICreateComment {
  author: string;       // Visitor's name (required)
  email: string;        // Visitor's email (required for contact)
  website?: string;     // Optional website URL
  content: string;      // Comment content (required)
  blogId: Types.ObjectId; // Which blog post they're commenting on
}

// Simple visitor engagement tracking (optional)
export interface IBlogView {
  blogId: Types.ObjectId;
  ipAddress: string;
  userAgent: string;
  viewedAt: Date;
}
