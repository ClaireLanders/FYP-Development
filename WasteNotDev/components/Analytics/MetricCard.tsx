// MetricCard.tsx
// Reusable card component for displaying a single analytics metric (US7 & US8).
// Accepts a title (e.g. "ITEMS RESCUED") and a value (number or string).
// Numbers are formatted with toLocaleString() for readability.
// React Native StyleSheet: (React Native, 2026)
// React Native View, Text: (React Native, 2025)


import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MetricCardProps {
    title: string;
    value: number | string;
}

export default function MetricCard({title, value}: MetricCardProps){
    return(
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>
                {typeof value === 'number' ? value.toLocaleString() : value}
            </Text>
        </View>
    );
}



const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    icon: {
        fontSize: 28,
        marginRight: 12
    },
    title: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    value: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333'
    },
    unit: {
        fontSize: 18,
        color: '#666',
        fontWeight: '500'
    }
});


