import apiClient from '../lib/apiClient.js';

export async function getHomeContent() {
  const { data } = await apiClient.get('/public/home');
  return data;
}

export async function getProducts(params) {
  const { data } = await apiClient.get('/products', { params });
  return data;
}

export async function getCategories() {
  const { data } = await apiClient.get('/categories');
  return data;
}

export async function getProduct(id) {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
}

export async function getCustomerOrders() {
  const { data } = await apiClient.get('/orders/me');
  return data;
}

export async function getVendorOrders() {
  const { data } = await apiClient.get('/orders/vendor');
  return data;
}

export async function getAllOrders() {
  const { data } = await apiClient.get('/orders');
  return data;
}

export async function createOrder(payload) {
  const { data } = await apiClient.post('/orders', payload);
  return data;
}

export async function getAdminSummary() {
  const { data } = await apiClient.get('/admin/summary');
  return data;
}

export async function getAdminUsers() {
  const { data } = await apiClient.get('/admin/users');
  return data;
}

export async function updateAdminUserStatus(id, status) {
  const { data } = await apiClient.patch(`/admin/users/${id}/status`, { status });
  return data;
}

export async function getAdminVendors() {
  const { data } = await apiClient.get('/admin/vendors');
  return data;
}

export async function updateAdminVendorStatus(id, status) {
  const { data } = await apiClient.patch(`/admin/vendors/${id}/status`, { status });
  return data;
}

export async function getAdminPromotions() {
  const { data } = await apiClient.get('/admin/promotions');
  return data;
}

export async function createAdminPromotion(payload) {
  const { data } = await apiClient.post('/admin/promotions', payload);
  return data;
}

export async function updateAdminPromotion(id, payload) {
  const { data } = await apiClient.patch(`/admin/promotions/${id}`, payload);
  return data;
}

export async function deleteAdminPromotion(id) {
  await apiClient.delete(`/admin/promotions/${id}`);
}


