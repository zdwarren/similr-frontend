// chatAPI.tsx

import { fetchWithAuth } from './helper';

const base_url = 'http://localhost:8000/api/chats/'

interface Chat {
    id: string;
    avatarUrl: string;
    userName: string;
    lastMessage: {
        content: string;
    };
}

interface ChatDetails {
    userName: string;
    avatarUrl: string;
}

interface Message {
    sender: {
        avatarUrl: string;
        userName: string;
    };
    content: string;
}

interface SendMessagePayload {
    content: string;
}

async function fetchChats(): Promise<Chat[]> {
    const response = await fetchWithAuth(base_url);
    return response.json();
}

async function fetchChatDetails(chatId: string): Promise<ChatDetails> {
    const response = await fetchWithAuth(`${base_url}${chatId}/`);
    return response.json();
}

async function fetchChatMessages(chatId: string): Promise<Message[]> {
    const response = await fetchWithAuth(`${base_url}${chatId}/messages/`);
    return response.json();
}

async function fetchAIInsights(chatId: string): Promise<any> {
    const response = await fetchWithAuth(`${base_url}${chatId}/ai-insights/`);
    return response.json();
}

async function sendChatMessage(chatId: string, message: string): Promise<any> {
    const response = await fetchWithAuth(`${base_url}${chatId}/messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message } as SendMessagePayload),
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    return response.json();
}

export { fetchChats, fetchChatDetails, fetchChatMessages, fetchAIInsights, sendChatMessage };
