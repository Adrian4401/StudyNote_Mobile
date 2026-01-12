import { API_URLS } from './urls';

interface LoginParams {
    email: string;
    password: string;
}

interface RegisterParams {
    username: string;
    email: string;
    password: string;
}

export async function login({ email, password }: LoginParams) {
    const response = await fetch(API_URLS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    console.log('status:', response.status);
    const text = await response.text();
    console.log('response text:', text);

    if (!response.ok) throw new Error(`Login failed: ${response.status}`);
    
    return JSON.parse(text);
}

export async function register({ username, email, password }: RegisterParams) {
    const response = await fetch(API_URLS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    console.log('status:', response.status);
    const text = await response.text();
    console.log('response text:', text);

    if (!response.ok) throw new Error(`Registration failed: ${response.status}`);

    return JSON.parse(text);
}