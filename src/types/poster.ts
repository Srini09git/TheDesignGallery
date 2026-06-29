export interface Poster {
  id: number;
  title: string;
  category: string;
  image?: string | boolean;
  images?: string[];
  pdfUrl?: string;
  description?: string;
  des?: string;
  objectives?: string[];
  author: string;
  level?: string;
  step_by_step?: string[];
  asset_image?: string;
  idea?: string;
}

export type Category = 'all' | 'BrandLogo' | 'logo' | 'poster' | 'flyer' | 'banner' | 'completed' | 'mobile-screen' | 'desktop-ui' | 'ux' | 'challenge' | 'Frontend' | 'Backend' | 'UiUx' | 'Graphic design' | 'UI design' | 'UX';
