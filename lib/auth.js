// 비밀번호는 x-app-password 헤더로 받아 서버의 APP_PASSWORD와 비교합니다.
export function checkAuth(request) {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return { ok: false, status: 500, error: "서버에 APP_PASSWORD가 설정되지 않았어요." };
  if (request.headers.get("x-app-password") !== expected)
    return { ok: false, status: 401, error: "비밀번호가 맞지 않아요." };
  if (!process.env.OPENAI_API_KEY)
    return { ok: false, status: 500, error: "서버에 OPENAI_API_KEY가 설정되지 않았어요." };
  return { ok: true };
}
