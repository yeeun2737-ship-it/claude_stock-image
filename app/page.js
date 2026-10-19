"use client";

import { useEffect, useState } from "react";
import { DEFAULT_KEYWORDS } from "../lib/keywords";
import { STYLES } from "../lib/styles";

// DESIGN.md의 스티커 팔레트 (장식 전용)
const STICKERS = ["#dd5b00", "#d6b6f6", "#ff64c8", "#2a9d99", "#1aae39", "#62aef0"];

const safeGet =(k) => {
  try { return localStorage.getItem(k); } catch { return null; }
};
const safeSet = (k, v) => {
  try { localStorage.setItem(k, v); } catch {}
};

export default function Home() {
  const [password, setPassword] = useState("");
  const [keywords, setKeywords] = useState(DEFAULT_KEYWORDS);
  const [keyword, setKeyword] = useState(DEFAULT_KEYWORDS[0]);
  const [styleId, setStyleId] = useState(STYLES[0].id);
  const [count, setCount] = useState(8);
  const [newKo, setNewKo] = useState("");
  const [newEn, setNewEn] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const saved = safeGet("keywords");
    if (saved) {
      try {
        const list = JSON.parse(saved);
        if (Array.isArray(list) && list.length) { setKeywords(list); setKeyword(list[0]); }
      } catch {}
    }
    setPassword(safeGet("pw") || "");
  }, []);

  const saveKeywords = (list) => { setKeywords(list); safeSet("keywords", JSON.stringify(list)); };

  const addKeyword = () => {
    const ko = newKo.trim();
    if (!ko) return;
    const item = { ko, en: newEn.trim() || ko };
    saveKeywords([...keywords, item]);
    setKeyword(item); setNewKo(""); setNewEn("");
  };

  const removeKeyword = (k) => {
    const list = keywords.filter((x) => x.ko !== k.ko);
    saveKeywords(list);
    if (keyword.ko === k.ko && list.length) setKeyword(list[0]);
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
      <p className="sub">키워드와 그림체를 고르면 투명 배경 PNG 시트 한 장이 나와요. Procreate에서 하나씩 잘라 쓰세요.</p>

      <section className="card raised">
        <h2>1. 키워드</h2>
        <div className="chips">
          {keywords.map((k, i) => (
            <button key={k.ko} className={`chip ${keyword.ko === k.ko ? "on" : ""}`} onClick={() => setKeyword(k)}>
              <span className="dot" style={{ background: STICKERS[i % STICKERS.length] }} />
              {k.ko}
            </button>
          ))}
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <input type="text" placeholder="새 키워드 (한글)" value={newKo} onChange={(e) => setNewKo(e.target.value)} />
          <input type="text" placeholder="영어 (프롬프트용, 선택)" value={newEn} onChange={(e) => setNewEn(e.target.value)} />
          <button className="ghost" onClick={addKeyword}>추가</button>
          <button className="ghost" onClick={() => removeKeyword(keyword)}>선택한 키워드 삭제</button>
        </div>
      </section>

      <section className="card raised">
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

      <section className="card raised">
        <h2>3. 생성</h2>
        <div className="row">
          <input type="password" placeholder="접속 비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="primary" disabled={busy || !password} onClick={generate}>
            {busy ? "그리는 중... (1~2분)" : `${keyword.ko} 시트 만들기`}
          </button>
        </div>
        {error && <p className="err">{error}</p>}
      </section>

      {image && (
        <section className="card raised">
          <h2>결과</h2>
          <img className="sheet" src={image} alt={`${keyword.ko} 요소 시트`} />
          <div className="row" style={{ marginTop: 12 }}>
            <button className="primary" onClick={download}>PNG 다운로드</button>
          </div>
          <p className="small">AI 생성 이미지는 보통 1536×1024로 나와요. 4000px 요소로 쓰려면 Procreate에서 잘라낸 뒤 확대·보정이 필요합니다.</p>
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
