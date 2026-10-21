"use client";

import { useEffect, useRef, useState } from "react";
import { pickRandom } from "../../lib/keywords";

const OUT = "#a8687d";
const STEP = 60; // 릴 심볼 간격
const FINAL = [0, 2, 4]; // 릴 i가 멈출 심볼 (서로 다르게)

// 5가지 귀여운 심볼. 릴과 결과 카드가 같은 모양을 써서 짝이 맞아요.
export function Sym({ k, size = 40, x, y }) {
  const s = { stroke: OUT, strokeWidth: 3, strokeLinejoin: "round" };
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="-30 -30 60 60" aria-hidden="true">
      {k === 0 && <path d="M0 14 C-28 -4 -14 -26 0 -11 C14 -26 28 -4 0 14 Z" fill="#ff6f8e" {...s} />}
      {k === 1 && <polygon points="0,-22 6.5,-7 22,-6 10,5 13,21 0,13 -13,21 -10,5 -22,-6 -6.5,-7" fill="#ffd54f" {...s} />}
      {k === 2 && <path d="M-18 13 a10 10 0 0 1 2 -19 a13 13 0 0 1 24 -3 a10 10 0 0 1 10 22 Z" fill="#8fd3f4" {...s} />}
      {k === 3 && (
        <>
          <path d="M-16 15 C-20 -10 0 -22 18 -18 C20 4 6 18 -16 15 Z" fill="#9bd46a" {...s} />
          <path d="M-12 11 L10 -10" stroke={OUT} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {k === 4 && <path d="M2 -22 A22 22 0 1 0 22 10 A15 15 0 0 1 2 -22 Z" fill="#ffcf5c" {...s} />}
    </svg>
  );
}

// 위치(0~4)별 심볼을 SVG 안에 직접 그리는 간단 버전 (릴 스트립용)
function StripSym({ k, y }) {
  return <Sym k={k} size={40} x={2} y={y - 20} />;
}

export default function SlotMachine({ pool, selected, onPick, monthLabel }) {
  const [phase, setPhase] = useState("idle"); // idle | spinning | dropped
  const [stopped, setStopped] = useState([false, false, false]);
  const [picks, setPicks] = useState([]);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const pull = () => {
    if (phase === "spinning") return;
    timers.current.forEach(clearTimeout);
    setStopped([false, false, false]);
    setPhase("spinning");
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    at(900, () => setStopped([true, false, false]));
    at(1250, () => setStopped([true, true, false]));
    at(1600, () => {
      setStopped([true, true, true]);
      const next = pickRandom(pool, 3);
      setPicks(next);
      onPick(next[0]);
      setPhase("dropped");
    });
  };

  const order = [0, 1, 2, 3, 4];
  const strip = [...order, ...order];
  const spinning = phase === "spinning";

  return (
    <div className={`gacha slot ${phase}`}>
      <button
        type="button"
        className="machine"
        onClick={pull}
        disabled={spinning}
        aria-label={phase === "dropped" ? "슬롯 다시 돌리기" : "슬롯 돌리기"}
      >
        <svg viewBox="0 0 320 440" width="100%" aria-hidden="true">
          <defs>
            <clipPath id="reelclip"><rect x="0" y="0" width="44" height="90" rx="10" /></clipPath>
          </defs>
          <ellipse cx="150" cy="422" rx="120" ry="11" fill="#f6d9e0" opacity="0.9" />

          {/* 사이렌 */}
          <g stroke="#e0a43c" strokeWidth="4" strokeLinecap="round">
            <path d="M118 30 L110 16" /><path d="M150 24 L150 8" /><path d="M182 30 L190 16" />
          </g>
          <path d="M122 62 Q122 34 150 34 Q178 34 178 62 Z" fill="#ffe27a" stroke={OUT} strokeWidth="5" strokeLinejoin="round" />

          {/* 몸체 */}
          <rect x="30" y="58" width="240" height="342" rx="30" fill="#ffc2d1" stroke={OUT} strokeWidth="5" />
          {/* 간판 */}
          <rect x="62" y="76" width="176" height="42" rx="6" fill="#fff" stroke={OUT} strokeWidth="4" />
          <text x="150" y="105" textAnchor="middle" fontSize="20" fontWeight="800" fill="#f26b86" fontFamily="Inter, system-ui, sans-serif" letterSpacing="1">
            LUCKY PICK
          </text>
          {/* 화면 */}
          <rect x="50" y="128" width="200" height="140" rx="16" fill="#ff9fb8" stroke={OUT} strokeWidth="5" />
          <rect x="62" y="140" width="176" height="116" rx="10" fill="#dcd8ff" stroke={OUT} strokeWidth="3" />

          {/* 릴 3개 */}
          {[0, 1, 2].map((i) => {
            const x = 72 + i * 52;
            const fin = FINAL[i];
            const done = stopped[i];
            return (
              <g key={i} transform={`translate(${x} 153)`} clipPath="url(#reelclip)">
                <rect x="0" y="0" width="44" height="90" fill="#fff" />
                <g
                  className={`strip s${i} ${spinning && !done ? "run" : ""}`}
                  style={done ? { transform: `translateY(${15 - STEP * fin}px)` } : { transform: "translateY(15px)" }}
                >
                  {strip.map((k, idx) => <StripSym key={idx} k={k} y={30 + STEP * idx} />)}
                </g>
              </g>
            );
          })}
          {[0, 1, 2].map((i) => (
            <rect key={`f${i}`} x={72 + i * 52} y="153" width="44" height="90" rx="10" fill="none" stroke={OUT} strokeWidth="3" />
          ))}

          {/* 조작부 */}
          <rect x="42" y="276" width="216" height="46" rx="12" fill="#ffd6e0" stroke={OUT} strokeWidth="4" />
          <circle cx="104" cy="299" r="11" fill="#fff3b0" stroke="#e0a43c" strokeWidth="4" />
          <circle cx="150" cy="299" r="13" fill="#fff" stroke="#c7b6f5" strokeWidth="4" />
          <circle cx="196" cy="299" r="11" fill="#fff3b0" stroke="#e0a43c" strokeWidth="4" />
          {/* 배출구 */}
          <rect x="82" y="338" width="136" height="46" rx="8" fill="#fff" stroke={OUT} strokeWidth="4" />
          <text x="150" y="368" textAnchor="middle" fontSize="15" fontWeight="700" fill="#e9a3b4" fontFamily="Inter, system-ui, sans-serif">GOOD LUCK</text>

          {/* 레버 */}
          <rect x="268" y="170" width="20" height="40" rx="6" fill="#c9c4cf" stroke={OUT} strokeWidth="4" />
          <g className="lever">
            <path d="M278 176 L296 116" stroke="#b9b3c0" strokeWidth="9" strokeLinecap="round" />
            <circle cx="297" cy="108" r="14" fill="#ff7f9d" stroke={OUT} strokeWidth="4" />
          </g>
        </svg>
      </button>

      <p className="gacha-hint">
        {phase === "idle" && `${monthLabel}에 어울리는 키워드, 슬롯을 눌러 돌려보세요`}
        {phase === "spinning" && "돌리는 중..."}
        {phase === "dropped" && "마음에 드는 키워드를 골라주세요 (슬롯을 누르면 다시 돌려요)"}
      </p>

      {phase === "dropped" && (
        <div className="tray" role="listbox" aria-label="뽑은 키워드">
          {picks.map((k, i) => {
            const on = selected?.ko === k.ko;
            return (
              <button
                key={k.ko}
                type="button"
                role="option"
                aria-selected={on}
                className={`cap-item ${on ? "on" : ""}`}
                style={{ "--i": i }}
                onClick={() => onPick(k)}
              >
                <span className="cap-svg"><Sym k={FINAL[i]} size={84} /></span>
                <span className="cap-label">{k.ko}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
