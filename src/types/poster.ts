export interface Poster {
  id: number;
  title: string;
  category: string;
  image: string;
  author: string;
}

export type Category = 'all' | 'BrandLogo' | 'logo' | 'poster' | 'flyer' | 'banner' | 'completed';
