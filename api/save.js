module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST." });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    res.status(500).json({ error: "SUPABASE_URL ou SUPABASE_SERVICE_KEY nao configuradas." });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body || "{}");
    if (!body) body = {};

    const row = {
      name: String(body.name || "").slice(0, 200),
      email: String(body.email || "").slice(0, 200),
      scenario: String(body.scenario || "").slice(0, 120),
      messages: body.messages || [],
      debrief: String(body.debrief || "")
    };

    const r = await fetch(url.replace(/\/$/, "") + "/rest/v1/sessions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "apikey": key,
        "authorization": "Bearer " + key,
        "prefer": "return=minimal"
      },
      body: JSON.stringify(row)
    });

    if (!r.ok) {
      const t = await r.text();
      res.status(r.status).json({ error: "Supabase: " + t });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
