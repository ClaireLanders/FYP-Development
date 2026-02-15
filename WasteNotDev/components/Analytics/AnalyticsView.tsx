// Main analytics view component
// Displays metrics, AI chart generation, and chat interface
// TODO REFERENCE AND COMMENT!!!
import React, { useState } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAnalyticsChat } from '@/hooks/useAnalyticsChat';
import { analyticsService } from '@/services/analyticsService';
import GenerateChartButton from './GenerateChartButton';
import Chart from './Chart';
import ChatSection from './AIChat';
import type { ChartConfig } from '@/services/types';
import MetricCard from "@/components/Analytics/MetricCard";

const BRANCH_ID = '03a897a0-e271-4174-aed2-d283a888dbae';

export function AnalyticsView() {
    const { metrics, loading, error, fetchMetrics } = useAnalytics(BRANCH_ID, 30);
    const { messages, loading: chatLoading, askQuestion } = useAnalyticsChat(BRANCH_ID, 30);

    const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);
    const [generatingChart, setGeneratingChart] = useState(false);
    const [question, setQuestion] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            void fetchMetrics();
        }, [])
    );

    const handleGenerateChart = async () => {
        setGeneratingChart(true);
        try {
            const response = await analyticsService.generateChart(BRANCH_ID, 30);
            setChartConfig(response.chart_config);
        } catch (e) {
            console.error('Failed to generate chart:', e);
        } finally {
            setGeneratingChart(false);
        }
    };

    const handleAskQuestion = async () => {
        if (!question.trim()) return;
        await askQuestion(question);
        setQuestion('');
    };

    if (loading && !metrics) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading analytics...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!metrics) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No data available</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={fetchMetrics}
                />
            }
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Waste Tracking</Text>
                <Text style={styles.headerSubtitle}>
                    Last {metrics.period.days} days
                </Text>
            </View>
            <View style={styles.metricsContainer}>
            <MetricCard title="ITEMS LISTED" value={metrics.total_items_listed} />
            <MetricCard title="ITEMS RESCUED" value={metrics.total_items_rescued} />
            <MetricCard title="RESCUE RATE" value={`${metrics.rescue_rate}%`} />
            <MetricCard title="TOTAL LISTINGS" value={metrics.listings_count} />
            <MetricCard title="COMPLETED PICKUPS" value={metrics.pickups_completed} />
            </View>

            <GenerateChartButton
                onPress={handleGenerateChart}
                loading={generatingChart}
            />

            {chartConfig && <Chart chartConfig={chartConfig} />}

            <ChatSection
                messages={messages}
                question={question}
                onQuestionChange={setQuestion}
                onSend={handleAskQuestion}
                loading={chatLoading}
            />

            <View style={styles.footer}>
                <Text style={styles.footerText}>Pull down to refresh</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666'
    },
    metricsContainer: {
        padding: 16
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666'
    },
    errorText: {
        fontSize: 16,
        color: '#d32f2f',
        textAlign: 'center'
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    },
    footer: {
        padding: 20,
        alignItems: 'center'
    },
    footerText: {
        fontSize: 12,
        color: '#999'
    }
});
