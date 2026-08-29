import type { Request, Response, NextFunction } from 'express';
import { auth } from '../firebaseAdmin';

declare global {
  // This augments Express's own Request type — the standard pattern for it, not a stray namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Replaces the automatic `request.auth.uid` that Firebase Cloud Functions'
 * onCall() used to provide — Express has to verify the ID token itself.
 * The client sends it as `Authorization: Bearer <idToken>` (see
 * client/src/services/api.ts).
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Sign in required.' });
  }

  try {
    const decoded = await auth.verifyIdToken(header.slice('Bearer '.length));
    req.userId = decoded.uid;
    next();
  } catch (e) {
    console.error('verifyIdToken failed:', e);
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
}
