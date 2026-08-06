import api from './client';

// Auth
export const login = (username, password) =>
  api.post('/auth/login/', { username, password }).then(r => r.data);
export const register = (data) =>
  api.post('/auth/register/', data).then(r => r.data);
export const getMe = () => api.get('/auth/me/').then(r => r.data);
export const updateMe = (data) => api.patch('/auth/me/', data).then(r => r.data);

// Portfolio
export const getProfile = () => api.get('/portfolio/').then(r => r.data);
export const getProjects = () => api.get('/portfolio/projects/').then(r => r.data);
export const getProject = (slug) => api.get(`/portfolio/projects/${slug}/`).then(r => r.data);
export const getSkills = () => api.get('/portfolio/skills/').then(r => r.data);
export const getExperiences = () => api.get('/portfolio/experience/').then(r => r.data);
export const getEducation = () => api.get('/portfolio/education/').then(r => r.data);
export const sendContact = (data) => api.post('/portfolio/contact/', data).then(r => r.data);

// Blog
export const getPosts = (params = {}) =>
  api.get('/blog/posts/', { params }).then(r => r.data);
export const getPost = (slug) => api.get(`/blog/posts/${slug}/`).then(r => r.data);
export const getCategories = () => api.get('/blog/categories/').then(r => r.data);
export const getTags = () => api.get('/blog/tags/').then(r => r.data);
export const postComment = (slug, data) =>
  api.post(`/blog/posts/${slug}/comment/`, data).then(r => r.data);

// Admin blog
export const adminGetPosts = () => api.get('/blog/admin/posts/').then(r => r.data);
export const adminCreatePost = (data) => api.post('/blog/admin/posts/', data).then(r => r.data);
export const adminUpdatePost = (slug, data) => api.patch(`/blog/admin/posts/${slug}/`, data).then(r => r.data);
export const adminDeletePost = (slug) => api.delete(`/blog/admin/posts/${slug}/`);
