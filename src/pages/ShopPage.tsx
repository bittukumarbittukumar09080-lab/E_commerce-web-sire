import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { SizeType } from '../types';
import { Search, SlidersHorizontal, X, ArrowUpDown, RefreshCw, Filter } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategoryFilter, 
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery 
  } = useShop();

  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'In Stock' | 'Out of Stock'>('All');
  const [priceRange, setPriceRange] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest'>('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Collect all distinct brands & sizes & colors
  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach(p => brands.add(p.brand));
    return ['All', ...Array.from(brands)];
  }, [products]);

  const allSizes: SizeType[] = ['S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44', '7', '8', '9', '10', '11'];

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategoryFilter !== 'All' && p.category.toLowerCase() !== selectedCategoryFilter.toLowerCase()) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) {
        return false;
      }
      // Size filter
      if (selectedSize !== 'All' && !p.sizes.includes(selectedSize as any)) {
        return false;
      }
      // Color filter
      if (selectedColor !== 'All' && !p.colors.some(c => c.toLowerCase().includes(selectedColor.toLowerCase()))) {
        return false;
      }
      // Stock Status filter
      if (stockFilter === 'In Stock' && p.stock === 0) {
        return false;
      }
      if (stockFilter === 'Out of Stock' && p.stock > 0) {
        return false;
      }
      // Price filter
      if (p.price > priceRange) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches = 
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.colors.some(c => c.toLowerCase().includes(q)) ||
          p.sizes.some(s => s.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0; // relevance
    });
  }, [products, selectedCategoryFilter, selectedBrand, selectedSize, selectedColor, stockFilter, priceRange, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategoryFilter('All');
    setSelectedBrand('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setStockFilter('All');
    setPriceRange(15000);
    setSearchQuery('');
    setSortBy('relevance');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Title & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">London Style Catalog</span>
          <h1 className="font-serif text-3xl font-bold text-zinc-900">
            {selectedCategoryFilter === 'All' ? "All Men's Apparel & Accessories" : selectedCategoryFilter}
          </h1>
          <p className="text-zinc-500 text-xs mt-1">
            Showing {filteredProducts.length} of {products.length} handcrafted products
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-800">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-semibold text-zinc-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-hidden font-medium text-zinc-900 cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className={`space-y-6 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-serif font-bold text-sm text-zinc-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                <span>Refine Search</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-amber-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Search Input Filter */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-600 mb-1.5">Keyword Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Name, color, specification..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg py-2 pl-8 pr-3 text-xs text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-600 mb-2">Category</label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategoryFilter('All')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex justify-between ${
                    selectedCategoryFilter === 'All' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <span>All Categories</span>
                  <span>({products.length})</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex justify-between ${
                      selectedCategoryFilter === cat.name ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-zinc-400">({cat.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase text-zinc-600">Max Price</label>
                <span className="text-xs font-mono font-bold text-amber-700">₹{priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={500}
                max={15000}
                step={500}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>₹500</span>
                <span>₹15,000</span>
              </div>
            </div>

            {/* Stock Status Filter */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-600 mb-2">Stock Availability</label>
              <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-lg">
                {(['All', 'In Stock', 'Out of Stock'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setStockFilter(status)}
                    className={`py-1.5 px-2 rounded-md text-[11px] font-bold transition-all text-center ${
                      stockFilter === status
                        ? status === 'Out of Stock'
                          ? 'bg-red-600 text-white shadow-xs'
                          : status === 'In Stock'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-zinc-900 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-600 mb-2">Brand</label>
              <div className="space-y-1">
                {allBrands.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                      selectedBrand === b ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-600 mb-2">Size</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSize('All')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    selectedSize === 'All' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  All
                </button>
                {allSizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      selectedSize === s ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Chips */}
          {(selectedCategoryFilter !== 'All' || selectedBrand !== 'All' || selectedSize !== 'All' || searchQuery !== '') && (
            <div className="flex flex-wrap items-center gap-2 bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-xs">
              <span className="font-bold text-zinc-500 uppercase text-[10px]">Active Filters:</span>
              {selectedCategoryFilter !== 'All' && (
                <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  Category: {selectedCategoryFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategoryFilter('All')} />
                </span>
              )}
              {selectedBrand !== 'All' && (
                <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  Brand: {selectedBrand}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrand('All')} />
                </span>
              )}
              {selectedSize !== 'All' && (
                <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  Size: {selectedSize}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSize('All')} />
                </span>
              )}
              {searchQuery && (
                <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  Search: "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-zinc-200 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mx-auto text-2xl font-serif">
                LS
              </div>
              <h3 className="font-serif font-bold text-lg text-zinc-900">No Matching Products Found</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Try loosening your filters or searching for broader terms like "Shirt", "Blazer", or "Shoes".
              </p>
              <button
                onClick={resetFilters}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
