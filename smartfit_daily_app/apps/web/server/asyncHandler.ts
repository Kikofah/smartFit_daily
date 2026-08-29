import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Express 4 (unlike 5) does not automatically catch a rejected promise
 * returned by an async route handler — it becomes an unhandled rejection
 * that crashes the whole Node process, not just a failed request. Wrap
 * every async handler with this so errors reach the error-handling
 * middleware in server/index.ts instead.
 *
 * Generic over route params (P) because wrapping a handler this way loses
 * Express's usual literal-path-to-params-type inference — routes with
 * dynamic segments (e.g. '/planner/days/:date') need the shape passed
 * explicitly: asyncHandler<{ date: string }>(async (req, res) => ...).
 * Omitting it (the common case — no dynamic segment) defaults to no params.
 */
export function asyncHandler<P = Record<string, never>, ResBody = unknown, ReqBody = unknown>(
  fn: (req: Request<P, ResBody, ReqBody>, res: Response<ResBody>, next: NextFunction) => Promise<unknown>,
): RequestHandler<P, ResBody, ReqBody> {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
