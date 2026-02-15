// Generate Chart button component
// Triggers AI chart generation when clicked
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface GenerateChartButtonProps {
    onPress: () => void;
    loading: boolean;
}

export default function GenerateChartButton({ onPress, loading }: GenerateChartButtonProps) {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.buttonText}>
                    Generate Chart with AI
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 16,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    }
});