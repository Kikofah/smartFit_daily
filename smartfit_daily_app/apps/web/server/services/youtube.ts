/**
 * REC-1/REC-4 (routes/content-recommendation) — thin wrapper around the
 * YouTube Data API v3's search.list + videos.list, the external boundary
 * named in high-level-architecture.md §6.1. Candidates are handed to
 * services/videoRecommender.ts for the actual match/ranking decision.
 */

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YoutubeCandidate {
  externalVideoId: string;
  title: string;
  description: string;
  durationMinutes: number;
}

/** Parses an ISO-8601 duration (e.g. "PT25M13S", "PT1H5M") into whole minutes. */
function parseIsoDurationToMinutes(iso: string): number {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  const hours = Number(match?.[1] ?? 0);
  const minutes = Number(match?.[2] ?? 0);
  const seconds = Number(match?.[3] ?? 0);
  return Math.round(hours * 60 + minutes + seconds / 60);
}

interface SearchListResponse {
  items: { id: { videoId: string }; snippet: { title: string; description: string } }[];
}

interface VideosListResponse {
  items: { id: string; contentDetails: { duration: string }; status: { embeddable: boolean } }[];
}

/**
 * Searches YouTube for workout videos matching `query`, excluding any video
 * ID in `excludeIds` (already shown to this user today — see REC-3/PLN-3's
 * "reject and re-match" flow). `videoDuration: medium` (4-20 min) keeps
 * results in a realistic workout-length range.
 */
export async function searchWorkoutVideos(query: string, excludeIds: string[] = []): Promise<YoutubeCandidate[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error('YOUTUBE_API_KEY is not configured.');

  const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
  searchUrl.searchParams.set('key', apiKey);
  searchUrl.searchParams.set('part', 'snippet');
  searchUrl.searchParams.set('q', query);
  searchUrl.searchParams.set('type', 'video');
  searchUrl.searchParams.set('videoDuration', 'medium');
  searchUrl.searchParams.set('maxResults', '15');
  searchUrl.searchParams.set('safeSearch', 'strict');

  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) throw new Error(`YouTube search failed (${searchRes.status}).`);
  const searchBody = (await searchRes.json()) as SearchListResponse;

  const videoIds = searchBody.items.map((item) => item.id.videoId).filter((id) => !excludeIds.includes(id));
  if (videoIds.length === 0) return [];

  const detailsUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
  detailsUrl.searchParams.set('key', apiKey);
  detailsUrl.searchParams.set('part', 'contentDetails,status');
  detailsUrl.searchParams.set('id', videoIds.join(','));

  const detailsRes = await fetch(detailsUrl);
  if (!detailsRes.ok) throw new Error(`YouTube videos.list failed (${detailsRes.status}).`);
  const detailsBody = (await detailsRes.json()) as VideosListResponse;
  // Exclude videos the owner disabled embedding on — Gemini has no way to
  // infer this from title/description, so it must be filtered here, not
  // left to the ranking prompt (see WorkoutSessionScreen's iframe embed).
  const embeddableDurationById = new Map(
    detailsBody.items
      .filter((item) => item.status.embeddable)
      .map((item) => [item.id, parseIsoDurationToMinutes(item.contentDetails.duration)]),
  );

  return searchBody.items
    .filter((item) => embeddableDurationById.has(item.id.videoId))
    .map((item) => ({
      externalVideoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      durationMinutes: embeddableDurationById.get(item.id.videoId)!,
    }));
}
