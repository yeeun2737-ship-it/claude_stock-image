import "./globals.css";

export const metadata = {
  title: "스톡 그림 자판기",
  description: "키워드와 그림체를 고르면 투명 배경 PNG 요소 시트가 나옵니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
