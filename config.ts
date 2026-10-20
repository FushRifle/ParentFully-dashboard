const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const BASE_URL = (configuredBaseUrl || 'https://production-api.parentfullyapp.com/api').replace(/\/$/, '');

export const API_ORIGIN = BASE_URL.replace(/\/api$/, '');
export const API_V2_BASE_URL = `${BASE_URL}/v2`;
export const USER_PICTURE_BASE_URL = `${API_ORIGIN}/storage/profiles/profile_images/`;
