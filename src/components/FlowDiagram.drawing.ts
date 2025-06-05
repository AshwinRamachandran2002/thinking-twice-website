// Drawing helpers for FlowDiagram
// All functions expect a 2D canvas context and layout/scale info
import { bezierTangent } from './FlowDiagram.helpers';

export function drawSolidBox(ctx, x, y, w, h, label, boxColor = "#fff", textColor = "#222", layout) {
  ctx.save();
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, "#f0fdfa"); // teal-50
  grad.addColorStop(1, "#ccfbf1"); // teal-100
  ctx.fillStyle = grad;
  ctx.globalAlpha = 0.95;
  // Removed shadow that causes blurry text
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 12 * layout.scale);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = textColor;
  const fontSize = layout.isMobile
    ? Math.max(8, Math.round(12 * layout.scale))
    : Math.max(12, Math.round(18 * layout.scale));
  ctx.font = `bold ${fontSize}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + w / 2, y + h / 2);
  ctx.restore();
}


export function arrowHead(ctx, x, y, dir, colour, layout) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.atan2(dir.y, dir.x));
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.5 * layout.scale;
  ctx.beginPath();
  ctx.moveTo(-8 * layout.scale, 4 * layout.scale);
  ctx.lineTo(0, 0);
  ctx.lineTo(-8 * layout.scale, -4 * layout.scale);
  ctx.stroke();
  ctx.restore();
}

export function curve(ctx, p0, p1, p2, c0, c1, layout, width = 1.5) {
  ctx.save();
  const grad = ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
  grad.addColorStop(0, c0);
  grad.addColorStop(1, c1);
  ctx.strokeStyle = grad;
  ctx.lineWidth = width * layout.scale;
  // Removed shadow blur that causes text blurring
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
  ctx.stroke();
  // Draw arrowhead at the end of the curve
  arrowHead(ctx, p2.x, p2.y, bezierTangent(1, p0, p1, p2), c1, layout);
  ctx.restore();
}

export function drawCircleImage(ctx, img, x, y, size) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();
}

export function drawFlowObjectRect(ctx, obj, x, y, w, h, iconImg, layout) {
  ctx.save();
  const fontSize = layout.isMobile ? Math.max(7, Math.round(8.5 * layout.scale)) : Math.max(9, Math.round(11 * layout.scale));
  ctx.font = `bold ${fontSize}px Inter, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const textWidth = ctx.measureText(obj.label).width;
  const minTextPad = h * (layout.isMobile ? 0.45 : 0.6) + (layout.isMobile ? 6 : 10) * layout.scale;
  const neededW = textWidth + minTextPad;
  if (neededW > w) w = neededW;
  if (obj.devilish) {
    ctx.save();
    // Removed shadow blur that causes text blurring
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    const radius = 6 * layout.scale;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = obj.color;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  ctx.beginPath();
  const radius = 6 * layout.scale;
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = obj.color;
  ctx.globalAlpha = 0.96;
  // Removed shadow blur that causes text blurring
  ctx.fill();
  ctx.globalAlpha = 1;
  if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
    const iconSize = h * 0.7;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x - iconSize * 0.35, y - iconSize * 0.35, iconSize * 0.5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(iconImg, x - iconSize * 0.85, y - iconSize * 0.85, iconSize, iconSize);
    ctx.restore();
  }
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${fontSize}px Inter, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(obj.label, x + h * 0.6, y + h / 2);
  ctx.restore();
}
