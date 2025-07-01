export interface Article {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: NewsSource;
  author?: string;
  category?: string;
}

export interface NewsSource {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

export interface NewsApiArticle {
  title: string;
  description: string;
  content?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id?: string;
    name: string;
  };
  author?: string;
}

export interface GuardianApiResponse {
  response: {
    status: string;
    total: number;
    results: GuardianArticle[];
  };
}

export interface GuardianArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: {
    trailText?: string;
    thumbnail?: string;
    bodyText?: string;
  };
  webPublicationDate: string;
  sectionName?: string;
}

export interface NYTimesApiResponse {
  status: string;
  response: {
    docs: NYTimesArticle[];
  };
}

export interface NYTimesArticle {
  _id: string;
  headline: {
    main: string;
  };
  abstract: string;
  web_url: string;
  multimedia: Array<{
    url: string;
  }>;
  pub_date: string;
  byline?: {
    original?: string;
  };
  section_name?: string;
}

export interface SearchFilters {
  keyword?: string;
  category?: string;
  source?: string;
  dateFrom?: string;
  dateTo?: string;
  author?: string;
}

export interface UserPreferences {
  sources: string[];
  categories: string[];
  authors: string[];
}

export type ApiSource = 'newsapi' | 'guardian' | 'nytimes'; 