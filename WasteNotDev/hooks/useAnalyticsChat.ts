// Custom React hook for the AI analytics chat feature
// Manages message history (question + answer pairs), loading state, and error state.
// Each question is sent with the current period context so the AI answer is relevant.
// Messages accumulate in state for the duration of the session.
// React useState: (React, 2025)
// analyticsService.askQuestion() calls the OpenAI-backed backend endpoint (OpenAI, 2025)

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