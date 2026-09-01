import bcrypt from 'bcryptjs';
// ソルトの回数
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

// 平文パスワードをハッシュ化する
export async function hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
}

// 平文パスワードとDB保存済みハッシュを比較する
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
}
