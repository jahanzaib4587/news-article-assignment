import React, { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { SearchFilters } from '../types';
import { CATEGORIES, SOURCES } from '../config/api';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate date range
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      alert('From date cannot be later than to date');
      return;
    }

    // Validate date is not in the future
    const today = new Date().toISOString().split('T')[0];
    if (dateFrom && dateFrom > today) {
      alert('From date cannot be in the future');
      return;
    }
    if (dateTo && dateTo > today) {
      alert('To date cannot be in the future');
      return;
    }

    onSearch({
      keyword: keyword.trim(),
      category,
      source,
      dateFrom,
      dateTo
    });
  };

  const clearFilters = () => {
    setKeyword('');
    setCategory('');
    setSource('');
    setDateFrom('');
    setDateTo('');
    
    // Trigger search with cleared filters
    onSearch({
      keyword: '',
      category: '',
      source: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search articles..."
            className="search-input"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle-btn"
          >
            <Filter size={20} />
          </button>
          <button type="submit" className="search-btn">
            Search
          </button>
        </div>

        {showFilters && (
          <div className="filters-container">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="filter-select"
              >
                <option value="">All Sources</option>
                {SOURCES.map(src => (
                  <option key={src.id} value={src.id}>
                    {src.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>From Date</label>
              <div className="date-input-container">
                <Calendar size={16} />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="date-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label>To Date</label>
              <div className="date-input-container">
                <Calendar size={16} />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="date-input"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar; 