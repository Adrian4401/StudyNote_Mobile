import { CONFIG } from '../config/config';

interface LoginParams {
    email: string;
    password: string;
}

export async function login({ email, password }: LoginParams) {
    const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
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