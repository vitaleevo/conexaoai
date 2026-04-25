export interface Author {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  website: string;
  twitter: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  post_count: number;
  meta_title: string;
  meta_description: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  post_count: number;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  featured_image_alt: string;
  author: Author;
  category: Category;
  tags: Tag[];
  published_at: string;
  reading_time: number;
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
  keywords: string;
  canonical_url: string;
  og_image: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SubscriberPayload {
  email: string;
  name?: string;
}

export interface SubscriberResponse {
  email: string;
  name?: string;
  is_active: boolean;
  subscribed_at: string;
  confirmed: boolean;
  confirmation_token?: string;
}
