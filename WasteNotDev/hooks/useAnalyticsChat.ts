// Custom hook for analytics chat functionality
// Manages chat messages, loading states, and API calls
// AI receives context for the current period being viewed

import { useState } from 'react';
import { analyticsService } from '@/services/analyticsService';
import type { ChatMessage } from '@/services/types';

export const useAnalyticsChat = (branchId: string, periodType: string ='month', referenceDate?:string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = async (question: string) => {
    if (!question) return;

    setLoading(true);
    setError(null);

    try {
      const response = await analyticsService.askQuestion(branchId, question, periodType, referenceDate);

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