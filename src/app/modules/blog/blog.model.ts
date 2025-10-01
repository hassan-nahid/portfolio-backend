import { model, Schema, Document } from "mongoose";
import { IBlog, IBlogComment, BlogStatus, BlogCategory } from "./blog.interface";

// Blog comment subdocument schema
const blogCommentSchema = new Schema<IBlogComment>({
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 1000
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .trim()                       // Trim whitespace
    .substring(0, 100);           // Limit length
};

// Main blog schema
const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 500
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 100,
    maxlength: 50000
  },
  featuredImage: {
    type: String,
    trim: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(BlogCategory)
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  status: {
    type: String,
    enum: Object.values(BlogStatus),
    default: BlogStatus.DRAFT
  },
  isFeature: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  commentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  comments: [blogCommentSchema],
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to generate slug and handle publishing
blogSchema.pre('save', async function(next) {
  // Generate slug from title if not provided or title changed
  if (this.isNew || this.isModified('title')) {
    let baseSlug = generateSlug(this.title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await Blog.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }

  // Set publishedAt when status changes to PUBLISHED
  if (this.isModified('status') && this.status === BlogStatus.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Update comment count
  this.commentCount = this.comments.filter(comment => comment.isApproved).length;

  next();
});

// Indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ author: 1, status: 1 });
blogSchema.index({ isFeature: 1, status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1, status: 1 });
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' }); // Text search

// Virtual for approved comments only
blogSchema.virtual('approvedComments').get(function() {
  return this.comments.filter(comment => comment.isApproved);
});

// Static method to find published blogs
blogSchema.statics.findPublished = function() {
  return this.find({ status: BlogStatus.PUBLISHED }).sort({ publishedAt: -1 });
};

// Static method to find featured blogs
blogSchema.statics.findFeatured = function() {
  return this.find({ 
    status: BlogStatus.PUBLISHED, 
    isFeature: true 
  }).sort({ publishedAt: -1 });
};

// Instance method to add comment
blogSchema.methods.addComment = function(commentData: Partial<IBlogComment>) {
  this.comments.push({
    ...commentData,
    isApproved: false // Always require approval
  });
  return this.save();
};

// Instance method to approve comment
blogSchema.methods.approveComment = function(commentId: string) {
  const comment = this.comments.id(commentId);
  if (comment) {
    comment.isApproved = true;
    return this.save();
  }
  throw new Error('Comment not found');
};

// Instance method to increment view count
blogSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

export const Blog = model<IBlog>("Blog", blogSchema);
