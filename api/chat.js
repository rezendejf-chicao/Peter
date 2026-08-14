module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST." });
    return;
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY nao configurada." });
    return;
  }

  try {
    // Le o corpo da requisicao de forma robusta.
    let raw = "";
    await new Promise((resolve) => {
      req.on("data", (c) => { raw += c; });
      req.on("end", resolve);
    });
    let body = {};
    try { body = raw ? JSON.parse(raw) : (req.body || {}); }
    catch (e) { body = req.body || {}; }

    const { model, max_tokens, system, messages } = body;
    const wantsSonnet = typeof model === "string" && model.toLowerCase().indexOf("sonnet") >= 0;
    const resolvedModel = wantsSonnet ? "claude-sonnet-4-5" : "claude-haiku-4-5";

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: resolvedModel,
        max_tokens: max_tokens || 700,
        system: system || "",
        messages: messages || []
      })
    });

    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: (data && data.error && data.error.message) || "Erro na API." });
      return;
    }

    const text = (data.content || []).map((b) => b.text || "").join("").trim();
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
