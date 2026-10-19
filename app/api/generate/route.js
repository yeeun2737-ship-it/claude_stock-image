import { STYLES } from "../../../lib/styles";
import { checkAuth } from "../../../lib/auth";
import { callGemini, IMAGE_MODEL } from "../../../lib/gemini";
import { removeGreen } from "../../../lib/chroma";

export const maxDuration = 300;

// 키워드 + 그림체 → 서로 다른 소재 6~8개가 한 장에 모인 투명 배경 PNG 시트
// Gemini는 투명 PNG를 직접 못 만들어서, 초록 단색 배경으로 그린 뒤 서버에서 투명 처리합니다.
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
    `The entire background must be one perfectly flat, solid, pure bright green (#00FF00) color with no gradient, no texture, no shadows, no glow. Do not use bright green anywhere inside the objects.`,
    `No text, no letters, no watermark, no frame, no border.`,
  ].join(" ");

  try {
    const data = await callGemini(IMAGE_MODEL(), {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "16:9" } },
    });
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const inline = parts.find((p) => p.inlineData?.data)?.inlineData;
    if (!inline) {
      const why = data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason || "이미지가 반환되지 않았어요.";
      return Response.json({ error: `이미지를 받지 못했어요 (${why})` }, { status: 502 });
    }
    const png = await removeGreen(Buffer.from(inline.data, "base64"));
    return Response.json({ image: `data:image/png;base64,${png.toString("base64")}` });
  } catch (e) {
    return Response.json({ error: e.message || "이미지 생성에 실패했어요." }, { status: 502 });
  }
}
