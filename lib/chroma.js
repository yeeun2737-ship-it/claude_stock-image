import sharp from "sharp";

// 초록(#00FF00) 단색 배경을 투명으로 바꿉니다. 경계는 부드럽게 알파를 주고 초록 번짐을 줄여요.
export async function removeGreen(input, { lo = 50, hi = 150 } = {}) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // 초록이 다른 채널보다 얼마나 튀는지. 순수 배경은 255, 연두색 잎은 40 안팎이라 지켜집니다.
    const gd = g - Math.max(r, b);
    let a = 1 - (gd - lo) / (hi - lo);
    a = a < 0 ? 0 : a > 1 ? 1 : a;
    if (a < 1) {
      const m = Math.max(r, b);
      if (g > m) data[i + 1] = m; // despill
    }
    data[i + 3] = Math.round(a * 255);
  }
  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}
