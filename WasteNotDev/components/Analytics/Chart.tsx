// Chart.tsx
// Displays a line chart of items listed vs items rescued for the selected period (US8).
// Uses react-native-chart-kit LineChart
// Chart data (labels + datasets) is passed in from AnalyticsView via useAnalyticsChart.
// Chart width is set dynamically using Dimensions.get('window').width.
// react-native-chart-kit LineChart: (react-native-chart-kit, 2024)
// React Native Dimensions: (React Native, 2025)
// React Native StyleSheet: (React Native, 2026)

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import type { Chart } from '@/services/types';

interface ChartProps {
    chart: Chart;
}

const screenWidth = Dimensions.get('window').width;

export default function ChartComponent({ chart }: ChartProps) {
    const { title, labels, datasets } = chart;

    // Prepare data for react-native-chart-kit
    const chartData = {
        labels: labels,
        datasets: datasets.map(dataset => ({
            data: dataset.data,
            color: (opacity = 1) => dataset.label === 'Items Rescued'
                ? `rgba(76, 175, 80, ${opacity})`  // Green for rescued
                : `rgba(33, 150, 243, ${opacity})`, // Blue for listed
            strokeWidth: 2
        })),
        legend: datasets.map(d => d.label)
    };

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 8
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2'
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <LineChart
                data={chartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withInnerLines={false}
                withOuterLines={true}
                withVerticalLines={false}
                withHorizontalLines={true}
            />

            {/* Legend */}
            <View style={styles.legend}>
                {datasets.map((dataset, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[
                            styles.legendColor,
                            { backgroundColor: dataset.label === 'Items Rescued' ? '#4CAF50' : '#2196F3' }
                        ]} />
                        <Text style={styles.legendText}>{dataset.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center'
    },
    chart: {
        marginVertical: 8,
        borderRadius: 8
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
        gap: 16
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 2
    },
    legendText: {
        fontSize: 12,
        color: '#666'
    }
});

