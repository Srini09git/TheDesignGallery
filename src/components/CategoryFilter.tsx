"use client";

import { Category } from '@/types/poster';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selected: Category;
  onSelect: (category: Category) => void;
  completedCount?: number;
}

const categoryLabels: Record<Category, string> = {
  all: 'All Designs',
  poster: 'Posters',
  logo: 'Logos',
  BrandLogo: 'BrandLogo',
  flyer: 'Flyers',
  banner: 'Banners',
  completed: 'Completed',
  'mobile-screen': 'Mobile Screen',
  'desktop-ui': 'Desktop Ui',
  ux: 'UX',
  challenge: 'Challenges',
  preparation: 'Interview Prep',
};

const CategoryFilter = ({ categories, selected, onSelect, completedCount = 0 }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap',
            selected === category
              ? 'gradient-primary text-primary-foreground shadow-soft'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          {category === 'completed' && (
            <CheckCircle2 className="w-3 h-3" />
          )}
          {categoryLabels[category]}
          {category === 'completed' && completedCount > 0 && (
            <span className={cn(
              "px-1.5 py-0.5 text-[10px] rounded-full font-bold",
              selected === category
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/10 text-primary"
            )}>
              {completedCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
