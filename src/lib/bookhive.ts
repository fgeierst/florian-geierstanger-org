// Stable DID for kinoauge.bsky.social; the PDS is resolved on every build.
export const BOOKHIVE_DID = "did:plc:y3zkcheff6qz7jnyftttet2f";

export interface FinishedBook {
  authors: string;
  title: string;
  finishedAt?: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function getJson(url: URL, fetcher: typeof fetch): Promise<unknown> {
  for (let attempt = 0; attempt < 3; attempt++) {
    let response: Response;
    try {
      response = await fetcher(url, { signal: AbortSignal.timeout(15_000) });
    } catch (error) {
      if (attempt === 2) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
      continue;
    }

    if (response.ok) return response.json();
    if (attempt === 2 || (response.status !== 429 && response.status < 500)) {
      throw new Error(`BookHive fetch failed: ${url.pathname} (HTTP ${response.status})`);
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
  }
  throw new Error("BookHive fetch failed after retries");
}

export function formatFinishedDate(finishedAt: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "Europe/Berlin",
  }).format(new Date(finishedAt));
}

export async function getFinishedBooks(fetcher: typeof fetch = fetch): Promise<FinishedBook[]> {
  const document = await getJson(new URL(`https://plc.directory/${BOOKHIVE_DID}`), fetcher);
  if (!isObject(document) || document.id !== BOOKHIVE_DID || !Array.isArray(document.service)) {
    throw new Error("Invalid AT Protocol DID document");
  }
  const service = document.service.find(
    (entry) =>
      isObject(entry) &&
      (entry.id === "#atproto_pds" || entry.id === `${BOOKHIVE_DID}#atproto_pds`) &&
      entry.type === "AtprotoPersonalDataServer",
  );
  if (!isObject(service) || typeof service.serviceEndpoint !== "string") {
    throw new Error("No PDS found in AT Protocol DID document");
  }
  const pds = new URL(service.serviceEndpoint);
  if (pds.protocol !== "https:") throw new Error("The PDS must use HTTPS");

  const books: FinishedBook[] = [];
  const seenRecords = new Set<string>();
  const seenCursors = new Set<string>();
  let cursor: string | undefined;
  do {
    const url = new URL("/xrpc/com.atproto.repo.listRecords", pds);
    url.search = new URLSearchParams({
      repo: BOOKHIVE_DID,
      collection: "buzz.bookhive.book",
      limit: "100",
      ...(cursor ? { cursor } : {}),
    }).toString();
    const page = await getJson(url, fetcher);
    if (
      !isObject(page) ||
      !Array.isArray(page.records) ||
      (page.cursor !== undefined && typeof page.cursor !== "string")
    ) {
      throw new Error("Invalid BookHive records response");
    }

    for (const record of page.records) {
      if (!isObject(record) || typeof record.uri !== "string" || !isObject(record.value)) {
        throw new Error("Invalid BookHive record");
      }
      if (seenRecords.has(record.uri)) continue;
      seenRecords.add(record.uri);
      const value = record.value;
      if (value.status !== "buzz.bookhive.defs#finished") continue;
      if (
        typeof value.title !== "string" ||
        !value.title.trim() ||
        typeof value.authors !== "string" ||
        !value.authors.trim()
      ) {
        throw new Error(`BookHive book has no title or authors: ${record.uri}`);
      }
      books.push({
        authors: value.authors
          .split("\t")
          .map((author) => author.trim())
          .filter(Boolean)
          .join(", "),
        title: value.title.trim(),
        finishedAt:
          typeof value.finishedAt === "string" && Number.isFinite(Date.parse(value.finishedAt))
            ? value.finishedAt
            : undefined,
      });
    }

    cursor = page.cursor as string | undefined;
    if (cursor) {
      if (seenCursors.has(cursor)) throw new Error("BookHive pagination cursor repeated");
      seenCursors.add(cursor);
    }
  } while (cursor);

  return books.sort((a, b) => {
    if (a.finishedAt && b.finishedAt) {
      const difference = Date.parse(b.finishedAt) - Date.parse(a.finishedAt);
      if (difference) return difference;
    } else if (a.finishedAt || b.finishedAt) {
      return a.finishedAt ? -1 : 1;
    }
    return `${a.authors}: ${a.title}`.localeCompare(`${b.authors}: ${b.title}`, "de");
  });
}
