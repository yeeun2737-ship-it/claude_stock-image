"use client";

import { useEffect, useRef, useState } from "react";
import { pickRandom } from "../../lib/keywords";

const OUTLINE = "#8b6b5b";
const CAPS = ["#ffb347", "#6ec1e4", "#a8e063", "#ff8fb1", "#c9a7f2", "#ffd54f"];

// 둥근 캡슐: 위/아래 반쪽 색이 다릅니다. open이면 윗반쪽이 열려요.
function Capsule({ size = 96, top, bottom, open = false }) {
  return (
    <svg width={size} height={size} viewBox="-50 -62 100 112" aria-hidden="true">
      <g className={`cap-bottom`}>
        <path d="M-40 0 A40 40 0 0 0 40 0 Z" fill={bottom} stroke={OUTLINE} strokeWidth="5" strokeLinejoin="round" />
      </g>
      <g className={`cap-top ${open ? "open" : ""}`}>
        <path d="M-40 0 A40 40 0 0 1 40 0 Z" fill={top} stroke={OUTLINE} strokeWidth="5" strokeLinejoin="round" />
        <ellipse cx="-16" cy="-20" rx="9" ry="5" fill="#fff" opacity="0.7" transform="rotate(-30 -16 -20)" />
      </g>
    </svg>
  );
}

export default function GachaMachine({ pool, selected, onPick, monthLabel }) {
  const [phase, setPhase] = useState("idle"); // idle | spinning | dropped
  const [picks, setPicks] = useState([]);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const pull = () => {
    if (phase === "spinning") return;
    setPhase("spinning");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const next = pickRandom(pool, 3);
      setPicks(next);
      onPick(next[0]);
      setPhase("dropped");
    }, 1500);
  };

  const inside = [
    { x: 118, y: 150, r: -20, c: 0 },
    { x: 190, y: 132, r: 25, c: 1 },
    { x: 222, y: 190, r: -35, c: 2 },
    { x: 150, y: 212, r: 15, c: 3 },
    { x: 100, y: 205, r: 40, c: 4 },
    { x: 178, y: 178, r: -10, c: 5 },
  ];

  return (
    <div className={`gacha ${phase}`}>
      <button
        type="button"
        className="machine"
        onClick={pull}
        disabled={phase === "spinning"}
        aria-label={phase === "dropped" ? "캡슐 다시 뽑기" : "캡슐 뽑기"}
      >
        <svg viewBox="0 0 320 440" width="100%" aria-hidden="true">
          <defs>
            <radialGradient id="glass" cx="0.35" cy="0.3" r="0.9">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#dff3fb" />
            </radialGradient>
          </defs>
          <ellipse cx="160" cy="420" rx="118" ry="12" fill="#f1e3b3" opacity="0.9" />

          {/* 몸체 */}
          <path d="M72 300 L248 300 L270 392 Q270 408 254 408 L66 408 Q50 408 50 392 Z" fill="#f98f8f" stroke={OUTLINE} strokeWidth="5" strokeLinejoin="round" />
          <rect x="44" y="388" width="232" height="26" rx="13" fill="#f67f87" stroke={OUTLINE} strokeWidth="5" />
          <rect x="92" y="284" width="136" height="28" rx="8" fill="#f67f87" stroke={OUTLINE} strokeWidth="5" />
          {/* 다이얼 패널 */}
          <rect x="116" y="318" width="88" height="52" rx="8" fill="#fff" stroke={OUTLINE} strokeWidth="5" />
          <g className="dial">
            <circle cx="160" cy="344" r="18" fill="#f26b7a" stroke={OUTLINE} strokeWidth="5" />
            <rect x="151" y="340" width="18" height="8" rx="3" fill="#fff" stroke={OUTLINE} strokeWidth="3" />
          </g>
          {/* 배출구 */}
          <path d="M124 408 V392 Q124 376 160 376 Q196 376 196 392 V408 Z" fill="#e8647a" stroke={OUTLINE} strokeWidth="5" strokeLinejoin="round" />

          {/* 유리 구슬 */}
          <circle cx="160" cy="185" r="112" fill="url(#glass)" stroke={OUTLINE} strokeWidth="5" />
          <g className="caps">
            {inside.map((p, i) => (
              <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}>
                <g className={`cap cap-${i}`}>
                  <path d="M-26 0 A26 26 0 0 1 26 0 Z" fill={CAPS[p.c]} stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round" />
                  <path d="M-26 0 A26 26 0 0 0 26 0 Z" fill="#fff" stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round" />
                </g>
              </g>
            ))}
          </g>
          <path d="M82 150 Q92 100 140 84" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.85" />

          {/* 뚜껑 */}
          <rect x="104" y="52" width="112" height="32" rx="8" fill="#f98f8f" stroke={OUTLINE} strokeWidth="5" />
          <rect x="122" y="34" width="76" height="24" rx="10" fill="#f98f8f" stroke={OUTLINE} strokeWidth="5" />
          <circle cx="160" cy="26" r="12" fill="#f26b7a" stroke={OUTLINE} strokeWidth="5" />

          {/* TAP! 말풍선 */}
          <g className="bubble">
            <ellipse cx="52" cy="296" rx="44" ry="24" fill="#fff" stroke={OUTLINE} strokeWidth="4" />
            <path d="M72 312 L98 322 L86 300 Z" fill="#fff" stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round" />
            <path d="M74 308 L88 308" stroke="#fff" strokeWidth="6" />
            <text x="52" y="304" textAnchor="middle" fontSize={phase === "dropped" ? 16 : 22} fontWeight="800" fill="#e8553a" fontFamily="Inter, system-ui, sans-serif">
              {phase === "dropped" ? "AGAIN!" : "TAP!"}
            </text>
          </g>
        </svg>
      </button>

      <p className="gacha-hint">
        {phase === "idle" && `${monthLabel}에 어울리는 키워드, 머신을 눌러 뽑아보세요`}
        {phase === "spinning" && "뽑는 중..."}
        {phase === "dropped" && "마음에 드는 캡슐을 골라주세요 (머신을 누르면 다시 뽑아요)"}
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
                <span className="cap-svg">
                  <Capsule top={CAPS[(i * 2 + 1) % CAPS.length]} bottom="#fff" open />
                </span>
                <span className="cap-label">{k.ko}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
