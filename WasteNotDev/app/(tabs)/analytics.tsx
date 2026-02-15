// app/(tabs)/analytics.tsx
import React from 'react';
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

// TODO: Replace with actual branch ID from auth context
const TEMP_BRANCH_ID = '03a897a0-e271-4174-aed2-d283a888dbae'; // Tesco Express

export default function AnalyticsScreen() {
    const { metrics, loading, error, fetchMetrics } = useAnalytics(TEMP_BRANCH_ID, 30);

    // Refresh when tab gains focus
    useFocusEffect(
        React.useCallback(() => {
            void fetchMetrics();
        }, [])
    );

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
                <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>ITEMS LISTED</Text>
                    <Text style={styles.metricValue}>
                        {metrics.total_items_listed.toLocaleString()}
                    </Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>ITEMS RESCUED</Text>
                    <Text style={styles.metricValue}>
                        {metrics.total_items_rescued.toLocaleString()}
                    </Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>RESCUE RATE</Text>
                    <Text style={styles.metricValue}>{metrics.rescue_rate}%</Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>TOTAL LISTINGS</Text>
                    <Text style={styles.metricValue}>
                        {metrics.listings_count.toLocaleString()}
                    </Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>COMPLETED PICKUPS</Text>
                    <Text style={styles.metricValue}>
                        {metrics.pickups_completed.toLocaleString()}
                    </Text>
                </View>
            </View>

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
    metricCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50'
    },
    metricTitle: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 8
    },
    metricValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333'
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

// REFERENCES - TODO: REPLACE
// React Native. (2025). StyleSheet. Retrieved from reactnative.dev/docs
// React Native. (2025). ScrollView. Retrieved from reactnative.dev/docs
// Expo. (2025). Navigation. Retrieved from docs.expo.dev