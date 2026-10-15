/**
 * src/utils/dateFormatter.ts
 * Date Formatter - Today / Yesterday / 8 Oct logic
 */

import { ROMAN_NUMERALS } from '../types/session.types';

export const formatDateLabel = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (target.getTime() === today.getTime()) return 'Today';
  if (target.getTime() === yesterday.getTime()) return 'Yesterday';

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  return `${day} ${month}`;
};

export const generateSessionName = (dateLabel: string, count: number): string => {
  const roman = ROMAN_NUMERALS[count] ?? `${count + 1}`;
  return `${dateLabel}_${roman}`;
};

export const getTodayDateLabel = (): string => formatDateLabel(new Date());

