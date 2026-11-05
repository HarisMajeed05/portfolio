import * as THREE from "three";

export const CARD_W = 1024;
export const CARD_H = 680;
const ORANGE = "#ff5b2e";
const PAPER = "#ece8df";
const ICE = "#8fd8ff";
const MONO = '"Geist Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';

function rng(seed) {
  let a = seed * 9973 + 17;
  return () => {
    a = (a * 1664525 + 1013904223) % 4294967296;
    return a / 4294967296;
  };
}

const a = (c, o) => {
  const h = c.replace("#", "");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${o})`;
};

function label(ctx, text, x, y, color = ORANGE, size = 20) {
  ctx.font = `500 ${size}px ${MONO}`;
  const w = ctx.measureText(text).width + 16;
  ctx.fillStyle = color;
  ctx.fillRect(x, y - size - 4, w, size + 10);
  ctx.fillStyle = "#0a0a0a";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, x + 8, y);
}

function box(ctx, x, y, w, h, color = ORANGE, lw = 3) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.strokeRect(x, y, w, h);
}

const ART = {
  pipeline(ctx, x, y, w, h) {
    const names = ["DETECT", "EXPLAIN", "JUDGE"];
    const bw = (w - 160) / 3;
    const by = y + h / 2 - 46;
    names.forEach((n, i) => {
      const bx = x + i * (bw + 80);
      ctx.fillStyle = i === 2 ? a(ORANGE, 0.16) : a(PAPER, 0.05);
      ctx.fillRect(bx, by, bw, 92);
      box(ctx, bx, by, bw, 92, i === 2 ? ORANGE : a(PAPER, 0.5), 2);
      ctx.fillStyle = i === 2 ? ORANGE : PAPER;
      ctx.font = `500 26px ${MONO}`;
      ctx.textAlign = "center";
      ctx.fillText(n, bx + bw / 2, by + 56);
      ctx.textAlign = "left";
      if (i < 2) {
        ctx.strokeStyle = a(PAPER, 0.6);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx + bw + 12, by + 46);
        ctx.lineTo(bx + bw + 68, by + 46);
        ctx.lineTo(bx + bw + 56, by + 36);
        ctx.moveTo(bx + bw + 68, by + 46);
        ctx.lineTo(bx + bw + 56, by + 56);
        ctx.stroke();
      }
    });
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = a(PAPER, 0.08 + (i % 3) * 0.04);
      ctx.fillRect(x + i * (w / 9) + 4, y + 8, w / 9 - 12, 38);
    }
    ctx.fillStyle = a(PAPER, 0.5);
    ctx.font = `400 20px ${MONO}`;
    ctx.fillText("real / fake  +  why  +  is the why faithful", x, y + h - 10);
  },
  fields(ctx, x, y, w, h, r) {
    for (let i = 0; i < 12; i++) {
      ctx.fillStyle = a(PAPER, 0.1);
      const lw = w * (0.35 + r() * 0.55);
      ctx.fillRect(x + 20, y + 22 + i * 19, lw, 5);
    }
    const names = ["field", "checkbox", "signature", "field", "text"];
    names.forEach((n, i) => {
      const bw = 110 + r() * 170;
      const bh = 30 + r() * 26;
      const bx = x + 40 + r() * (w - bw - 80);
      const by = y + 30 + (i * (h - 80)) / names.length + r() * 10;
      ctx.fillStyle = a(ORANGE, 0.08);
      ctx.fillRect(bx, by, bw, bh);
      box(ctx, bx, by, bw, bh);
      label(ctx, `${n} 0.${88 + Math.floor(r() * 11)}`, bx, by - 6, ORANGE, 15);
    });
  },
  graph(ctx, x, y, w, h, r) {
    const cx = x + w * 0.46;
    const cy = y + h / 2;
    const pts = [];
    for (let i = 0; i < 11; i++) {
      const ang = (i / 11) * Math.PI * 2 + r() * 0.3;
      const rad = 70 + r() * 80;
      pts.push([cx + Math.cos(ang) * rad * 1.5, cy + Math.sin(ang) * rad * 0.9]);
    }
    pts.forEach(([px, py], i) => {
      ctx.strokeStyle = a(i < 3 ? ORANGE : PAPER, i < 3 ? 0.9 : 0.25);
      ctx.lineWidth = i < 3 ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();
    });
    pts.forEach(([px, py], i) => {
      ctx.fillStyle = i < 3 ? ORANGE : a(PAPER, 0.55);
      ctx.fillRect(px - 9, py - 11, 18, 22);
    });
    ctx.fillStyle = PAPER;
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, 7);
    ctx.fill();
    ctx.fillStyle = a(PAPER, 0.5);
    ctx.font = `400 20px ${MONO}`;
    ctx.fillText("query  >  top-k chunks  >  cited answer", x, y + h - 10);
  },
  tracks(ctx, x, y, w, h, r) {
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 10]);
    ctx.beginPath();
    ctx.moveTo(x + 20, y + h * 0.85);
    ctx.lineTo(x + w - 20, y + h * 0.2);
    ctx.stroke();
    ctx.setLineDash([]);
    for (let t = 0; t < 4; t++) {
      let px = x + 40 + r() * 120;
      let py = y + 30 + t * (h / 4.4);
      ctx.strokeStyle = a(t === 1 ? ICE : PAPER, 0.5);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      const steps = 9;
      for (let s = 0; s < steps; s++) {
        px += (w - 160) / steps + r() * 10;
        py += (r() - 0.35) * 26;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
      box(ctx, px - 22, py - 36, 44, 72, t === 1 ? ICE : a(PAPER, 0.7), 2);
      ctx.fillStyle = t === 1 ? ICE : a(PAPER, 0.7);
      ctx.font = `500 16px ${MONO}`;
      ctx.fillText(`id ${t + 3}`, px - 22, py - 42);
    }
  },
  grains(ctx, x, y, w, h, r) {
    const cols = [PAPER, ORANGE, ICE, a(PAPER, 0.35), "#c9a36b"];
    const names = ["Full", "Broken", "Rejected", "Weak", "Fatty"];
    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 22; i++) {
        const k = Math.floor(r() * (r() > 0.4 ? 1 : 5));
        ctx.save();
        ctx.translate(x + 26 + i * ((w - 40) / 22), y + 20 + j * 36);
        ctx.rotate((r() - 0.5) * 1.4);
        ctx.fillStyle = cols[k];
        ctx.beginPath();
        ctx.ellipse(0, 0, k === 1 ? 7 : 12, 4.5, 0, 0, 7);
        ctx.fill();
        ctx.restore();
      }
    }
    names.forEach((n, i) => {
      ctx.fillStyle = cols[i];
      ctx.fillRect(x + i * (w / 5), y + h - 26, 12, 12);
      ctx.fillStyle = a(PAPER, 0.7);
      ctx.font = `400 19px ${MONO}`;
      ctx.fillText(n, x + i * (w / 5) + 20, y + h - 14);
    });
  },
  defect(ctx, x, y, w, h, r) {
    for (let i = 0; i < 3; i++) {
      const bx = x + 40 + i * (w / 3);
      const bw = w / 3 - 70;
      ctx.strokeStyle = a(PAPER, 0.45);
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, y + 22, bw, h - 50);
      if (i !== 1) {
        ctx.strokeStyle = a(PAPER, 0.9);
        ctx.beginPath();
        let px = bx + bw * 0.2;
        let py = y + 70 + r() * 30;
        ctx.moveTo(px, py);
        for (let s = 0; s < 5; s++) {
          px += bw * 0.14;
          py += (r() - 0.2) * 34;
          ctx.lineTo(px, py);
        }
        ctx.stroke();
        box(ctx, bx + bw * 0.1, py - 46, bw * 0.8, 86, ORANGE, 3);
        label(ctx, "defect 0.9" + Math.floor(r() * 9), bx + bw * 0.1, py - 52, ORANGE, 15);
      } else {
        label(ctx, "normal 0.97", bx, y + 18, ICE, 15);
      }
    }
  },
  wave(ctx, x, y, w, h, r) {
    for (let i = 0; i < 40; i++) {
      const bh = 14 + r() * 100 * Math.sin((i / 40) * Math.PI);
      ctx.fillStyle = i > 28 ? a(PAPER, 0.25) : ORANGE;
      ctx.fillRect(x + i * 9, y + h / 2 - bh / 2, 5, bh);
    }
    ["summary", "action items", "dates"].forEach((t, i) => {
      ctx.fillStyle = a(PAPER, 0.7);
      ctx.font = `500 21px ${MONO}`;
      ctx.fillText(t, x + w * 0.5, y + 54 + i * 70);
      ctx.fillStyle = a(PAPER, 0.14);
      ctx.fillRect(x + w * 0.5, y + 68 + i * 70, w * 0.44, 5);
      ctx.fillRect(x + w * 0.5, y + 82 + i * 70, w * 0.3, 5);
    });
  },
  tree(ctx, x, y, w, h) {
    const node = (nx, ny, t, hot) => {
      ctx.fillStyle = hot ? a(ORANGE, 0.2) : a(PAPER, 0.06);
      ctx.fillRect(nx - 58, ny - 20, 116, 40);
      box(ctx, nx - 58, ny - 20, 116, 40, hot ? ORANGE : a(PAPER, 0.5), 2);
      ctx.fillStyle = hot ? ORANGE : PAPER;
      ctx.font = `500 19px ${MONO}`;
      ctx.textAlign = "center";
      ctx.fillText(t, nx, ny + 7);
      ctx.textAlign = "left";
    };
    const cx = x + w / 2;
    const tops = [
      [cx - 230, "decl"],
      [cx, "expr"],
      [cx + 230, "stmt"],
    ];
    ctx.strokeStyle = a(PAPER, 0.4);
    ctx.lineWidth = 2;
    tops.forEach(([tx]) => {
      ctx.beginPath();
      ctx.moveTo(cx, y + 36);
      ctx.lineTo(tx, y + 110);
      ctx.stroke();
    });
    node(cx, y + 30, "program", true);
    tops.forEach(([tx, t]) => node(tx, y + 120, t, false));
    ["int", "x", "=", "7", ";"].forEach((t, i) => {
      ctx.fillStyle = a(PAPER, 0.7);
      ctx.fillRect(x + 30 + i * 118, y + h - 56, 100, 34);
      ctx.fillStyle = "#0a0a0a";
      ctx.font = `500 19px ${MONO}`;
      ctx.fillText(t, x + 44 + i * 118, y + h - 33);
    });
  },
  tokens(ctx, x, y, w, h, r) {
    const mid = y + h / 2;
    ["scr", "atch", "gpt", "is", "a"].forEach((t, i) => {
      const ty = y + 12 + i * 44;
      ctx.fillStyle = a(PAPER, 0.06);
      ctx.fillRect(x, ty, 112, 34);
      box(ctx, x, ty, 112, 34, a(PAPER, 0.45), 2);
      ctx.fillStyle = PAPER;
      ctx.font = `500 20px ${MONO}`;
      ctx.fillText(t, x + 14, ty + 24);
    });
    const sx = x + w / 2 - 150;
    ["SwiGLU", "GQA + RoPE", "RMSNorm"].forEach((t, i) => {
      const by = y + 24 + i * 70;
      const hot = i === 1;
      ctx.fillStyle = hot ? a(ORANGE, 0.18) : a(PAPER, 0.05);
      ctx.fillRect(sx, by, 300, 54);
      box(ctx, sx, by, 300, 54, hot ? ORANGE : a(PAPER, 0.5), 2);
      ctx.fillStyle = hot ? ORANGE : PAPER;
      ctx.font = `500 23px ${MONO}`;
      ctx.textAlign = "center";
      ctx.fillText(t, sx + 150, by + 35);
      ctx.textAlign = "left";
    });
    ctx.strokeStyle = a(PAPER, 0.5);
    ctx.lineWidth = 2;
    for (const [x0, x1] of [
      [x + 124, sx - 14],
      [sx + 314, x + w - 250],
    ]) {
      ctx.beginPath();
      ctx.moveTo(x0, mid);
      ctx.lineTo(x1, mid);
      ctx.lineTo(x1 - 12, mid - 9);
      ctx.moveTo(x1, mid);
      ctx.lineTo(x1 - 12, mid + 9);
      ctx.stroke();
    }
    const bx = x + w - 220;
    for (let i = 0; i < 8; i++) {
      const bh = i === 3 ? 150 : 16 + r() * 70;
      ctx.fillStyle = i === 3 ? ORANGE : a(PAPER, 0.3);
      ctx.fillRect(bx + i * 26, y + h - 44 - bh, 18, bh);
    }
    ctx.fillStyle = a(PAPER, 0.55);
    ctx.font = `400 19px ${MONO}`;
    ctx.fillText("next token", bx, y + h - 12);
  },
  hand(ctx, x, y, w, h) {
    const s = 0.92;
    const ox = x + 170;
    const oy = y + h - 14;
    const P = (px, py) => [ox + px * s, oy + py * s];
    const fingers = [
      [[-34, -26], [-62, -60], [-62, -112], [-46, -150]],
      [[-26, -92], [-32, -126], [-38, -150], [-40, -168]],
      [[0, -100], [0, -140], [2, -166], [2, -186]],
      [[24, -92], [26, -128], [28, -150], [30, -166]],
      [[44, -74], [50, -102], [54, -120], [56, -134]],
    ];
    ctx.strokeStyle = a(PAPER, 0.5);
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    const line = (pts) => {
      ctx.beginPath();
      pts.forEach(([px, py], i) => {
        const [qx, qy] = P(px, py);
        if (i) ctx.lineTo(qx, qy);
        else ctx.moveTo(qx, qy);
      });
      ctx.stroke();
    };
    line([[0, 0], ...fingers.map((f) => f[0]), [0, 0]]);
    fingers.forEach((f) => line(f));
    fingers.forEach((f) =>
      f.forEach(([px, py]) => {
        const [qx, qy] = P(px, py);
        ctx.fillStyle = PAPER;
        ctx.beginPath();
        ctx.arc(qx, qy, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }),
    );
    const [qx, qy] = P(-42, -152);
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(qx, qy, 17, 0, Math.PI * 2);
    ctx.stroke();
    box(ctx, ox - 82 * s, oy - 192 * s, 172 * s, 200 * s, ORANGE, 3);
    label(ctx, "pinch", ox - 82 * s, oy - 192 * s - 2);
    [
      ["pinch", "click"],
      ["fist", "voice mode"],
      ["palm", "play / pause"],
    ].forEach(([g, act], i) => {
      const ry = y + 62 + i * 64;
      ctx.font = `500 24px ${MONO}`;
      ctx.fillStyle = PAPER;
      ctx.fillText(g, x + w * 0.5, ry);
      ctx.fillStyle = a(PAPER, 0.4);
      ctx.fillText("->", x + w * 0.5 + 100, ry);
      ctx.fillStyle = ORANGE;
      ctx.fillText(act, x + w * 0.5 + 160, ry);
      ctx.fillStyle = a(PAPER, 0.12);
      ctx.fillRect(x + w * 0.5, ry + 14, w * 0.42, 2);
    });
  },
  asr(ctx, x, y, w, h, r) {
    for (let i = 0; i < 61; i++) {
      const bh = 8 + r() * 54 * Math.sin((i / 60) * Math.PI);
      ctx.fillStyle = a(PAPER, 0.28);
      ctx.fillRect(x + i * 15, y + 36 - bh / 2, 8, bh);
    }
    const rows = [
      ["base", [1, 4, 6]],
      ["tuned", [4]],
    ];
    rows.forEach(([name, bad], ri) => {
      const ry = y + 104 + ri * 62;
      ctx.font = `500 21px ${MONO}`;
      ctx.fillStyle = ri ? ORANGE : a(PAPER, 0.7);
      ctx.fillText(name, x, ry + 28);
      for (let i = 0; i < 8; i++) {
        const cx = x + 110 + i * 94;
        const wrong = bad.includes(i);
        ctx.fillStyle = wrong ? a(ORANGE, 0.22) : a(PAPER, 0.07);
        ctx.fillRect(cx, ry, 82, 40);
        box(ctx, cx, ry, 82, 40, wrong ? ORANGE : a(PAPER, 0.4), 2);
        if (wrong) {
          ctx.strokeStyle = ORANGE;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx + 10, ry + 20);
          ctx.lineTo(cx + 72, ry + 20);
          ctx.stroke();
        } else {
          ctx.fillStyle = a(PAPER, 0.35);
          ctx.fillRect(cx + 12, ry + 17, 58, 6);
        }
      }
    });
    ctx.fillStyle = a(PAPER, 0.5);
    ctx.font = `400 19px ${MONO}`;
    ctx.fillText("word error rate, before and after", x + w - 392, y + h - 6);
  },
  pendulum(ctx, x, y, w, h) {
    const px = x + 150;
    const baseY = y + h - 12;
    const hubY = y + h - 92;
    ctx.fillStyle = a(PAPER, 0.1);
    ctx.fillRect(px - 36, baseY - 36, 72, 36);
    box(ctx, px - 36, baseY - 36, 72, 36, a(PAPER, 0.5), 2);
    ctx.strokeStyle = PAPER;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(px, baseY - 36);
    ctx.lineTo(px, hubY);
    ctx.stroke();
    ctx.strokeStyle = a(PAPER, 0.3);
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.ellipse(px, hubY, 118, 30, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    const ex = px + 112;
    const ey = hubY + 10;
    ctx.strokeStyle = PAPER;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(px, hubY);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex + 8, y + 36);
    ctx.stroke();
    ctx.fillStyle = ORANGE;
    ctx.beginPath();
    ctx.arc(ex + 8, y + 36, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PAPER;
    for (const [dx, dy] of [[px, hubY], [ex, ey]]) {
      ctx.beginPath();
      ctx.arc(dx, dy, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    label(ctx, "upright", ex + 34, y + 44);
    const cx = x + w * 0.5;
    ctx.fillStyle = a(PAPER, 0.05);
    ctx.fillRect(cx, y + 6, w - (cx - x), h - 12);
    box(ctx, cx, y + 6, w - (cx - x), h - 12, a(PAPER, 0.3), 2);
    [
      ["// furuta_policy.h, no deps", a(PAPER, 0.5)],
      ["float obs[4] = {th, th_d,", PAPER],
      ["                al, al_d};", PAPER],
      ["float action =", PAPER],
      ["  furuta_policy_forward(obs);", ORANGE],
      ["// 2 x 64 hidden, about 100 Hz", a(PAPER, 0.5)],
    ].forEach(([t, c], i) => {
      ctx.fillStyle = c;
      ctx.font = `500 20px ${MONO}`;
      ctx.fillText(t, cx + 20, y + 42 + i * 34);
    });
  },
  board(ctx, x, y, w, h) {
    ctx.fillStyle = a(PAPER, 0.1);
    for (let gx = 0; gx < w; gx += 38) {
      for (let gy = 6; gy < h; gy += 38) ctx.fillRect(x + gx, y + gy, 3, 3);
    }
    ctx.strokeStyle = a(PAPER, 0.75);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x + 40, y + 160);
    ctx.bezierCurveTo(x + 110, y + 60, x + 170, y + 220, x + 250, y + 110);
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.strokeStyle = a(PAPER, 0.55);
    ctx.strokeRect(x + 330, y + 46, 170, 100);
    ctx.beginPath();
    ctx.arc(x + 650, y + 130, 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 520, y + 190);
    ctx.lineTo(x + 800, y + 196);
    ctx.stroke();
    ctx.fillStyle = a(PAPER, 0.7);
    ctx.font = `500 24px ${MONO}`;
    ctx.fillText("plan", x + 346, y + 104);
    const cursor = (cx, cy, c, name) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy + 28);
      ctx.lineTo(cx + 8, cy + 21);
      ctx.lineTo(cx + 14, cy + 34);
      ctx.lineTo(cx + 19, cy + 31);
      ctx.lineTo(cx + 13, cy + 19);
      ctx.lineTo(cx + 23, cy + 19);
      ctx.closePath();
      ctx.fill();
      label(ctx, name, cx + 20, cy + 58, c, 18);
    };
    cursor(x + 280, y + 140, ORANGE, "you");
    cursor(x + 730, y + 50, ICE, "guest");
  },
  listings(ctx, x, y, w) {
    const pw = 440;
    const px = x + (w - pw) / 2;
    ctx.strokeStyle = a(PAPER, 0.5);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(px, y + 4, pw, 42, 21);
    ctx.stroke();
    ["where", "when", "who"].forEach((t, i) => {
      ctx.fillStyle = a(PAPER, 0.65);
      ctx.font = `500 19px ${MONO}`;
      ctx.fillText(t, px + 34 + i * 140, y + 31);
    });
    ctx.fillStyle = ORANGE;
    ctx.beginPath();
    ctx.arc(px + pw - 24, y + 25, 14, 0, Math.PI * 2);
    ctx.fill();
    const gap = 22;
    const cw = (w - gap * 3) / 4;
    for (let i = 0; i < 4; i++) {
      const cx = x + i * (cw + gap);
      const cy = y + 68;
      const hot = i === 1;
      ctx.fillStyle = hot ? a(ORANGE, 0.14) : a(PAPER, 0.06);
      ctx.fillRect(cx, cy, cw, 162);
      box(ctx, cx, cy, cw, 162, hot ? ORANGE : a(PAPER, 0.35), 2);
      ctx.strokeStyle = hot ? ORANGE : a(PAPER, 0.55);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx + cw / 2 - 34, cy + 72);
      ctx.lineTo(cx + cw / 2, cy + 38);
      ctx.lineTo(cx + cw / 2 + 34, cy + 72);
      ctx.lineTo(cx + cw / 2 + 34, cy + 96);
      ctx.lineTo(cx + cw / 2 - 34, cy + 96);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = a(PAPER, 0.5);
      ctx.fillRect(cx + 14, cy + 122, cw * 0.62, 6);
      ctx.fillStyle = a(PAPER, 0.22);
      ctx.fillRect(cx + 14, cy + 140, cw * 0.4, 6);
    }
  },
};

function wrap(ctx, text, maxW) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  lines.push(line);
  return lines;
}

export function makeCardTexture(p, i, n, aniso = 8) {
  const c = document.createElement("canvas");
  c.width = CARD_W;
  c.height = CARD_H;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, CARD_H);
  g.addColorStop(0, "#10131a");
  g.addColorStop(1, "#090b10");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.strokeStyle = a(PAPER, 0.2);
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, CARD_W - 2, CARD_H - 2);

  // detector corners
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 6;
  const L = 54;
  const m = 14;
  for (const [cx, cy, sx, sy] of [
    [m, m, 1, 1],
    [CARD_W - m, m, -1, 1],
    [m, CARD_H - m, 1, -1],
    [CARD_W - m, CARD_H - m, -1, -1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(cx + sx * L, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + sy * L);
    ctx.stroke();
  }

  ctx.textBaseline = "alphabetic";
  ctx.font = `500 26px ${MONO}`;
  ctx.fillStyle = ORANGE;
  ctx.fillText(`${String(i + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`, 54, 70);
  ctx.fillStyle = a(PAPER, 0.62);
  ctx.textAlign = "right";
  ctx.fillText(p.kind.toUpperCase(), CARD_W - 54, 70);
  ctx.textAlign = "left";

  const ax = 54;
  const ay = 100;
  const aw = CARD_W - 108;
  const ah = 236;
  ctx.save();
  ctx.beginPath();
  ctx.rect(ax - 6, ay - 6, aw + 12, ah + 12);
  ctx.clip();
  (ART[p.art] || ART.fields)(ctx, ax, ay, aw, ah, rng(i + 3));
  ctx.restore();
  ctx.fillStyle = a(PAPER, 0.12);
  ctx.fillRect(54, 356, CARD_W - 108, 2);

  ctx.fillStyle = PAPER;
  let size = 76;
  ctx.font = `400 ${size}px ${SERIF}`;
  let lines = wrap(ctx, p.title, CARD_W - 108);
  if (lines.length > 2) {
    size = 60;
    ctx.font = `400 ${size}px ${SERIF}`;
    lines = wrap(ctx, p.title, CARD_W - 108);
  }
  lines.slice(0, 2).forEach((ln, k) => ctx.fillText(ln, 54, 438 + k * (size * 0.98)));

  ctx.font = `500 22px ${MONO}`;
  ctx.fillStyle = a(PAPER, 0.7);
  let sx = 54;
  const sy = CARD_H - 54;
  for (const s of p.stack.slice(0, 5)) {
    const tw = ctx.measureText(s).width + 26;
    if (sx + tw > CARD_W - 54) break;
    ctx.strokeStyle = a(PAPER, 0.3);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sx, sy - 26, tw, 38);
    ctx.fillText(s, sx + 13, sy);
    sx += tw + 10;
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = aniso;
  tex.needsUpdate = true;
  return tex;
}
