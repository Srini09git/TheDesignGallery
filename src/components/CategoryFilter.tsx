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
  logo: 'Logos',
  poster: 'Posters',
  flyer: 'Flyers',
  banner: 'Banners',
  completed: 'Completed',
};

const CategoryFilter = ({ categories, selected, onSelect, completedCount = 0 }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center py-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2',
            selected === category
              ? 'gradient-primary text-primary-foreground shadow-soft'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          {category === 'completed' && (
            <CheckCircle2 className="w-4 h-4" />
          )}
          {categoryLabels[category]}
          {category === 'completed' && completedCount > 0 && (
            <span className={cn(
              "ml-1 px-2 py-0.5 text-xs rounded-full",
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
