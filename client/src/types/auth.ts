export interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    created_at: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}