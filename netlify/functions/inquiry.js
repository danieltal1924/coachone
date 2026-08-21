export async function handler(event) {
  const URL = process.env.SUPABASE_URL;
  const KEY = process.env.SUPABASE_SERVICE_KEY;
  const headers = {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal"
  };
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: cors, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: "Method not allowed" };
  }

  try {
    const b = JSON.parse(event.body || "{}");
    const row = {
      coach_id: b.coach_id,
      player_name: b.player_name,
      player_phone: b.player_phone,
      details: b.details
    };
    const res = await fetch(`${URL}/rest/v1/inquiries`, {
      method: "POST",
      headers,
      body: JSON.stringify(row)
    });
    if (!res.ok) {
      const t = await res.text();
      return { statusCode: 500, headers: cors, body: JSON.stringify({ error: t }) };
    }
    return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: err.message }) };
  }
}
