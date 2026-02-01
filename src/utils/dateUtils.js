/**
 * Date Utilities
 * 
 * @module utils/dateUtils
 * @description Helper functions for date formatting and manipulation.
 * 
 * Usage:
 *   import { formatWorkoutDate } from '../utils/dateUtils';
 *   formatWorkoutDate('2025-01-28') // → 'Jan 28'
 * 
 * @version 1.0.0
 */

/**
 * Format ISO date string to readable workout date
 * 
 * @param {string|null} isoDate - ISO 8601 date string (e.g., '2025-01-28')
 * @returns {string} Formatted date (e.g., 'Jan 28') or 'Never' if null
 * 
 * @example
 * formatWorkoutDate('2025-01-28') // → 'Jan 28'
 * formatWorkoutDate(null)         // → 'Never'
 */
export const formatWorkoutDate = (isoDate) => {
  // Handle null/undefined (workout never completed)
  if (!isoDate) {
    return 'Never';
  }
  
  // Parse ISO string to Date object
  const date = new Date(isoDate);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  // Format: "Jan 28"
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Get relative time string (e.g., "2 days ago")
 * 
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string} Relative time string
 * 
 * @example
 * getRelativeTime('2025-01-30') // → '2 days ago' (if today is Feb 1)
 */
export const getRelativeTime = (isoDate) => {
  if (!isoDate) {
    return 'Never';
  }
  
  const date = new Date(isoDate);
  const now = new Date();
  
  // Calculate difference in days
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatWorkoutDate(isoDate);
};