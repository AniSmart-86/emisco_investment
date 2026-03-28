import * as jose from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-emisco-demo';
const secret = new TextEncoder().encode(JWT_SECRET);

export interface JwtPayload {
  id: string;
  role: string;
}

export const signToken = async (payload: JwtPayload) => {
  return await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
};

export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as unknown as JwtPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
