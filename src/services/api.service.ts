import axios from 'axios';
import type { 
  Article, 
  SearchFilters, 
  NewsApiResponse, 
  GuardianApiResponse, 
  NYTimesApiResponse,
  GuardianArticle,
  NYTimesArticle,
  NewsApiArticle 
} from '../types';
import { API_CONFIG } from '../config/api';
import { mockArticles } from '../data/mockData';

class ApiService {
  private isValidApiKey(key: string): boolean {
    return Boolean(key) && key !== 'demo_key_newsapi' && key !== 'demo_key_guardian' && key !== 'demo_key_nytimes';
  }

  private shouldUseMockData(): boolean {
    return !this.isValidApiKey(API_CONFIG.newsApi.apiKey) && 
           !this.isValidApiKey(API_CONFIG.guardian.apiKey) && 
           !this.isValidApiKey(API_CONFIG.nyTimes.apiKey);
  }

  private filterMockData(filters: SearchFilters): Article[] {
    let filtered = [...mockArticles];

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(keyword) ||
        article.description.toLowerCase().includes(keyword)
      );
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(article => 
        article.category === filters.category
      );
    }

    if (filters.source && filters.source !== 'all') {
      filtered = filtered.filter(article => 
        article.source.id.includes(filters.source!)
      );
    }

    return filtered;
  }

  private normalizeNewsApiArticle(article: NewsApiArticle): Article {
    // Try to determine category from source or content
    const determineCategory = (): string => {
      const title = (article.title || '').toLowerCase();
      const description = (article.description || '').toLowerCase();
      const content = title + ' ' + description;

      if (content.includes('business') || content.includes('finance') || content.includes('market') || content.includes('economy')) {
        return 'business';
      } else if (content.includes('tech') || content.includes('digital') || content.includes('software') || content.includes('ai')) {
        return 'technology';
      } else if (content.includes('science') || content.includes('research') || content.includes('study')) {
        return 'science';
      } else if (content.includes('health') || content.includes('medical') || content.includes('medicine')) {
        return 'health';
      } else if (content.includes('sport') || content.includes('football') || content.includes('basketball')) {
        return 'sports';
      } else if (content.includes('entertainment') || content.includes('movie') || content.includes('music')) {
        return 'entertainment';
      }
      
      return 'general';
    };

    return {
      id: article.url || `newsapi-${Date.now()}-${Math.random()}`,
      title: article.title || 'No Title Available',
      description: article.description || 'No description available',
      content: article.content,
      url: article.url || '#',
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: {
        id: article.source?.id || article.source?.name || 'newsapi',
        name: article.source?.name || 'Unknown Source'
      },
      author: article.author,
      category: determineCategory()
    };
  }

  private normalizeGuardianArticle(article: GuardianArticle): Article {
    // Map Guardian sections back to our standard categories
    const sectionToCategory: Record<string, string> = {
      'business': 'business',
      'technology': 'technology', 
      'science': 'science',
      'society': 'health',
      'sport': 'sports',
      'culture': 'entertainment',
      'world': 'general',
      'uk-news': 'general',
      'us-news': 'general'
    };

    const sectionName = article.sectionName?.toLowerCase() || 'general';
    const category = sectionToCategory[sectionName] || 'general';

    return {
      id: article.id || `guardian-${Date.now()}-${Math.random()}`,
      title: article.webTitle || 'No Title Available',
      description: article.fields?.trailText || 'No description available',
      content: article.fields?.bodyText || undefined,
      url: article.webUrl || '#',
      urlToImage: article.fields?.thumbnail || undefined,
      publishedAt: article.webPublicationDate || new Date().toISOString(),
      source: {
        id: 'guardian',
        name: 'The Guardian'
      },
      author: undefined,
      category: category
    };
  }

  private normalizeNYTimesArticle(article: NYTimesArticle): Article {
    const imageUrl = article.multimedia?.length > 0 
      ? `https://www.nytimes.com/${article.multimedia[0].url}`
      : undefined;

    // Map NY Times sections back to our standard categories
    const sectionToCategory: Record<string, string> = {
      'business': 'business',
      'technology': 'technology',
      'science': 'science', 
      'health': 'health',
      'sports': 'sports',
      'arts': 'entertainment',
      'movies': 'entertainment',
      'theater': 'entertainment',
      'world': 'general',
      'us': 'general',
      'politics': 'general'
    };

    const sectionName = article.section_name?.toLowerCase() || 'general';
    const category = sectionToCategory[sectionName] || 'general';

    return {
      id: article._id || `nytimes-${Date.now()}-${Math.random()}`,
      title: article.headline?.main || 'No Title Available', 
      description: article.abstract || 'No description available',
      url: article.web_url || '#',
      urlToImage: imageUrl,
      publishedAt: article.pub_date || new Date().toISOString(),
      source: {
        id: 'nytimes',
        name: 'The New York Times'
      },
      author: article.byline?.original?.replace('By ', '') || undefined,
      category: category
    };
  }

  async fetchFromNewsApi(filters: SearchFilters): Promise<Article[]> {
    try {
      const params: Record<string, string | number> = {
        apiKey: API_CONFIG.newsApi.apiKey,
        pageSize: 50,
        language: 'en',
        sortBy: 'publishedAt'
      };

      // Use /everything endpoint for keyword searches, /top-headlines for category/general browsing
      const useEverything = Boolean(filters.keyword) || Boolean(filters.dateFrom) || Boolean(filters.dateTo);
      const endpoint = useEverything 
        ? API_CONFIG.newsApi.endpoints.everything 
        : API_CONFIG.newsApi.endpoints.topHeadlines;

      if (filters.keyword) {
        params.q = filters.keyword;
      }
      
      if (filters.category && filters.category !== 'all') {
        if (useEverything) {
          // For /everything endpoint, we need to use domains or sources
          // Since category filtering is limited, we'll search in title/description
          const categoryKeywords: Record<string, string> = {
            'business': 'business OR finance OR economy OR market',
            'technology': 'technology OR tech OR digital OR software',
            'science': 'science OR research OR study OR discovery',
            'health': 'health OR medical OR medicine OR healthcare',
            'sports': 'sports OR football OR basketball OR soccer',
            'entertainment': 'entertainment OR movie OR music OR celebrity',
            'general': 'news OR breaking OR world'
          };
          
          const categoryQuery = categoryKeywords[filters.category];
          if (categoryQuery) {
            params.q = filters.keyword 
              ? `(${filters.keyword}) AND (${categoryQuery})`
              : categoryQuery;
          }
        } else {
          // For /top-headlines, category parameter works directly
          params.category = filters.category;
        }
      }
      
      if (filters.dateFrom) {
        params.from = filters.dateFrom;
      }
      
      if (filters.dateTo) {
        params.to = filters.dateTo;
      }

      const response = await axios.get<NewsApiResponse>(
        `${API_CONFIG.newsApi.baseUrl}${endpoint}`,
        { params }
      );

      if (response.data.articles) {
        return response.data.articles
          .filter(article => article.title && article.title !== '[Removed]')
          .map((article) => this.normalizeNewsApiArticle(article));
      }
      
      return [];
    } catch (error) {
      console.error('NewsAPI Error:', error);
      return [];
    }
  }

  async fetchFromGuardian(filters: SearchFilters): Promise<Article[]> {
    try {
      const params: Record<string, string | number> = {
        'api-key': API_CONFIG.guardian.apiKey,
        'page-size': 50,
        'show-fields': 'trailText,thumbnail,bodyText',
        'order-by': 'newest'
      };

      if (filters.keyword) {
        params.q = filters.keyword;
      }
      
      if (filters.category && filters.category !== 'all') {
        // Map our standard categories to Guardian sections
        const categoryMapping: Record<string, string> = {
          'business': 'business',
          'technology': 'technology',
          'science': 'science',
          'health': 'society',
          'sports': 'sport',
          'entertainment': 'culture',
          'general': 'world'
        };
        
        const guardianSection = categoryMapping[filters.category] || filters.category;
        params.section = guardianSection;
      }
      
      if (filters.dateFrom) {
        params['from-date'] = filters.dateFrom;
      }
      
      if (filters.dateTo) {
        params['to-date'] = filters.dateTo;
      }

      const response = await axios.get<GuardianApiResponse>(
        `${API_CONFIG.guardian.baseUrl}${API_CONFIG.guardian.endpoints.search}`,
        { params }
      );

      if (response.data.response?.results) {
        return response.data.response.results.map(this.normalizeGuardianArticle);
      }
      
      return [];
    } catch (error) {
      console.error('Guardian API Error:', error);
      return [];
    }
  }

  async fetchFromNYTimes(filters: SearchFilters): Promise<Article[]> {
    try {
      const params: Record<string, string> = {
        'api-key': API_CONFIG.nyTimes.apiKey,
        'sort': 'newest'
      };

      if (filters.keyword) {
        params.q = filters.keyword;
      }
      
      if (filters.category && filters.category !== 'all') {
        // Map our standard categories to NY Times sections
        const categoryMapping: Record<string, string> = {
          'business': 'Business',
          'technology': 'Technology',
          'science': 'Science',
          'health': 'Health',
          'sports': 'Sports',
          'entertainment': 'Arts',
          'general': 'World'
        };
        
        const nyTimesSection = categoryMapping[filters.category] || filters.category;
        params.fq = `section_name:"${nyTimesSection}"`;
      }
      
      if (filters.dateFrom) {
        // NY Times expects YYYYMMDD format
        params.begin_date = filters.dateFrom.replace(/-/g, '');
      }
      
      if (filters.dateTo) {
        // NY Times expects YYYYMMDD format  
        params.end_date = filters.dateTo.replace(/-/g, '');
      }

      const response = await axios.get<NYTimesApiResponse>(
        `${API_CONFIG.nyTimes.baseUrl}${API_CONFIG.nyTimes.endpoints.search}`,
        { params }
      );

      if (response.data.response?.docs) {
        return response.data.response.docs.map(this.normalizeNYTimesArticle);
      }
      
      return [];
    } catch (error) {
      console.error('NY Times API Error:', error);
      return [];
    }
  }

  async fetchArticles(filters: SearchFilters, sources: string[]): Promise<Article[]> {
    // Use mock data if no valid API keys are configured
    if (this.shouldUseMockData()) {
      console.log('Using mock data - no valid API keys configured');
      return this.filterMockData(filters);
    }

    const promises: Promise<Article[]>[] = [];

    // Fetch from specified sources
    if (sources.includes('newsapi')) {
      promises.push(this.fetchFromNewsApi(filters));
    }
    if (sources.includes('guardian')) {
      promises.push(this.fetchFromGuardian(filters));
    }
    if (sources.includes('nytimes')) {
      promises.push(this.fetchFromNYTimes(filters));
    }

    // If no sources specified, fetch from all
    if (sources.length === 0) {
      promises.push(
        this.fetchFromNewsApi(filters),
        this.fetchFromGuardian(filters),
        this.fetchFromNYTimes(filters)
      );
    }

    const results = await Promise.allSettled(promises);
    const articles: Article[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        articles.push(...result.value);
      } else {
        console.error(`API fetch failed for source ${index}:`, result.reason);
      }
    });

    // Remove duplicates based on title and URL
    const uniqueArticles = articles.filter((article, index, self) => 
      index === self.findIndex(a => 
        a.title === article.title || a.url === article.url
      )
    );

    // Sort by published date (newest first)
    return uniqueArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
}

export default new ApiService(); 