// src/api/smartpick.js
import client, {
    setAuthToken,
    clearAuthToken,
  } from './client';
  
  // ====== AUTH ======
  
  export async function login(email, password) {
    const data = await client.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  
    if (data.token) {
      // guarda en memoria + localStorage
      setAuthToken(data.token);
    }
  
    return data;
  }
  
  export function logout() {
    clearAuthToken();
  }
  
  export async function register(user) {
    // user: { email, password, firstName, lastName }
    return client.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }
  
  export async function getProfile() {
    return client.request('/auth/profile');
  }
  
  // ====== PRODUCTS ======
  
  export async function searchProducts(query) {
    const params = new URLSearchParams({ query });
    return client.request(`/products/search?${params.toString()}`);
  }
  
  export async function getProductById(id) {
    return client.request(`/products/${id}`);
  }
  
  export async function createProduct(product) {
    // product: { name, description, category, externalLink }
    return client.request('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }
  
  // ====== REVIEWS / SUMMARY / ANALYTICS ======
  
  export async function getProductSummary(id) {
    return client.request(`/products/${id}/summary`);
  }
  
  export async function getReviewAnalytics(id) {
    return client.request(`/products/${id}/review-analytics`);
  }
  
  export async function getProductReviews(id, sentiment) {
    const params = new URLSearchParams();
    if (sentiment && sentiment !== 'ALL') {
      params.set('sentiment', sentiment);
    }
    const query = params.toString();
    const path = query
      ? `/products/${id}/reviews?${query}`
      : `/products/${id}/reviews`;
  
    return client.request(path);
  }
  
  export async function createReview(productId, review) {
    // review: { rating, content, sentiment, source, isVerified }
    return client.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }
  
  // ====== PRICE ======
  
  export async function getPriceHistory(id) {
    return client.request(`/products/${id}/price-history`);
  }
  
  export async function getPriceComparison(id, sort = 'price_asc') {
    const params = new URLSearchParams({ sort });
    return client.request(
      `/products/${id}/price-comparison?${params.toString()}`
    );
  }
  