import { CONFIG } from '../config/config';

export const API_URLS = {
    AUTH: {
        LOGIN: `${CONFIG.API_URL}/auth/login`,
        REGISTER: `${CONFIG.API_URL}/auth/register`,
    }
}