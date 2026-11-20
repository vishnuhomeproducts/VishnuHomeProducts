/**
 * Turso Database Client (LibSQL over HTTP Pipeline)
 * 
 * Benefits over Supabase for Vishnu Home Products:
 * 1. 1,000,000,000 (1 Billion) row reads / month on the FREE tier.
 * 2. Never pauses after 7 days of inactivity (unlike Supabase).
 * 3. Zero connection pooling bottlenecks (communicates over lightweight HTTP/HTTPS pipelines).
 * 4. Zero npm dependencies (uses native fetch).
 */

const TURSO_URL = process.env.TURSO_DATABASE_URL || '';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || '';

export function isTursoConfigured(): boolean {
  return (
    Boolean(TURSO_URL) &&
    !TURSO_URL.includes('placeholder') &&
    Boolean(TURSO_AUTH_TOKEN) &&
    !TURSO_AUTH_TOKEN.includes('placeholder')
  );
}

/**
 * Execute raw SQL query against Turso LibSQL HTTP API
 */
export async function executeTursoQuery(sql: string, args: any[] = []): Promise<any> {
  if (!isTursoConfigured()) {
    throw new Error('Turso is not configured');
  }

  // Convert libsql:// to https://
  const httpUrl = TURSO_URL.replace('libsql://', 'https://').replace(/\/$/, '') + '/v2/pipeline';

  const namedArgs = args.map((arg) => {
    if (arg === null || arg === undefined) return { type: 'null' };
    if (typeof arg === 'number') {
      return Number.isInteger(arg) ? { type: 'integer', value: String(arg) } : { type: 'float', value: arg };
    }
    if (typeof arg === 'boolean') return { type: 'integer', value: arg ? '1' : '0' };
    return { type: 'text', value: String(arg) };
  });

  const body = {
    requests: [
      {
        type: 'execute',
        stmt: {
          sql,
          args: namedArgs,
        },
      },
      { type: 'close' },
    ],
  };

  const response = await fetch(httpUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TURSO_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Turso HTTP Error (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  const firstResult = json.results?.[0];

  if (firstResult?.type === 'error') {
    throw new Error(`Turso Query Error: ${firstResult.error?.message}`);
  }

  const responseResponse = firstResult?.response?.result;
  if (!responseResponse) return [];

  const columns: string[] = responseResponse.cols?.map((c: any) => c.name) || [];
  const rows: any[] = responseResponse.rows || [];

  return rows.map((row: any[]) => {
    const rowObj: Record<string, any> = {};
    columns.forEach((col, idx) => {
      rowObj[col] = row[idx]?.value ?? null;
    });
    return rowObj;
  });
}
