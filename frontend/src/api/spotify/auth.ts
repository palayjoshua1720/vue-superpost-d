import axios from 'axios';

export const getAccessTokenFromUrl = (): string | null => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    return token;
};
