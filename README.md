# Portfolio Backend API - RESTful Node.js API

> A robust, scalable RESTful API built with Node.js, Express, TypeScript, and MongoDB, powering a modern portfolio website with admin dashboard functionality.

## 🌐 Live API

**🚀 [API Base URL](https://portfolio-backend-vert-ten.vercel.app)**

*Replace with your actual deployment URL*

---

## 📋 Project Overview

This is a full-featured backend API that serves a portfolio website and admin dashboard. It provides comprehensive content management, user authentication, file uploads, and real-time analytics for blogs, projects, skills, and user interactions.

### ✨ Key Features

#### 🔐 **Authentication & Authorization**
- **JWT-based Authentication** - Secure token-based auth system
- **Role-based Access Control** - OWNER/ADMIN/USER role management
- **Refresh Token Support** - Automatic token renewal
- **Secure Cookie Management** - HTTP-only cookies for tokens

#### 📝 **Content Management**
- **Blog System** - Create, read, update, delete blog posts
- **Project Portfolio** - Manage project showcases
- **Skills Management** - Categorized skill tracking
- **About Section** - Dynamic about page content
- **Comment System** - Blog comment moderation

#### 📊 **Analytics & Statistics**
- **Blog Analytics** - Views, comments, engagement metrics
- **Monthly Trends** - Time-series publication data
- **Top Content** - Performance-based content ranking
- **Author Statistics** - Individual contributor metrics
- **Category Analysis** - Content distribution insights

#### 🖼️ **File Management**
- **Cloudinary Integration** - Cloud-based image storage
- **Multer Upload** - Secure file upload handling
- **Image Optimization** - Automatic image processing
- **Featured Images** - Blog and project image support

#### 🔧 **Data Features**
- **Advanced Querying** - Search, filter, pagination support
- **Data Validation** - Zod schema validation
- **Error Handling** - Comprehensive error management
- **CORS Support** - Cross-origin resource sharing

---

## 🛠️ Technology Stack

### **Runtime & Framework**
- **Node.js** - JavaScript runtime environment
- **Express.js 5** - Web application framework
- **TypeScript** - Type-safe JavaScript development

### **Database & ODM**
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB object modeling

### **Authentication & Security**
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling middleware

### **File Upload & Storage**
- **Multer** - File upload middleware
- **Cloudinary** - Cloud image storage and optimization
- **Multer Storage Cloudinary** - Cloudinary storage engine

### **Validation & Types**
- **Zod** - Schema validation library
- **HTTP Status Codes** - Standard HTTP response codes

### **Development Tools**
- **ts-node-dev** - TypeScript development server
- **ESLint** - Code quality enforcement
- **dotenv** - Environment variable management

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** (local or cloud instance)
- **Cloudinary Account** (for image uploads)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hassan-nahid/portfolio-backend.git
   cd portfolio-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   
   # Database
   DB_URL=mongodb://localhost:27017/portfolio
   # or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/portfolio
   
   # JWT Configuration
   JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
   JWT_ACCESS_EXPIRES=15m
   JWT_REFRESH_EXPIRES=7d
   BCRYPT_SALT_ROUND=12
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **API Access**
   
   The API will be available at [http://localhost:5000/api](http://localhost:5000/api)

### Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── app/
│   │   ├── config/             # Configuration files
│   │   │   ├── cloudinary.config.ts
│   │   │   ├── env.ts
│   │   │   └── multer.config.ts
│   │   ├── errorHelpers/       # Error handling utilities
│   │   ├── helpers/            # Helper functions
│   │   ├── interfaces/         # TypeScript interfaces
│   │   ├── middleware/         # Express middleware
│   │   │   ├── CheckAuth.ts
│   │   │   ├── ValidateRequest.ts
│   │   │   └── globalErrorHandler.ts
│   │   ├── modules/            # Feature modules
│   │   │   ├── about/          # About section management
│   │   │   ├── blog/           # Blog system
│   │   │   ├── project/        # Project portfolio
│   │   │   ├── skill/          # Skills management
│   │   │   └── user/           # User authentication
│   │   ├── routers/            # Route definitions
│   │   ├── types/              # Type definitions
│   │   └── utils/              # Utility functions
│   ├── app.ts                  # Express app configuration
│   └── server.ts               # Server entry point
├── dist/                       # Compiled JavaScript
├── vercel.json                 # Vercel deployment config
└── package.json               # Project dependencies
```

---

## 🔧 API Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint code analysis |

---

## 📚 API Endpoints

### **Authentication**
```
POST   /api/user/login           # User login
POST   /api/user/refresh-token   # Refresh access token
POST   /api/user/logout          # User logout
```

### **Blog Management**
```
# Public Routes
GET    /api/blog                 # Get published blogs (with pagination, search)
GET    /api/blog/:identifier     # Get single blog by ID or slug
GET    /api/blog/:id/comments    # Get blog comments
POST   /api/blog/:id/comments    # Add comment to blog

# Admin Routes (Protected)
POST   /api/blog/create          # Create new blog
GET    /api/blog/admin           # Get all blogs (admin view)
GET    /api/blog/admin/stats     # Get blog analytics
GET    /api/blog/admin/:id       # Get blog by ID (admin)
PATCH  /api/blog/:id             # Update blog
DELETE /api/blog/:id             # Delete blog
PATCH  /api/blog/comments/:id    # Moderate comment (approve/reject)
```

### **Project Management**
```
GET    /api/project              # Get all projects
GET    /api/project/:id          # Get single project
POST   /api/project/create       # Create project (admin)
PATCH  /api/project/:id          # Update project (admin)
DELETE /api/project/:id          # Delete project (admin)
```

### **Skills Management**
```
GET    /api/skill                # Get all skills
GET    /api/skill/:id            # Get single skill
POST   /api/skill/create         # Create skill (admin)
PATCH  /api/skill/:id            # Update skill (admin)
DELETE /api/skill/:id            # Delete skill (admin)
```

### **About Section**
```
GET    /api/about                # Get about information
PATCH  /api/about/:id            # Update about information (admin)
```

---

## 🔐 Authentication Flow

### **Login Process**
1. **POST** `/api/user/login` with credentials
2. Receive access token (15min) and refresh token (7 days)
3. Access token stored in HTTP-only cookie
4. Use access token for protected routes

### **Token Refresh**
1. **POST** `/api/user/refresh-token` when access token expires
2. Receive new access token
3. Continue API access

### **Protected Routes**
- Require valid JWT access token
- Role-based access control (OWNER/ADMIN)
- Automatic token validation middleware

---

## 📊 Blog Analytics Features

The `/api/blog/admin/stats` endpoint provides comprehensive analytics:

```typescript
{
  overview: {
    totalBlogs: number
    publishedBlogs: number
    draftBlogs: number
    featuredBlogs: number
    totalViews: number
    totalComments: number
    pendingComments: number
    averageViews: number
    averageComments: number
  }
  categoryStats: Array<{
    category: string
    count: number
    views: number
    comments: number
  }>
  monthlyStats: Array<{
    month: string
    blogs: number
    views: number
    comments: number
    published: number
  }>
  topBlogsByViews: Array<{
    _id: string
    title: string
    views: number
    comments: number
    author: AuthorInfo
  }>
  recentActivity: Array<{
    _id: string
    title: string
    status: string
    updatedAt: string
  }>
  // ... additional analytics
}
```

---

## 🖼️ File Upload System

### **Image Upload Flow**
1. Client uploads image via form-data
2. Multer processes the upload
3. Cloudinary stores and optimizes image
4. Database stores Cloudinary URL
5. Optimized image served to frontend

### **Supported Formats**
- **Images**: JPG, PNG, GIF, WebP
- **Size Limit**: 10MB per file
- **Auto Optimization**: Cloudinary handles compression

---

## ⚡ Performance Features

- **Database Indexing** - Optimized MongoDB queries
- **Pagination Support** - Efficient large dataset handling
- **Query Optimization** - Mongoose query optimization
- **Error Caching** - Comprehensive error handling
- **CORS Optimization** - Efficient cross-origin handling
- **JWT Optimization** - Fast token verification

---

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Security** - Signed tokens with expiration
- **CORS Protection** - Controlled cross-origin access
- **Input Validation** - Zod schema validation
- **Error Sanitization** - Safe error responses
- **HTTP-only Cookies** - Secure token storage

---

## 🚀 Deployment

### **Vercel Deployment**
1. Configure `vercel.json` (already included)
2. Set environment variables in Vercel dashboard
3. Deploy: `vercel --prod`

### **Environment Variables for Production**
```env
NODE_ENV=production
DB_URL=mongodb+srv://...
JWT_ACCESS_SECRET=production_secret
FRONTEND_URL=https://your-frontend-domain.com
# ... other production configs
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Hassan Nahid**
- Portfolio: [[Portfolio link](https://hassannahid.me)]
- GitHub: [@hassan-nahid](https://github.com/hassan-nahid)
- LinkedIn: [[Linkedin link](https://www.linkedin.com/in/hassan-nahid)]

---

## 🙏 Acknowledgments

- Express.js team for the robust framework
- MongoDB team for the flexible database
- Cloudinary for image management
- Vercel for deployment platform
- All open-source contributors

---

**Built with ❤️ using Node.js, Express, and TypeScript**
