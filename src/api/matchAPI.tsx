// matchAPI.tsx
import { fetchWithAuth, keysToCamel } from './helper';

const match_url = 'http://localhost:8000/api/matches/';

interface Match {
    id: string;
    userId: string;
    matchedUserId: string;
    matchedUsername: string;
    rating: null | number;
    matchedRating: null | number;
    aiMatchScore: number;
    aiMatchSummary: string;
    aiDateSuggested: string | null;
    aiMatchedTime: string;
    feedback: string | null;
    matchedFeedback: string | null;
    responseTime: string | null;
    matchedResponseTime: string | null;
    chatStartedTime: string | null;
}

async function fetchMatches(): Promise<Match[]> {
    const response = await fetchWithAuth(match_url);
    const data = await response.json();
    return keysToCamel(data);
}

async function fetchMatch(matchId: string): Promise<Match> {
    const response = await fetchWithAuth(`${match_url}${matchId}/`);
    const data = await response.json();
    return keysToCamel(data);
}

async function submitMatchResponse(matchId: string, isMatch: boolean, rating: number | null, feedback: string): Promise<void> {
    const url = `${match_url}${matchId}/response/`;
    const body = {
        isMatch,
        rating,
        feedback
    };

    const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error('Response not OK');
    }
}


async function initiateChat(userId: string): Promise<string> {
    const response = await fetchWithAuth(`http://localhost:8000/api/chats/initiate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
        throw new Error('Failed to initiate chat');
    }

    const data = await response.json();
    return data.chat_id;
}

// Add initiateChat to the exports of matchAPI.ts
export { fetchMatches, fetchMatch, submitMatchResponse, initiateChat };
export type { Match };
