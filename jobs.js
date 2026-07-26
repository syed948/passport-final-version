// Vercel serverless function — proxies the Groq call so the API key
// stays on the server side and is never exposed to the browser.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { place, role, count = 6 } = req.body || {};
  if (!place || !role) {
    return res.status(400).json({ error: "Missing place or role" });
  }

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "GROQ_API_KEY env variable not set on the server" });
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + key
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.8,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You generate realistic, representative frontline job openings for a hiring platform. Respond ONLY with valid JSON, no prose."
          },
          {
            role: "user",
            content: `Generate ${count} realistic ${role} job openings currently plausible near ${place}. Use believable local employer names (stores, hotels, hospitals, warehouses, facilities typical of that area). Vary pay, shift and distance. Do not mention any job board or source. Return JSON exactly in this shape: {"jobs":[{"title":"","employer":"","pay":"$xx-$xx/hr or local currency","shift":"e.g. Night shift / Weekends / Full-time days","distance":"x.x mi away or km","type":"Full-time|Part-time|Flexible","posted":"e.g. 2 days ago"}]}`
          }
        ]
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return res.status(groqRes.status).json({ error: "Groq: " + errText.slice(0, 200) });
    }

    const data = await groqRes.json();
    const text = data.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(text);
    return res.status(200).json({ jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [] });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Failed" });
  }
}
