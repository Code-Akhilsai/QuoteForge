const DEFAULT_MODEL = "gemini-3.1-flash-lite-preview";

const cleanJson = (text) => {
  if (!text) return "";
  const trimmed = String(text).trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : trimmed).trim();
};

const requireApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error("GEMINI_API_KEY is not configured on the server.");
    err.status = 500;
    throw err;
  }
  return apiKey;
};

const generateJson = async ({ prompt, temperature = 0.2 }) => {
  const apiKey = requireApiKey();
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature, responseMimeType: "application/json" },
    }),
  });
  const raw = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = raw?.error?.message || `Gemini request failed (${response.status}).`;
    const err = new Error(message);
    err.status = response.status >= 400 && response.status < 500 ? response.status : 502;
    throw err;
  }
  const content = raw?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
  try {
    return JSON.parse(cleanJson(content));
  } catch {
    const err = new Error("AI returned an unreadable response. Please try again or edit manually.");
    err.status = 502;
    throw err;
  }
};

const num = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export async function extractRfqFromText(input) {
  const text = String(input || "").trim();
  if (!text) {
    const err = new Error("RFQ text is required.");
    err.status = 400;
    throw err;
  }
  if (text.length > 12000) {
    const err = new Error("RFQ text is too long. Please provide a shorter excerpt.");
    err.status = 400;
    throw err;
  }

  const prompt = `Extract RFQ (Request for Quotation) fields from the text below.
Return ONLY valid JSON (no markdown, no explanation) with exactly these keys:
{
  "customerName": string,
  "customerEmail": string,
  "customerPhone": string,
  "productName": string,
  "quantity": number,
  "priority": "low"|"medium"|"high",
  "deadline": "YYYY-MM-DD" or "",
  "estimatedValue": number,
  "notes": string
}
Rules:
- Use "" for unknown string fields and 0 for unknown numeric fields.
- quantity must be a positive integer when identifiable, else 1.
- priority defaults to "medium" if unclear.
- deadline must be ISO date YYYY-MM-DD if a date is present, else "".
- notes should capture any important requirements, material, tolerances, or delivery terms not in other fields.

RFQ text:
"""
${text}
"""`;

  const parsed = await generateJson({ prompt, temperature: 0.1 });
  const priority = ["low", "medium", "high"].includes(parsed?.priority) ? parsed.priority : "medium";
  const qty = num(parsed?.quantity, 1);
  return {
    customerName: String(parsed?.customerName || "").trim(),
    customerEmail: String(parsed?.customerEmail || "").trim(),
    customerPhone: String(parsed?.customerPhone || "").trim(),
    productName: String(parsed?.productName || "").trim(),
    quantity: Number.isFinite(qty) && qty > 0 ? Math.round(qty) : 1,
    priority,
    deadline: /^\d{4}-\d{2}-\d{2}$/.test(String(parsed?.deadline || "")) ? parsed.deadline : "",
    estimatedValue: Math.max(0, num(parsed?.estimatedValue, 0)),
    notes: String(parsed?.notes || "").trim(),
  };
}

export async function suggestCosting(context = {}) {
  const prompt = `You are a manufacturing cost estimation assistant for QuoteForge (Company A, Chakan, Pune).
Return ONLY valid JSON (no markdown) with exactly these keys:
{
  "scrapPercentage": number,
  "profitMarginPercentage": number,
  "materialQty": number,
  "operationHours": number,
  "reasoning": string
}
Rules:
- Suggestions are editable defaults, not final quotes.
- scrapPercentage 0-25, profitMarginPercentage 0-60, materialQty >= 0, operationHours >= 0.
- Base on context: quantity, product, materials/machines/rates if provided.
- Keep reasoning concise (1-3 sentences).

Context JSON:
${JSON.stringify(context).slice(0, 8000)}`;

  const parsed = await generateJson({ prompt, temperature: 0.2 });
  return {
    scrapPercentage: Math.min(25, Math.max(0, num(parsed?.scrapPercentage, 0))),
    profitMarginPercentage: Math.min(60, Math.max(0, num(parsed?.profitMarginPercentage, 0))),
    materialQty: Math.max(0, num(parsed?.materialQty, 0)),
    operationHours: Math.max(0, num(parsed?.operationHours, 0)),
    reasoning: String(parsed?.reasoning || "").trim(),
  };
}

export async function draftQuotation(context = {}) {
  const prompt = `Draft a professional customer-facing quotation summary for QuoteForge (Company A, Chakan, Pune).
Return ONLY valid JSON (no markdown) with exactly these keys:
{
  "subject": string,
  "body": string,
  "notes": string
}
Rules:
- Use the provided quotation data; do not invent prices, quantities, dates, or approvals.
- body should be ready to paste into an email (plain text, clear lines).
- Include quotation number, customer, product, quantity, unit/total cost, status/validity context if present.
- notes should mention that values are based on saved quotation data and should be reviewed before sending.

Quotation context JSON:
${JSON.stringify(context).slice(0, 10000)}`;

  const parsed = await generateJson({ prompt, temperature: 0.3 });
  return {
    subject: String(parsed?.subject || "Quotation from Company A, Chakan").trim(),
    body: String(parsed?.body || "").trim(),
    notes: String(parsed?.notes || "").trim(),
  };
}
