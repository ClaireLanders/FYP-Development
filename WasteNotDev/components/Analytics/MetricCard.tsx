// description
// references as i go
// TODO: compare to in-class one, references, description


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

// TODO: SIMPLIFY !!

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

// References
// React Native. (2025). StyleSheet. Retrieved from reactnative.dev