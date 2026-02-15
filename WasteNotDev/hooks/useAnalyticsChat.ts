// Custom hook for analytics chat functionality
// Manages chat messages, loading states, and API calls

import { useState } from 'react';
import { analyticsService } from '@/services/analyticsService';
import type { ChatMessage } from '@/services/types';

export const useAnalyticsChat = (branchId: string, days: number = 30) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = async (question: string) => {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await analyticsService.askQuestion(branchId, question, days);

      const newMessage: ChatMessage = {
        question: question,
        answer: response.answer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    loading,
    error,
    askQuestion,
    clearMessages
  };
};