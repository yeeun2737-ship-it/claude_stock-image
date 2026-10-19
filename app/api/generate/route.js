import { STYLES } from "../../../lib/styles";
import { checkAuth } from "../../../lib/auth";

export const maxDuration = 300;

// 키워드 + 그림체 → 서로 다른 소재 8개가 한 장에 모인 투명 배경 PNG 시트
export async function POST(request) {
  const auth = checkAuth(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });

  const { keywordEn, styleId, count = 8 } = await request.json();
  const style = STYLES.find((s) => s.id === styleId);
  if (!keywordEn || !style) return Response.json({ error: "키워드와 그림체를 선택해 주세요." }, { status: 400 });
  const n = Math.min(Math.max(Number(count) || 8, 6), 8);

  const prompt = [
    `A single sticker-sheet style illustration page containing exactly ${n} DIFFERENT objects related to the theme "${keywordEn}", arranged in a clean grid (4 columns x ${Math.ceil(n / 4)} rows).`,
    `Each object is a separate, distinct subject with generous empty space around it so every item can be cut out individually. Items must not touch or overlap each other.`,
    `Style: ${style.prompt}.`,
    `Consistent style and color harmony across all items, like one cohesive asset set for stock design elements.`,
    `Fully transparent background. No text, no letters, no watermark, no frame, no shadows on the ground.`,
  ].join(" ");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      prompt,
      size: "1536x1024",
      quality: "high",
      background: "transparent",
      output_format: "png",
      n: 1,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return Response.json({ error: data?.error?.message || "이미지 생성에 실패했어요." }, { status: 502 });
  }
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) return Response.json({ error: "이미지가 반환되지 않았어요." }, { status: 502 });
  return Response.json({ image: `data:image/png;base64,${b64}` });
}
