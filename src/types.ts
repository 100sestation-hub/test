export type MediaType = 'video' | 'image';
export type Platform = 'youtube' | 'vimeo' | 'instagram' | 'tiktok' | 'drive' | 'other';
export type Category = string;

export interface CategoryItem {
  id: string;
  name: string;
  sort_order: number;
}

export interface WorkItem {
  id: string;
  type: MediaType;
  platform: Platform;
  category: Category;
  title: string;
  short_desc: string;
  role: string;
  tools: string; // Comma separated
  media_url: string;
  thumbnail_url: string;
  impact: string;
  order: number;
}

export interface PortfolioData {
  profile: {
    name: string;
    positioning: string;
    bio: string;
    email: string;
    footer_text: string;
    phone?: string;
    admin_password?: string;
    socials: {
      instagram?: string;
      tiktok?: string;
      youtube?: string;
      linkedin?: string;
    };
  };
  works: WorkItem[];
  categories: CategoryItem[];
}
