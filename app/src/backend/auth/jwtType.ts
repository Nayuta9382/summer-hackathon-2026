import { JWTPayload } from 'jose';

// jwtのペイロード
export interface SessionPayload extends JWTPayload {
    userId: number;
    userName: string;
}
