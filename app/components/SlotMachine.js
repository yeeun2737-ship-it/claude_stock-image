"use client";

import { useEffect, useRef, useState } from "react";
import { pickRandom } from "../../lib/keywords";

const OUT = "#5b3f8f";
const STEP = 60; // 릴 심볼 간격
const FINAL = [0, 2, 4]; // 릴 i가 멈출 심볼 (서로 다르게)

// 5가지 귀여운 심볼. 릴과 결과 카드가 같은 모양을 써서 짝이 맞아요.
export function Sym({ k, size = 40, x, y }) {
  const s = { stroke: OUT, strokeWidth: 3, strokeLinejoin: "round" };
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="-30 -30 60 60" aria-hidden="true">
      {k === 0 && <path d="M0 14 C-28 -4 -14 -26 0 -11 C14 -26 28 -4 0 14 Z" fill="#f472b6" {...s} />}
      {k === 1 && <polygon points="0,-22 6.5,-7 22,-6 10,5 13,21 0,13 -13,21 -10,5 -22,-6 -6.5,-7" fill="#ffd54f" {...s} />}
      {k === 2 && <path d="M-18 13 a10 10 0 0 1 2 -19 a13 13 0 0 1 24 -3 a10 10 0 0 1 10 22 Z" fill="#b4c0ff" {...s} />}
      {k === 3 && (
        <>
          <polygon points="0,-22 18,-6 0,22 -18,-6" fill="#c4a1ff" {...s} />
          <path d="M-18 -6 L18 -6 M-7 -6 L0 -22 L7 -6 M-7 -6 L0 22 L7 -6" fill="none" stroke={OUT} strokeWidth="2" strokeLinejoin="round" />
        </>
      )}
      {k === 4 && <path d="M2 -22 A22 22 0 1 0 22 10 A15 15 0 0 1 2 -22 Z" fill="#fde68a" {...s} />}
    </svg>
  );
}

function StripSym({ k, y }) {
  return <Sym k={k} size={40} x={2} y={y - 20} />;
}

// 깜빡이는 4갈래 별
function Twinkle({ x, y, s = 1, d = 0, c = "#fff" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="tw" style={{ animationDelay: `${d}s` }}>
        <path d="M0 -11 Q1.8 -1.8 11 0 Q1.8 1.8 0 11 Q-1.8 1.8 -11 0 Q-1.8 -1.8 0 -11Z" fill={c} />
      </g>
    </g>
  );
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
            <clipPath id="screenclip"><rect x="62" y="140" width="176" height="116" rx="10" /></clipPath>
            <linearGradient id="bodyG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f1e6ff" />
              <stop offset="0.5" stopColor="#d4b8ff" />
              <stop offset="1" stopColor="#b48cf5" />
            </linearGradient>
            <linearGradient id="frameG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a678f0" />
              <stop offset="1" stopColor="#7e4fd8" />
            </linearGradient>
            <radialGradient id="screenG" cx="0.5" cy="0.35" r="0.8">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#e3d4ff" />
            </radialGradient>
            <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#fff3a8" stopOpacity="0.9" />
              <stop offset="1" stopColor="#fff3a8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="150" cy="422" rx="120" ry="11" fill="#e4d6fb" opacity="0.95" />

          {/* 사이렌 + 빛 번짐 */}
          <circle className="halo" cx="150" cy="48" r="46" fill="url(#glow)" />
          <g stroke="#f3b93c" strokeWidth="4" strokeLinecap="round">
            <path d="M118 30 L110 16" /><path d="M150 24 L150 8" /><path d="M182 30 L190 16" />
          </g>
          <path d="M122 62 Q122 34 150 34 Q178 34 178 62 Z" fill="#ffe27a" stroke={OUT} strokeWidth="5" strokeLinejoin="round" />

          {/* 몸체 */}
          <rect x="30" y="58" width="240" height="342" rx="30" fill="url(#bodyG)" stroke={OUT} strokeWidth="5" />
          <path d="M44 96 Q44 70 70 70" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
          {/* 간판 */}
          <rect x="62" y="76" width="176" height="42" rx="6" fill="#fff" stroke={OUT} strokeWidth="4" />
          <text x="150" y="105" textAnchor="middle" fontSize="20" fontWeight="800" fill="#7c4dff" fontFamily="Inter, system-ui, sans-serif" letterSpacing="1">
            LUCKY PICK
          </text>
          {/* 화면 */}
          <rect x="50" y="128" width="200" height="140" rx="16" fill="url(#frameG)" stroke={OUT} strokeWidth="5" />
          <rect x="62" y="140" width="176" height="116" rx="10" fill="url(#screenG)" stroke={OUT} strokeWidth="3" />

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
          {/* 화면 위를 스치는 광택 */}
          <g clipPath="url(#screenclip)">
            <rect className="glint" x="62" y="130" width="22" height="136" fill="#fff" opacity="0.55" />
          </g>

          {/* 조작부 */}
          <rect x="42" y="276" width="216" height="46" rx="12" fill="#eadcff" stroke={OUT} strokeWidth="4" />
          <circle cx="104" cy="299" r="11" fill="#fff3b0" stroke="#f3b93c" strokeWidth="4" />
          <circle cx="150" cy="299" r="13" fill="#fff" stroke="#a678f0" strokeWidth="4" />
          <circle cx="196" cy="299" r="11" fill="#fff3b0" stroke="#f3b93c" strokeWidth="4" />
          {/* 배출구 */}
          <rect x="82" y="338" width="136" height="46" rx="8" fill="#fff" stroke={OUT} strokeWidth="4" />
          <text x="150" y="368" textAnchor="middle" fontSize="15" fontWeight="700" fill="#b693f5" fontFamily="Inter, system-ui, sans-serif">GOOD LUCK</text>

          {/* 레버 */}
          <rect x="268" y="170" width="20" height="40" rx="6" fill="#cfc8e0" stroke={OUT} strokeWidth="4" />
          <g className="lever">
            <path d="M278 176 L296 116" stroke="#b9afd6" strokeWidth="9" strokeLinecap="round" />
            <circle cx="297" cy="108" r="14" fill="#a855f7" stroke={OUT} strokeWidth="4" />
            <circle cx="292" cy="103" r="4" fill="#fff" opacity="0.85" />
          </g>

          {/* 반짝이 별들 */}
          <Twinkle x={12} y={92} s={1.3} d={0} c="#a855f7" />
          <Twinkle x={306} y={64} s={1.1} d={0.5} c="#ffc933" />
          <Twinkle x={16} y={250} s={0.9} d={1.1} c="#c4a1ff" />
          <Twinkle x={308} y={286} s={1.4} d={0.3} c="#f472b6" />
          <Twinkle x={96} y={12} s={0.8} d={0.8} c="#ffc933" />
          <Twinkle x={214} y={20} s={0.9} d={1.4} c="#a855f7" />
          <Twinkle x={14} y={380} s={1} d={0.6} c="#ffc933" />
          <Twinkle x={304} y={400} s={0.8} d={1.2} c="#a855f7" />
          <Twinkle x={246} y={132} s={0.7} d={0.2} c="#fff" />
          <Twinkle x={56} y={330} s={0.65} d={0.9} c="#fff" />
          <Twinkle x={236} y={352} s={0.6} d={1.6} c="#fff" />
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
