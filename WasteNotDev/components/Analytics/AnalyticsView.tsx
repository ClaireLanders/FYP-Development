// Main analytics view component
// Displays metrics cards, period toggle, chart, and AI chat interface

import React, { useState } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAnalyticsChart } from '@/hooks/useAnalyticsChart';
import { useAnalyticsChat } from '@/hooks/useAnalyticsChat';
import Chart from './Chart';
import ChatSection from './AIChat';
import MetricCard from './MetricCard';

const BRANCH_ID = '03a897a0-e271-4174-aed2-d283a888dbae';

export function AnalyticsView() {
    // Analytics hook manages period state
    const {
        metrics,
        loading,
        error,
        fetchMetrics,
        periodType,
        setPeriodType,
        referenceDate
    } = useAnalytics(BRANCH_ID);

    // Chart hook uses same period state
    const { chart, loading: chartLoading } = useAnalyticsChart(
        BRANCH_ID,
        periodType,
        referenceDate
    );

    // Chat hook uses same period state
    const { messages, loading: chatLoading, askQuestion } = useAnalyticsChat(
        BRANCH_ID,
        periodType,
        referenceDate
    );

    const [question, setQuestion] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            void fetchMetrics();
        }, [])
    );

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
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Waste Tracking</Text>
                <Text style={styles.headerSubtitle}>
                    {metrics.period.label}
                </Text>
            </View>

            {/* Period Toggle Buttons */}
            <View style={styles.periodToggle}>
                <TouchableOpacity
                    style={[
                        styles.periodButton,
                        periodType === 'week' && styles.periodButtonActive
                    ]}
                    onPress={() => setPeriodType('week')}
                >
                    <Text style={[
                        styles.periodButtonText,
                        periodType === 'week' && styles.periodButtonTextActive
                    ]}>
                        Week
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.periodButton,
                        periodType === 'month' && styles.periodButtonActive
                    ]}
                    onPress={() => setPeriodType('month')}
                >
                    <Text style={[
                        styles.periodButtonText,
                        periodType === 'month' && styles.periodButtonTextActive
                    ]}>
                        Month
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.periodButton,
                        periodType === 'year' && styles.periodButtonActive
                    ]}
                    onPress={() => setPeriodType('year')}
                >
                    <Text style={[
                        styles.periodButtonText,
                        periodType === 'year' && styles.periodButtonTextActive
                    ]}>
                        Year
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Metrics Cards */}
            <View style={styles.metricsContainer}>
                <MetricCard title="ITEMS LISTED" value={metrics.total_items_listed} />
                <MetricCard title="ITEMS RESCUED" value={metrics.total_items_rescued} />
                <MetricCard title="RESCUE RATE" value={`${metrics.rescue_rate}%`} />
                <MetricCard title="TOTAL LISTINGS" value={metrics.listings_count} />
                <MetricCard title="COMPLETED PICKUPS" value={metrics.pickups_completed} />
            </View>

            {/* Chart */}
            {chartLoading ? (
                <View style={styles.chartLoading}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Loading chart...</Text>
                </View>
            ) : chart ? (
                <Chart chart={chart} />
            ) : null}

            {/* AI Chat */}
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
    periodToggle: {
        flexDirection: 'row',
        padding: 16,
        gap: 8
    },
    periodButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center'
    },
    periodButtonActive: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50'
    },
    periodButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666'
    },
    periodButtonTextActive: {
        color: '#fff'
    },
    metricsContainer: {
        padding: 16
    },
    chartLoading: {
        padding: 40,
        alignItems: 'center'
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

// REFERENCES
// React Native. (2025). TouchableOpacity. Retrieved from reactnative.dev/docs/touchableopacity
// React Native. (2025). View. Retrieved from reactnative.dev/docs/view
// React Native. (2025). ScrollView. Retrieved from reactnative.dev/docs/scrollview
// React Native. (2025). StyleSheet. Retrieved from reactnative.dev/docs/stylesheet