// AI-generated chart display component
// Renders bar, line, or pie charts based on AI config
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import type { ChartConfig } from '@/services/types';

interface ChartProps {
    chartConfig: ChartConfig;
}

const screenWidth = Dimensions.get('window').width;

export default function Chart({ chartConfig }: ChartProps) {
    const { type, title, labels, values, colors, description } = chartConfig;

    const chartData = {
        labels: labels,
        datasets: [{
            data: values
        }]
    };

    const chartStyle = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 8
        }
    };

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return (
                    <BarChart
                        data={chartData}
                        width={screenWidth - 64}
                        height={220}
                        chartConfig={chartStyle}
                        verticalLabelRotation={0}
                        showValuesOnTopOfBars
                        fromZero
                        style={styles.chart}
                    />
                );

            case 'line':
                return (
                    <LineChart
                        data={chartData}
                        width={screenWidth - 64}
                        height={220}
                        chartConfig={chartStyle}
                        bezier
                        style={styles.chart}
                    />
                );

            case 'pie':
                const pieData = labels.map((label, index) => ({
                    name: label,
                    population: values[index],
                    color: colors[index] || '#000000',
                    legendFontColor: '#333',
                    legendFontSize: 12
                }));

                return (
                    <PieChart
                        data={pieData}
                        width={screenWidth - 64}
                        height={220}
                        chartConfig={chartStyle}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                        style={styles.chart}
                    />
                );

            default:
                return <Text>Unsupported chart type</Text>;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {renderChart()}
            <Text style={styles.description}>{description}</Text>
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
    description: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 18
    }
});