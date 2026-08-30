/**
 * One-off dev script — inserts sample `weightRecords` for an EXISTING user
 * (identified by Firebase Auth UID), to exercise GET /insights/weight-records
 * and the Progress screen's trend chart without waiting on real INT-2 sync.
 *
 * Uses firebase-admin (unlike scripts/seedSampleUsers.ts, which used the
 * client SDK because no admin credentials were configured at the time —
 * apps/web/.env now has GOOGLE_APPLICATION_CREDENTIALS set, so this can
 * write directly instead of needing to sign in as the user first.
 *
 * Run from smartfit_daily_app/apps/web:
 *   npx tsx scripts/seedWeightRecords.ts <userId>
 */
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') });

import { db } from '../server/firebaseAdmin';
import type { WeightRecordSource } from '@smartfit/shared-types';

const userId = process.argv[2];
if (!userId) {
  console.error('Usage: npx tsx scripts/seedWeightRecords.ts <userId>');
  process.exit(1);
}

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const SAMPLE_RECORDS: { weightKg: number; recordedAt: string; source: WeightRecordSource }[] = [
  { weightKg: 70.5, recordedAt: daysAgoIso(20), source: 'manual' },
  { weightKg: 70.0, recordedAt: daysAgoIso(15), source: 'smart_scale_sync' },
  { weightKg: 69.4, recordedAt: daysAgoIso(10), source: 'manual' },
  { weightKg: 69.0, recordedAt: daysAgoIso(5), source: 'smart_scale_sync' },
  { weightKg: 68.5, recordedAt: daysAgoIso(0), source: 'manual' },
];

async function main() {
  console.log(`Seeding ${SAMPLE_RECORDS.length} weight records for user ${userId}...`);
  for (const record of SAMPLE_RECORDS) {
    await db.collection(`users/${userId}/weightRecords`).add(record);
    console.log(`  added ${record.weightKg}kg @ ${record.recordedAt.slice(0, 10)} (${record.source})`);
  }
  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
