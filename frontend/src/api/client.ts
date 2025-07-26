import axios from 'axios';
import { UserProfile, Task, DigitalBadge, TaskStatus } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  async saveProfile(profile: UserProfile) {
    const response = await apiClient.post('/profile', profile);
    return response.data;
  },

  async getCurrentProfile(): Promise<UserProfile | null> {
    const response = await apiClient.get('/profile');
    return response.data.profile;
  },

  async getProfile(userId: string) {
    const response = await apiClient.get(`/profile/${userId}`);
    return response.data;
  },

  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  async updateTaskStatus(taskId: string, status: TaskStatus) {
    const response = await apiClient.post(`/tasks/${taskId}/status`, status, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  async getBadges(): Promise<DigitalBadge[]> {
    const response = await apiClient.get('/badges');
    return response.data;
  },

  async createBadge(badge: DigitalBadge) {
    const response = await apiClient.post('/badges', badge);
    return response.data;
  }
};