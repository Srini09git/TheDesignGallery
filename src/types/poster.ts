export interface Poster {
  id: number;
  title: string;
  category: string;
  image: string;
  images?: string[];
  description?: string;
  objectives?: string[];
  author: string;
}

export type Category = 'all' | 'BrandLogo' | 'logo' | 'poster' | 'flyer' | 'banner' | 'completed' | 'mobile-screen' | 'desktop-ui' | 'ux';
