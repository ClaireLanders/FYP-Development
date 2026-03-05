// Presentational component for the AI analytics chat interface
// Renders a scrollable message history and a text input with a send button.
// Accepts all state and handlers as props from AnalyticsView.
//
// React Native TextInput, TouchableOpacity, ScrollView: (React Native, 2025)
// React Native StyleSheet: (React Native, 2026)
// React Native ActivityIndicator used to show loading state while awaiting AI response.
import React from 'react';
import { View,Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import type { ChatMessage } from '@/services/types';

interface AIChatProps {
    messages: ChatMessage[];
    question: string;
    onQuestionChange: (text: string) => void;
    onSend: () => void;
    loading: boolean;
}

export default function AIChat({
    messages,
    question,
    onQuestionChange,
    onSend,
    loading
}: AIChatProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ask About Your Data</Text>

            {/* Messages + chat history */}
            <ScrollView style={styles.messagesContainer}>
                {messages.map((msg, index) => (
                    <View key={index} style={styles.messageContainer}>
                        <View style={styles.questionBubble}>
                            <Text style={styles.questionText}>{msg.question}</Text>
                        </View>
                        <View style={styles.answerBubble}>
                            <Text style={styles.answerText}>{msg.answer}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* input section */}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={question}
                    onChangeText={onQuestionChange}
                    placeholder="Ask a question about your data..."
                    placeholderTextColor="#999"
                    multiline
                    editable={!loading}
                />
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!question.trim() || loading) && styles.sendButtonDisabled
                    ]}
                    onPress={onSend}
                    disabled={!question.trim() || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.sendButtonText}>Send</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16
    },

    messagesContainer: {
        flex: 1,
        minHeight: 100,
        maxHeight: 400,
        marginBottom: 12
    },
    messageContainer: {
        marginBottom: 16
    },

    questionBubble: {
        backgroundColor: '#E3F2FD',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        alignSelf: 'flex-end',
        maxWidth: '80%'
    },
    questionText: {
        fontSize: 14,
        color: '#333'
    },
    answerBubble: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
        maxWidth: '95%',
        flexShrink: 1,
    },
    answerText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#333',
        maxHeight: 100
    },
    sendButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        minWidth: 60,
        alignItems: 'center'
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc'
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    }
});



