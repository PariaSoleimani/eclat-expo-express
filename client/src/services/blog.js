import { get } from '@/lib/requests';

export const getBlogPosts = () => get('/api/v1/blog-posts');

export const getBlogPostBySlug = slug => get(`/api/v1/blog-posts/${encodeURIComponent(slug)}`);
