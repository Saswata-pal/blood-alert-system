// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Retrieves the authentication token from local storage.
 * @returns {string | null} The token string or null if not found.
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token");
  }
  return null;
};

/**
 * Gets the user's role from local storage.
 * @returns {string | null} The user's role or null if not found.
 */
export const getUserRole = (): string | null => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      try {
        const parsedInfo = JSON.parse(userInfo);
        return parsedInfo.role || null;
      } catch (e) {
        console.error("Failed to parse user info from local storage", e);
        return null;
      }
    }
  }
  return null;
};