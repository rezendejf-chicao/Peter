module.exports = async (req, res) => {
  const pw = (req.query && req.query.pw) || "";
  const expected = process.env.TEACHER_PASSWORD;

  if (!expected) {
    res.status(500).json({ error: "TEACHER_PASSWORD nao configurada." });
    return;
  }
  if (pw !== expected) {
    res.status(401).json({ error: "Senha incorreta." });
    return;
  }

  const url = "https://twjmdvqkxibojoimgxrd.supabase.co";
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!key) {
    res.status(500).json({ error: "SUPABASE_SERVICE_KEY nao configurada." });
    return;
  }

  try {
    const r = await fetch(
      url + "/rest/v1/sessions?select=*&order=created_at.desc",
      {
        headers: {
          "apikey": key,
          "authorization": "Bearer " + key
        }
      }
    );
    if (!r.ok) {
      const t = await r.text();
      res.status(r.status).json({ error: "Supabase: " + t });
      return;
    }
    const sessions = await r.json();
    res.status(200).json({ sessions });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
