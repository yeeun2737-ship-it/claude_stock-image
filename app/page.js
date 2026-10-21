"use client";

import { useEffect, useState } from "react";
import { MONTH_KEYWORDS } from "../lib/keywords";
import { STYLES } from "../lib/styles";
import SlotMachine from "./components/SlotMachine";

const safeGet = (k) => {
  try { return localStorage.getItem(k); } catch { return null; }
};
const safeSet = (k, v) => {
  try { localStorage.setItem(k, v); } catch {}
};

export default function Home() {
  const [password, setPassword] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [keyword, setKeyword] = useState(null);
  const [styleId, setStyleId] = useState(STYLES[0].id);
  const [count, setCount] = useState(8);
  const [customKo, setCustomKo] = useState("");
  const [customEn, setCustomEn] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [meta, setMeta] = useState(null);

  useEffect(() => { setPassword(safeGet("pw") || ""); }, []);

  const changeMonth = (m) => { setMonth(m); setKeyword(null); };

  const applyCustom = () => {
    const ko = customKo.trim();
    if (!ko) return;
    setKeyword({ ko, en: customEn.trim() || ko });
  };

  const call = async (path, body) => {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-app-password": password },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "요청에 실패했어요.");
    return data;
  };

  const generate = async () => {
    setBusy(true); setError(""); setImage(""); setMeta(null);
    safeSet("pw", password);
    const style = STYLES.find((s) => s.id === styleId);
    try {
      const [img, m] = await Promise.all([
        call("/api/generate", { keywordEn: keyword.en, styleId, count }),
        call("/api/meta", { keywordKo: keyword.ko, styleName: style.name }).catch(() => null),
      ]);
      setImage(img.image);
      setMeta(m);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = image;
    a.download = `${keyword.ko}-${styleId}-sheet.png`;
    a.click();
  };

  const metaText = meta ? `${meta.title}\n\n${(meta.tags || []).join(", ")}\n\n${meta.description}` : "";

  return (
    <main>
      <span className="badge">미리캔버스 스톡 작가용</span>
      <h1>스톡 그림 자판기</h1>
      <p className="sub">슬롯을 돌려 키워드를 고르고, 그림체를 정하면 투명 배경 PNG 시트 한 장이 나와요. Procreate에서 하나씩 잘라 쓰세요.</p>

      <section className="card raised">
        <div className="card-head">
          <h2>1. 키워드 뽑기</h2>
          <label className="month">
            <select value={month} onChange={(e) => changeMonth(Number(e.target.value))} aria-label="월 선택">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
          </label>
        </div>

        <SlotMachine key={month} pool={MONTH_KEYWORDS[month]} selected={keyword} onPick={setKeyword} monthLabel={`${month}월`} />

        <details className="custom">
          <summary>직접 키워드 입력</summary>
          <div className="row" style={{ marginTop: 10 }}>
            <input type="text" placeholder="키워드 (한글)" value={customKo} onChange={(e) => setCustomKo(e.target.value)} />
            <input type="text" placeholder="영어 (프롬프트용, 선택)" value={customEn} onChange={(e) => setCustomEn(e.target.value)} />
            <button className="ghost" onClick={applyCustom}>적용</button>
          </div>
        </details>

        <p className="picked">{keyword ? <>선택한 키워드 <strong>{keyword.ko}</strong></> : "아직 키워드를 고르지 않았어요"}</p>
      </section>

      <section className="card">
        <h2>2. 그림체</h2>
        <div className="chips">
          {STYLES.map((s) => (
            <button key={s.id} className={`chip ${styleId === s.id ? "on" : ""}`} onClick={() => setStyleId(s.id)}>
              {s.name}
            </button>
          ))}
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <label>소재 개수&nbsp;
            <select value={count} onChange={(e) => setCount(Number(e.target.value))} style={{ flex: "0 0 auto" }}>
              {[6, 7, 8].map((n) => <option key={n} value={n}>{n}개</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="card">
        <h2>3. 생성</h2>
        <div className="row">
          <input type="password" placeholder="접속 비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="primary" disabled={busy || !password || !keyword} onClick={generate}>
            {busy ? "그리는 중... (1~2분)" : keyword ? `${keyword.ko} 시트 만들기` : "키워드를 먼저 뽑아주세요"}
          </button>
        </div>
        {error && <p className="err">{error}</p>}
      </section>

      {image && (
        <section className="card">
          <h2>결과</h2>
          <img className="sheet" src={image} alt={`${keyword.ko} 요소 시트`} />
          <div className="row" style={{ marginTop: 12 }}>
            <button className="primary" onClick={download}>PNG 다운로드</button>
          </div>
          <p className="small">AI 생성 이미지는 해상도가 낮게 나와요. 4000px 요소로 쓰려면 Procreate에서 잘라낸 뒤 확대·보정이 필요합니다.</p>
        </section>
      )}

      {meta && (
        <section className="card meta">
          <h2>미리캔버스 등록용 제목·태그</h2>
          <pre>{metaText}</pre>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="ghost" onClick={() => navigator.clipboard?.writeText(metaText)}>복사</button>
          </div>
        </section>
      )}
    </main>
  );
}
