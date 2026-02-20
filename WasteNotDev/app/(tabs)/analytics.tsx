// Tab screen entry point for the analytics feature (US7 & US8).
// Renders the AnalyticsView component which handles all metrics, charts,
// and AI chat functionality.
//
// React Native StyleSheet: (React Native, 2026)
// Expo navigation tab: (Expo, 2024)
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