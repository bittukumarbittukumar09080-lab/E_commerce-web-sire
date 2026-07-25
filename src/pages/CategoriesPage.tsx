import React from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, setActiveTab, setSelectedCategoryFilter } = useShop();

  const handleCategorySelect = (catName: string) => {
    setSelectedCategoryFilter(catName);
    setActiveTab('Shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-zinc-200 pb-4">
        <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">Complete Men's Collection</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
          Product Categories ({categories.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategorySelect(cat.name)}
            className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="aspect-4/3 overflow-hidden bg-zinc-100">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
            </div>

            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-zinc-900 group-hover:text-amber-800 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                  {cat.itemCount} Items
                </span>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                {cat.description}
              </p>

              <div className="pt-2 text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:underline">
                <span>Explore {cat.name}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
