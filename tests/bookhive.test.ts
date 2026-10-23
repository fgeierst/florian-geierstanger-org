import assert from "node:assert/strict";
import test from "node:test";
import { BOOKHIVE_DID, formatFinishedDate, getFinishedBooks } from "../src/lib/bookhive.ts";

const pds = "https://example.test";
const document = {
  id: BOOKHIVE_DID,
  service: [
    {
      id: `${BOOKHIVE_DID}#atproto_pds`,
      type: "AtprotoPersonalDataServer",
      serviceEndpoint: pds,
    },
  ],
};

function record(id: string, value: Record<string, unknown> = {}) {
  return {
    uri: `at://${BOOKHIVE_DID}/buzz.bookhive.book/${id}`,
    value: {
      title: id,
      authors: "Author",
      status: "buzz.bookhive.defs#finished",
      ...value,
    },
  };
}

function mockFetch(responses: unknown[]) {
  const calls: URL[] = [];
  const fetcher = (async (input: URL, init?: RequestInit) => {
    calls.push(new URL(input));
    assert.ok(init?.signal);
    assert.equal(init?.headers, undefined, "Public reads need no credentials");
    assert.ok(responses.length, "Unexpected extra fetch");
    const response = responses.shift();
    return response instanceof Response ? response : Response.json(response);
  }) as typeof fetch;
  return { fetcher, calls };
}

await test("fetches all pages from the resolved PDS, selecting only finished books", async () => {
  const { fetcher, calls } = mockFetch([
    document,
    {
      records: [
        record("Old", { finishedAt: "2023-12-24T00:00:00Z" }),
        record("Reading", { status: "buzz.bookhive.defs#reading" }),
        record("Queued", { status: "buzz.bookhive.defs#wantToRead" }),
        record("Abandoned", { status: "buzz.bookhive.defs#abandoned" }),
        record("Unknown", { status: "future-status" }),
      ],
      cursor: "page-2",
    },
    {
      records: [
        record("New", {
          authors: " First\tSecond ",
          title: " New ",
          finishedAt: "2026-10-18T07:54:10.551Z",
          cover: {},
          stars: 10,
          review: "Not displayed",
        }),
        record("Old", { finishedAt: "2023-12-24T00:00:00Z" }),
      ],
    },
  ]);

  assert.deepEqual(await getFinishedBooks(fetcher), [
    { authors: "First, Second", title: "New", finishedAt: "2026-10-18T07:54:10.551Z" },
    { authors: "Author", title: "Old", finishedAt: "2023-12-24T00:00:00Z" },
  ]);
  assert.equal(calls[0].href, `https://plc.directory/${BOOKHIVE_DID}`);
  assert.equal(calls[1].origin, pds);
  assert.equal(calls[1].pathname, "/xrpc/com.atproto.repo.listRecords");
  assert.equal(calls[1].searchParams.get("repo"), BOOKHIVE_DID);
  assert.equal(calls[1].searchParams.get("collection"), "buzz.bookhive.book");
  assert.equal(calls[1].searchParams.get("limit"), "100");
  assert.equal(calls[1].searchParams.has("cursor"), false);
  assert.equal(calls[2].searchParams.get("cursor"), "page-2");
});

await test("keeps missing and invalid dates last without using the import date", async () => {
  const { fetcher } = mockFetch([
    document,
    {
      records: [
        record("Undated Z", { createdAt: "2026-10-23T00:00:00Z" }),
        record("Invalid", { authors: "Beta", finishedAt: "invalid" }),
        record("Dated", { finishedAt: "2020-01-01T00:00:00Z" }),
        record("Undated A"),
      ],
    },
  ]);
  const books = await getFinishedBooks(fetcher);
  assert.deepEqual(
    books.map((book) => book.title),
    ["Dated", "Undated A", "Undated Z", "Invalid"],
  );
  assert.ok(books.slice(1).every((book) => book.finishedAt === undefined));
});

await test("formats German dates in Berlin consistently, including summer and winter", () => {
  assert.equal(formatFinishedDate("2026-10-18T07:54:10.551Z"), "18.10.2026");
  assert.equal(formatFinishedDate("2025-10-24T22:00:00.000Z"), "25.10.2025");
  assert.equal(formatFinishedDate("2024-01-05T23:00:00.000Z"), "6.1.2024");
});

await test("an empty library is valid", async () => {
  const { fetcher } = mockFetch([document, { records: [] }]);
  assert.deepEqual(await getFinishedBooks(fetcher), []);
});

await test("malformed pages and incomplete finished books fail instead of publishing partial data", async () => {
  for (const page of [
    {},
    { records: [], cursor: 42 },
    { records: [{ uri: "at://invalid", value: null }] },
    { records: [record("", { title: "" })] },
    { records: [record("No author", { authors: "" })] },
  ]) {
    const { fetcher } = mockFetch([document, page]);
    await assert.rejects(getFinishedBooks(fetcher), /Invalid BookHive|no title or authors/);
  }
});

await test("rejects invalid DID documents and insecure PDS endpoints", async () => {
  for (const invalidDocument of [
    {},
    { ...document, id: "did:plc:someone-else" },
    { ...document, service: [] },
    { ...document, service: [{ ...document.service[0], serviceEndpoint: "http://example.test" }] },
  ]) {
    const { fetcher } = mockFetch([invalidDocument]);
    await assert.rejects(getFinishedBooks(fetcher), /DID document|HTTPS/);
  }
});

await test("repeated cursors stop pagination", async () => {
  const { fetcher } = mockFetch([
    document,
    { records: [], cursor: "same" },
    { records: [], cursor: "same" },
  ]);
  await assert.rejects(getFinishedBooks(fetcher), /cursor repeated/);
});

await test("non-transient HTTP failures are not retried or treated as an empty library", async () => {
  const { fetcher, calls } = mockFetch([document, new Response("Forbidden", { status: 403 })]);
  await assert.rejects(getFinishedBooks(fetcher), /HTTP 403/);
  assert.equal(calls.length, 2);
});

await test("transient HTTP failures are retried", async () => {
  const { fetcher, calls } = mockFetch([
    document,
    new Response("Unavailable", { status: 503 }),
    { records: [] },
  ]);
  assert.deepEqual(await getFinishedBooks(fetcher), []);
  assert.equal(calls.length, 3);
});

await test("retry exhaustion fails the build", async () => {
  const { fetcher, calls } = mockFetch([
    document,
    ...Array.from({ length: 3 }, () => new Response("Unavailable", { status: 503 })),
  ]);
  await assert.rejects(getFinishedBooks(fetcher), /HTTP 503/);
  assert.equal(calls.length, 4);
});
