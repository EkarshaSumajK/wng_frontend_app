// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Simple in-memory cache for GET requests
interface CacheEntry {
  data: any;
  timestamp: number;
}

class RequestCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly TTL = 60000; // 60 seconds cache TTL (increased from 30s)
  private readonly MAX_CACHE_SIZE = 100; // Limit cache size

  set(key: string, data: any): void {
    // Implement LRU cache - remove oldest if at capacity
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache entry is still valid
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }
}

// API client with error handling and caching
export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private cache: RequestCache = new RequestCache();
  private pendingRequests: Map<string, Promise<any>> = new Map();

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
    
    // Clean up expired cache entries every 2 minutes
    setInterval(() => {
      this.cache.cleanup();
    }, 120000);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      
      // If detail is an object (like conflict errors), stringify it for the Error message
      let errorMessage: string;
      if (typeof error.detail === 'object') {
        errorMessage = JSON.stringify(error.detail);
      } else {
        errorMessage = error.detail || `HTTP ${response.status}: ${response.statusText}`;
      }
      
      // Create error with status code attached
      const err: any = new Error(errorMessage);
      err.status = response.status;
      err.response = { status: response.status, data: error };
      throw err;
    }

    if (response.status === 204) {
      return null as T;
    }

    const json = await response.json();
    
    // Handle wrapped responses from backend (e.g., { status: "success", data: [...] })
    if (json && typeof json === 'object' && 'data' in json) {
      return json.data as T;
    }
    
    return json;
  }

  async get<T>(endpoint: string, params?: Record<string, any>, useCache: boolean = true): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const cacheKey = url.toString();

    // Check cache first
    if (useCache) {
      const cachedData = this.cache.get(cacheKey);
      if (cachedData !== null) {
        return cachedData as T;
      }
    }

    // Check if request is already pending (request deduplication)
    const pendingRequest = this.pendingRequests.get(cacheKey);
    if (pendingRequest) {
      return pendingRequest as Promise<T>;
    }

    // Make new request
    const requestPromise = fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    })
      .then(response => this.handleResponse<T>(response))
      .then(data => {
        // Cache successful response
        if (useCache) {
          this.cache.set(cacheKey, data);
        }
        this.pendingRequests.delete(cacheKey);
        return data;
      })
      .catch(error => {
        this.pendingRequests.delete(cacheKey);
        throw error;
      });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  clearCache(): void {
    this.cache.clear();
  }

  invalidateCache(pattern: string): void {
    this.cache.invalidate(pattern);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await this.handleResponse<T>(response);
    
    // Invalidate related cache entries after mutation
    this.invalidateCache(endpoint.split('/')[0]);
    
    return result;
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await this.handleResponse<T>(response);
    
    // Invalidate related cache entries after mutation
    this.invalidateCache(endpoint.split('/')[0]);
    
    return result;
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await this.handleResponse<T>(response);
    
    // Invalidate related cache entries after mutation
    this.invalidateCache(endpoint.split('/')[0]);
    
    return result;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<T>(response);
    
    // Invalidate related cache entries after mutation
    this.invalidateCache(endpoint.split('/')[0]);
    
    return result;
  }

  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    // Don't set Content-Type for FormData - browser will set it with boundary

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
