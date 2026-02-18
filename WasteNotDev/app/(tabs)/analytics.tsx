// Analytics screen - View waste tracking metrics and AI-powered insights
// This screen renders the AnalyticsView component which displays metrics,
// AI-generated charts, and chat interface for data questions
// Store owners use this screen to track their food rescue performance

import { StyleSheet } from 'react-native';
import { AnalyticsView } from '@/components/Analytics/AnalyticsView';

export default function AnalyticsScreen() {
  return <AnalyticsView />;
}

const styles = StyleSheet.create({
});

// REFERENCES
// React Native. (2025). StyleSheet. Retrieved from reactnative.dev/docs
// React Native. (2025). ScrollView. Retrieved from reactnative.dev/docs
// Expo. (2025). Navigation. Retrieved from docs.expo.dev
// OpenAI. (2024). Chat Completions API. Retrieved from platform.openai.com/docs/guides/chat-completions
// react-native-chart-kit. (2024). Documentation. Retrieved from github.com/indiespirit/react-native-chart-kit