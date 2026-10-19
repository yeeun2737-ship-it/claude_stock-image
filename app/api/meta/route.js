import { checkAuth } from "../../../lib/auth";

export const maxDuration = 60;

// 미리캔버스 등록용 한글 제목·태그·설명 생성
export async function POST(request) {
  const auth = checkAuth(request);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: auth.status });

  const { keywordKo, styleName } = await request.json();
  if (!keywordKo) return Response.json({ error: "키워드가 필요해요." }, { status: 400 });

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "너는 한국 디자인 플랫폼에 요소(일러스트)를 등록하는 스톡 작가의 보조자야. JSON으로만 답해: {\"title\": 한글 제목(30자 이내), \"tags\": 한글 태그 배열(15~20개, 검색에 잘 걸리는 단어), \"description\": 한글 설명(두 문장)}.",
        },
        {
          role: "user",
          content: `키워드: ${keywordKo}\n그림체: ${styleName || "아기자기한 플랫"}\n이 키워드의 일러스트 요소 세트(여러 개 소재)에 쓸 제목·태그·설명을 만들어줘.`,
        },
      ],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return Response.json({ error: data?.error?.message || "메타데이터 생성 실패" }, { status: 502 });
  try {
    return Response.json(JSON.parse(data.choices[0].message.content));
  } catch {
    return Response.json({ error: "응답을 해석하지 못했어요." }, { status: 502 });
  }
}
