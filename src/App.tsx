import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ArticleList from './components/ArticleList';
import PreferencesModal from './components/PreferencesModal';
import type { SearchFilters, UserPreferences } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useLazyLoad } from './hooks/useLazyLoad';

function App() {
  const [showPreferences, setShowPreferences] = useState(false);
  
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('newsPreferences', {
    sources: [],
    categories: [],
    authors: []
  });

  const getPreferredSources = (): string[] => {
    // If no source preferences are set, return all sources
    return preferences.sources.length > 0 ? preferences.sources : ['newsapi', 'guardian', 'nytimes'];
  };

  const { articles, loading, hasMore, error, loadMore, refresh } = useLazyLoad({
    initialFilters: {},
    sources: getPreferredSources(),
    itemsPerPage: 12
  });

  useEffect(() => {
    refresh({}, getPreferredSources());
  }, [preferences]);

  const handleSearch = (searchFilters: SearchFilters) => {
    let sources = getPreferredSources();
    
    // If source filter is specified, use only that source
    if (searchFilters.source && searchFilters.source !== 'all') {
      if (searchFilters.source === 'newsapi' || 
          searchFilters.source === 'guardian' || 
          searchFilters.source === 'nytimes') {
        sources = [searchFilters.source];
      }
    }

    refresh(searchFilters, sources);
  };

  const handleSavePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    // The useEffect will automatically reload the personalized feed
  };

  return (
    <div className="app">
      <Header onOpenPreferences={() => setShowPreferences(true)} />
      
      <main className="main-content">
        <SearchBar onSearch={handleSearch} />
        <ArticleList 
          articles={articles} 
          loading={loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
          showSkeletons={true}
        />
      </main>

      <PreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        preferences={preferences}
        onSave={handleSavePreferences}
      />
    </div>
  );
}

export default App;
