/**
 * In-memory stand-in for server/firebaseAdmin.ts, used by route tests via
 * `vi.mock('<path>/firebaseAdmin', () => import('<path>/test/fakeFirebase'))`.
 *
 * Implements only the slice of the Firestore/Auth Admin SDK the routes
 * actually call (doc get/set/delete, collection get/doc/where/orderBy/limit,
 * verifyIdToken, getUserByEmail, generatePasswordResetLink) — it is not a
 * general emulator, and it doesn't evaluate firestore.rules (the Admin SDK
 * bypasses rules anyway).
 */
type Data = Record<string, unknown>;

const store = new Map<string, Data>();
let autoIdCounter = 0;

function isPlainObject(value: unknown): value is Data {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Firestore's `{ merge: true }` deep-merges nested maps; arrays and scalars are replaced. */
function deepMerge(target: Data, source: Data): Data {
  const result: Data = { ...target };
  for (const [key, value] of Object.entries(source)) {
    result[key] = isPlainObject(value) && isPlainObject(result[key]) ? deepMerge(result[key] as Data, value) : value;
  }
  return result;
}

function snapshot(path: string) {
  const data = store.get(path);
  return {
    id: path.split('/').pop()!,
    exists: data !== undefined,
    data: () => (data === undefined ? undefined : structuredClone(data)),
  };
}

function docRef(path: string) {
  return {
    id: path.split('/').pop()!,
    path,
    get: async () => snapshot(path),
    set: async (data: Data, options?: { merge?: boolean }) => {
      if (Object.values(data).some((v) => v === undefined)) {
        // Mirrors the real Admin SDK without ignoreUndefinedProperties.
        throw new Error(`Cannot use "undefined" as a Firestore value (${path}).`);
      }
      const existing = store.get(path);
      store.set(path, options?.merge && existing ? deepMerge(existing, data) : structuredClone(data));
    },
    delete: async () => {
      store.delete(path);
    },
  };
}

type Filter = { field: string; op: '>=' | '<=' | '=='; value: unknown };

function query(collectionPath: string, filters: Filter[] = [], order?: { field: string; dir: 'asc' | 'desc' }, max?: number) {
  return {
    where: (field: string, op: Filter['op'], value: unknown) =>
      query(collectionPath, [...filters, { field, op, value }], order, max),
    orderBy: (field: string, dir: 'asc' | 'desc' = 'asc') => query(collectionPath, filters, { field, dir }, max),
    limit: (n: number) => query(collectionPath, filters, order, n),
    get: async () => {
      const prefix = `${collectionPath}/`;
      let paths = [...store.keys()].filter((p) => p.startsWith(prefix) && !p.slice(prefix.length).includes('/'));
      paths = paths.filter((p) =>
        filters.every(({ field, op, value }) => {
          const v = store.get(p)![field] as never;
          return op === '==' ? v === value : op === '>=' ? v >= (value as never) : v <= (value as never);
        }),
      );
      if (order) {
        paths.sort((a, b) => {
          const va = store.get(a)![order.field] as never;
          const vb = store.get(b)![order.field] as never;
          const cmp = va < vb ? -1 : va > vb ? 1 : 0;
          return order.dir === 'asc' ? cmp : -cmp;
        });
      }
      if (max !== undefined) paths = paths.slice(0, max);
      return { docs: paths.map(snapshot), empty: paths.length === 0, size: paths.length };
    },
  };
}

export const db = {
  doc: (path: string) => docRef(path),
  collection: (path: string) => ({
    ...query(path),
    doc: (id?: string) => docRef(`${path}/${id ?? `auto_${++autoIdCounter}`}`),
  }),
};

interface FakeUser {
  uid: string;
  email: string;
  providerData: { providerId: string }[];
}

const idTokens = new Map<string, string>(); // idToken -> uid
const users = new Map<string, FakeUser>(); // email -> user

export const auth = {
  verifyIdToken: async (token: string) => {
    const uid = idTokens.get(token);
    if (!uid) throw new Error('auth/argument-error');
    return { uid };
  },
  getUserByEmail: async (email: string) => {
    const user = users.get(email);
    if (!user) throw new Error('auth/user-not-found');
    return user;
  },
  generatePasswordResetLink: async (email: string) => `https://example.test/reset?email=${encodeURIComponent(email)}`,
};

/** Test-only helpers (not part of the real firebaseAdmin module's surface). */
export const fake = {
  reset() {
    store.clear();
    idTokens.clear();
    users.clear();
    autoIdCounter = 0;
  },
  seed(path: string, data: Data) {
    store.set(path, structuredClone(data));
  },
  read(path: string): Data | undefined {
    const data = store.get(path);
    return data === undefined ? undefined : structuredClone(data);
  },
  paths(prefix: string): string[] {
    return [...store.keys()].filter((p) => p.startsWith(prefix));
  },
  addIdToken(token: string, uid: string) {
    idTokens.set(token, uid);
  },
  addUser(email: string, providerId: 'password' | 'google.com' | 'apple.com') {
    users.set(email, { uid: `uid_${email}`, email, providerData: [{ providerId }] });
  },
};
