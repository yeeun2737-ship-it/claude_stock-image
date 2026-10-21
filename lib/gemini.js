const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export async function callGemini(model, body) {
  const res = await fetch(`${BASE}/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Gemini 요청 실패 (${res.status})`);
  return data;
}

export const IMAGE_MODEL = () => process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-lite-image";
export const TEXT_MODEL = () => process.env.GEMINI_TEXT_MODEL || "gemini-3.5-flash-lite";
