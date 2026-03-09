import { getDb } from "./index";

export async function getPageViewStats(days: number = 30) {
  const sql = getDb();
  return sql`
    SELECT
      DATE(created_at AT TIME ZONE 'America/Chicago') as date,
      COUNT(*) as views,
      COUNT(DISTINCT visitor_id) as visitors
    FROM page_views
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
    GROUP BY DATE(created_at AT TIME ZONE 'America/Chicago')
    ORDER BY date DESC
  `;
}

export async function getTopPages(days: number = 30) {
  const sql = getDb();
  return sql`
    SELECT
      path,
      COUNT(*) as views,
      COUNT(DISTINCT visitor_id) as visitors
    FROM page_views
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
    GROUP BY path
    ORDER BY views DESC
    LIMIT 10
  `;
}

export async function getTotalStats(days: number = 30) {
  const sql = getDb();
  const result = await sql`
    SELECT
      COUNT(*) as total_views,
      COUNT(DISTINCT visitor_id) as total_visitors
    FROM page_views
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
  `;
  return result[0];
}

export async function getTodayStats() {
  const sql = getDb();
  const result = await sql`
    SELECT
      COUNT(*) as views,
      COUNT(DISTINCT visitor_id) as visitors
    FROM page_views
    WHERE DATE(created_at AT TIME ZONE 'America/Chicago') = CURRENT_DATE
  `;
  return result[0];
}

export async function getRecentSubmissions(limit: number = 20) {
  const sql = getDb();
  return sql`
    SELECT * FROM form_submissions
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}

export async function getSubmissionCount() {
  const sql = getDb();
  const result = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE NOT is_read) as unread
    FROM form_submissions
  `;
  return result[0];
}

export async function markSubmissionRead(id: number) {
  const sql = getDb();
  await sql`UPDATE form_submissions SET is_read = TRUE WHERE id = ${id}`;
}

export async function getViewsPerDay(days: number = 14) {
  const sql = getDb();
  return sql`
    SELECT
      DATE(created_at AT TIME ZONE 'America/Chicago') as date,
      COUNT(*) as views
    FROM page_views
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
    GROUP BY DATE(created_at AT TIME ZONE 'America/Chicago')
    ORDER BY date ASC
  `;
}

export async function getReferrerStats(days: number = 30) {
  const sql = getDb();
  return sql`
    SELECT
      COALESCE(referrer, 'Direct') as referrer,
      COUNT(*) as views
    FROM page_views
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
    GROUP BY referrer
    ORDER BY views DESC
    LIMIT 10
  `;
}
