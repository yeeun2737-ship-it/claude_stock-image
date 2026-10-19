# claude_stock-image — 스톡 그림 자판기

스톡(미리캔버스) 작가용 웹앱. 트렌드 키워드와 그림체를 고르면 **배경 투명 PNG 시트 한 장**(소재 6~8개)이 나오고, 등록용 한글 제목·태그·설명도 함께 만들어 줍니다. 시트를 Procreate에서 하나씩 잘라 쓰는 흐름을 전제로 했습니다.

## 환경변수 (Vercel Project Settings → Environment Variables)

| 이름 | 설명 |
|---|---|
| `APP_PASSWORD` | 접속 비밀번호. 없으면 생성이 막힙니다 |
| `GEMINI_API_KEY` | Google Gemini 키. 서버에서만 사용 |
| `GEMINI_IMAGE_MODEL` | (선택) 기본 `gemini-2.5-flash-image` |
| `GEMINI_TEXT_MODEL` | (선택) 기본 `gemini-2.5-flash` |

저장소가 공개 상태이므로 키와 비밀번호는 절대 커밋하지 마세요. `.env.local.example` 참고.

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local   # 값 채우기
npm run dev
```

## 참고

- Gemini는 투명 PNG를 직접 만들지 못해서, 초록 단색 배경으로 그리게 한 뒤 서버(sharp)에서 초록을 지워 투명하게 만듭니다. 초록 계열 소재는 일부 지워지거나 가장자리에 초록 기운이 남을 수 있어요.
- 모델 출력은 약 1344×768이라 4000px 요소로 쓰려면 Procreate에서 확대·보정이 필요합니다.
- 생성 한 번에 시간이 걸릴 수 있어 `maxDuration`을 길게 잡았습니다. Vercel 요금제에 따라 허용 시간이 달라요.
- 키워드 목록은 브라우저(localStorage)에 저장됩니다. 웹 자동 수집은 2단계 예정.
