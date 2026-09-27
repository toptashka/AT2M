function canvasBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(
              new Error("Не удалось создать изображение."),
            ),
      type,
      quality,
    );
  });
}

export function imagePdf(jpeg, width, height) {
  const encode = (text) => new TextEncoder().encode(text);
  const parts = [];
  const offsets = [0];
  let length = 0;

  function append(value) {
    const bytes =
      typeof value === "string" ? encode(value) : value;

    parts.push(bytes);
    length += bytes.length;
  }

  function object(id, body) {
    offsets[id] = length;
    append(`${id} 0 obj\n${body}\nendobj\n`);
  }

  append("%PDF-1.4\n");

  object(1, "<< /Type /Catalog /Pages 2 0 R >>");

  object(
    2,
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  );

  object(
    3,
    "<< /Type /Page /Parent 2 0 R " +
      "/MediaBox [0 0 595.28 841.89] " +
      "/Resources << /XObject << /Im0 4 0 R >> >> " +
      "/Contents 5 0 R >>",
  );

  offsets[4] = length;

  append(
    `4 0 obj\n<< /Type /XObject /Subtype /Image ` +
      `/Width ${width} /Height ${height} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 ` +
      `/Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
  );

  append(jpeg);
  append("\nendstream\nendobj\n");

  const content =
    "q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n";

  object(
    5,
    `<< /Length ${encode(content).length} >>\n` +
      `stream\n${content}endstream`,
  );

  const xref = length;

  append("xref\n0 6\n0000000000 65535 f \n");

  for (let index = 1; index <= 5; index += 1) {
    append(
      `${String(offsets[index]).padStart(10, "0")} 00000 n \n`,
    );
  }

  append(
    `trailer\n<< /Size 6 /Root 1 0 R >>\n` +
      `startxref\n${xref}\n%%EOF\n`,
  );

  return new Blob(parts, { type: "application/pdf" });
}

export async function downloadChart({
  title,
  metric,
  rows,
  filters = [],
  format,
}) {
  if (!["png", "pdf"].includes(format)) {
    throw new Error("Неподдерживаемый формат.");
  }

  if (!rows.length) {
    throw new Error("Нет данных для экспорта.");
  }

  await document.fonts.ready;

  const width = 794;

  const height =
    format === "pdf"
      ? 1123
      : Math.max(320, 156 + rows.length * 48);

  const canvas = document.createElement("canvas");

  canvas.width = width * 2;
  canvas.height = height * 2;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Браузер не поддерживает экспорт графика.");
  }

  ctx.scale(2, 2);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.textBaseline = "top";

  function text(
    value,
    x,
    y,
    size = 14,
    color = "#101828",
    bold = false,
  ) {
    ctx.font =
      `${bold ? "500" : "400"} ${size}px ` +
      '"Rostelecom Basis", Arial, sans-serif';

    ctx.fillStyle = color;
    ctx.fillText(String(value), x, y);
  }

  function fit(value, maxWidth) {
    const original = String(value);

    if (ctx.measureText(original).width <= maxWidth) {
      return original;
    }

    let result = original;

    while (
      result &&
      ctx.measureText(result + "…").width > maxWidth
    ) {
      result = result.slice(0, -1);
    }

    return result + "…";
  }

  function wrapped(value, x, y, maxWidth) {
    ctx.font =
      '400 14px "Rostelecom Basis", Arial, sans-serif';

    let line = "";

    for (const character of String(value)) {
      if (
        line &&
        ctx.measureText(line + character).width > maxWidth
      ) {
        text(line, x, y);
        line = "";
        y += 20;
      }

      line += character;
    }

    text(line, x, y);
    return y + 28;
  }

  text(title, 40, 36, 24, "#101828", true);
  text(metric, 40, 76, 14, "#747984");

  const maximum = Math.max(
    1,
    ...rows.map(([, value]) => value),
  );

  let y = 126;

  for (const [label, value] of rows) {
    ctx.font =
      '400 14px "Rostelecom Basis", Arial, sans-serif';

    text(fit(label, 235), 40, y);

    ctx.fillStyle = "#f1f2f4";
    ctx.fillRect(290, y + 2, 400, 12);

    ctx.fillStyle = "#7700ff";
    ctx.fillRect(290, y + 2, (value / maximum) * 400, 12);

    text(value.toLocaleString("ru-RU"), 710, y);
    y += 48;
  }

  if (format === "pdf") {
    text(
      "Применённые фильтры",
      40,
      y + 24,
      18,
      "#101828",
      true,
    );

    y += 62;

    const details = filters.length
      ? filters
      : [["Фильтры графика", "Не заданы"]];

    for (const [label, value] of details) {
      y = wrapped(`${label}: ${value}`, 40, y, 714);

      if (y > 1000) {
        throw new Error(
          "Слишком много данных для одной страницы PDF.",
        );
      }
    }

    text(
      `Дата экспорта: ${new Date().toLocaleDateString("ru-RU")}`,
      40,
      1068,
      12,
      "#747984",
    );
  }

  const blob =
    format === "png"
      ? await canvasBlob(canvas, "image/png")
      : imagePdf(
          new Uint8Array(
            await (
              await canvasBlob(canvas, "image/jpeg", 0.95)
            ).arrayBuffer(),
          ),
          canvas.width,
          canvas.height,
        );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;

  link.download =
    `${title.replace(/[<>:"/\\|?*]/g, "-")}-` +
    `${format === "pdf" ? "отчёт" : "график"}.${format}`;

  document.body.append(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}