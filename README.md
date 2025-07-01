# News Aggregator

A modern, feature-rich news aggregator web application built with React and TypeScript. The application fetches news from multiple reliable sources and presents them with advanced features like skeleton loading, lazy image loading, infinite scroll, and comprehensive search capabilities.

## ✨ Key Features

### 🚀 Advanced Loading & Performance
- **Skeleton Loading States**: Beautiful animated skeleton cards while content loads
- **Lazy Image Loading**: Images load only when visible, improving performance
- **Infinite Scroll**: Load more articles automatically as you scroll
- **Load More Button**: Manual loading option for better control
- **Efficient Caching**: Smart data caching to reduce API calls

### 📰 Multi-Source News Aggregation
- **NewsAPI**: Access to 70,000+ global news sources
- **The Guardian**: Comprehensive UK-based news coverage
- **The New York Times**: Premium US news with detailed articles
- **Cross-API Normalization**: Unified article format across all sources

### 🔍 Advanced Search & Filtering
- **Intelligent Search**: Search across headlines, content, and descriptions
- **Date Range Filtering**: Find articles from specific time periods
- **Category-Based Filtering**: Business, Technology, Health, Sports, Entertainment, Science, and General
- **Source-Specific Filtering**: Filter by individual news sources
- **Real-time Search**: Instant results as you type
- **Search Validation**: Input validation with user-friendly error messages

### 🎨 Modern User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Clean, Modern UI**: Intuitive interface with card-based layout
- **Dark/Light Theme Support**: Automatic theme adaptation
- **Accessibility**: ARIA labels and semantic HTML for screen readers
- **Error Handling**: Graceful error states with retry mechanisms

### ⚡ Performance Optimizations
- **Parallel API Calls**: Fetch from multiple sources simultaneously
- **Debounced Search**: Optimized search to prevent excessive API calls
- **Lazy Loading**: Components and images load on demand
- **Memory Management**: Efficient state management with cleanup
- **Bundle Optimization**: Code splitting and tree shaking

### 🛠 Technical Excellence
- **TypeScript**: Full type safety throughout the application
- **Component Architecture**: Modular, reusable React components
- **Custom Hooks**: Reusable logic for local storage and lazy loading
- **Error Boundaries**: Graceful error handling and recovery
- **API Rate Limiting**: Intelligent handling of API quotas

## 🏗 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite (Fast HMR and optimized builds)
- **Styling**: Custom CSS with CSS Variables and Flexbox/Grid
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React (Lightweight icon library)
- **Date Handling**: date-fns (Modern date utility library)
- **State Management**: React Hooks and Context API
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js**: Version 18 or higher
- **Package Manager**: npm, yarn, or pnpm
- **API Keys**: Required from three news sources (see setup below)
- **Docker**: Optional, for containerized deployment

## 🔧 Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd news-aggregator
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

**Important**: The `.env` file is not included in the repository for security reasons. You must create it manually.

1. **Create the environment file**:
```bash
# Create .env file in the root directory
touch .env
```

2. **Add your API keys to `.env`**:
```env
# NewsAPI - Get your key from https://newsapi.org/
VITE_NEWSAPI_KEY=your_newsapi_key_here

# The Guardian API - Get your key from https://open-platform.theguardian.com/
VITE_GUARDIAN_KEY=your_guardian_key_here

# The New York Times API - Get your key from https://developer.nytimes.com/
VITE_NYTIMES_KEY=your_nytimes_key_here
```

### 4. Obtain API Keys

#### NewsAPI
1. Visit [NewsAPI.org](https://newsapi.org/)
2. Click "Get API Key"
3. Create a free account
4. Copy your API key

#### The Guardian
1. Visit [The Guardian Open Platform](https://open-platform.theguardian.com/)
2. Click "Register for a key"
3. Fill out the form
4. Copy your API key

#### The New York Times
1. Visit [NYT Developer Portal](https://developer.nytimes.com/)
2. Create an account
3. Create a new app
4. Enable the "Article Search API"
5. Copy your API key

### 5. Verify Setup
```bash
# Check if environment variables are loaded
npm run dev
```

If you see API-related errors, double-check your `.env` file format and key validity.

## 🚀 Development

### Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Tests
```bash
npm run test
```

### Lint Code
```bash
npm run lint
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)
```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Using Docker Directly
```bash
# Build image
docker build -t news-aggregator .

# Run container
docker run -p 3000:80 --env-file .env news-aggregator
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
news-aggregator/
├── src/
│   ├── components/           # React components
│   │   ├── Header.tsx       # Main navigation header
│   │   ├── SearchBar.tsx    # Advanced search component
│   │   ├── ArticleCard.tsx  # Individual article display
│   │   ├── ArticleList.tsx  # Article list with infinite scroll
│   │   ├── SkeletonCard.tsx # Loading skeleton component
│   │   ├── LazyImage.tsx    # Lazy loading image component
│   │   └── PreferencesModal.tsx # User preferences
│   ├── services/            # API services
│   │   └── api.service.ts   # Multi-API integration
│   ├── hooks/               # Custom React hooks
│   │   ├── useLocalStorage.ts # Local storage management
│   │   └── useLazyLoad.ts   # Lazy loading logic
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Shared type definitions
│   ├── config/              # Configuration
│   │   └── api.ts           # API endpoints and settings
│   ├── utils/               # Utility functions
│   │   └── dateUtils.ts     # Date formatting utilities
│   ├── App.tsx              # Main application component
│   ├── App.css             # Global styles and CSS variables
│   └── main.tsx            # Application entry point
├── public/                  # Static assets
│   ├── favicon.ico         # Application favicon
│   └── index.html          # HTML template
├── .env.example            # Environment variables example
├── .gitignore              # Git ignore rules
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── nginx.conf              # Nginx configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies and scripts
```

## 🔌 API Integration Details

### NewsAPI
- **Coverage**: 70,000+ sources worldwide
- **Features**: Keyword search, source filtering, date filtering
- **Rate Limits**: 500 requests/day (free tier)
- **Endpoints**: `/everything`, `/top-headlines`

### The Guardian
- **Coverage**: Comprehensive UK and international news
- **Features**: Advanced search, section filtering, date filtering
- **Rate Limits**: 500 requests/day (free tier)
- **Endpoints**: `/search`

### The New York Times
- **Coverage**: Premium US news content
- **Features**: Archive search, semantic search, multimedia content
- **Rate Limits**: 1000 requests/day (free tier)
- **Endpoints**: `/articlesearch.json`

### Data Normalization
All API responses are normalized to a common `Article` interface:
```typescript
interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  category: string;
}
```

## 🎯 Advanced Features

### Skeleton Loading System
- **Multiple Variants**: Default, compact, and wide skeleton cards
- **Staggered Animation**: Natural loading appearance with delays
- **Shimmer Effects**: CSS-based shimmer animations
- **Responsive**: Adapts to different screen sizes

### Lazy Loading Implementation
- **Intersection Observer**: Efficient viewport detection
- **Image Optimization**: Progressive loading with placeholders
- **Infinite Scroll**: Automatic content loading
- **Performance Metrics**: Load time optimization

### Search Capabilities
- **Multi-field Search**: Title, description, and content
- **Boolean Operators**: AND, OR, NOT support
- **Phrase Matching**: Exact phrase search with quotes
- **Category Intelligence**: Smart category detection
- **Date Validation**: Prevents invalid date ranges

### Error Handling
- **API Fallbacks**: Graceful degradation when APIs fail
- **User Feedback**: Clear error messages and retry options
- **Network Detection**: Offline state handling
- **Rate Limit Management**: Automatic request throttling

## 🔒 Security Best Practices

- **Environment Variables**: API keys stored securely in `.env`
- **Input Validation**: Sanitized user inputs
- **XSS Prevention**: Safe HTML rendering
- **HTTPS Enforcement**: Secure API communications
- **CORS Handling**: Proper cross-origin request management

## 📊 Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s
- **Bundle Size**: < 500KB (gzipped)

## 🧪 Testing Strategy

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API service testing
- **E2E Tests**: User workflow testing
- **Performance Tests**: Load time and responsiveness
- **Accessibility Tests**: WCAG compliance

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Add** environment variables to your `.env` file
4. **Commit** your changes (`git commit -m 'Add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## 🐛 Troubleshooting

### Common Issues

**Environment Variables Not Loading**
```bash
# Check if .env file exists
ls -la .env

# Verify file format (no spaces around =)
cat .env
```

**API Key Invalid**
- Verify keys are correct and active
- Check API quotas and rate limits
- Ensure proper API plan subscription

**Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Docker Issues**
```bash
# Rebuild containers
docker-compose down
docker-compose up --build
```

### Getting Help
- Check the [Issues](https://github.com/your-repo/issues) page
- Review API documentation for each service
- Verify environment setup steps

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NewsAPI** for comprehensive news data
- **The Guardian** for quality journalism API
- **The New York Times** for premium news content
- **React Team** for the excellent framework
- **Vite Team** for the fast build tool

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
