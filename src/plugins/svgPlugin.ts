import { Plugin } from "@pdfme/generator";

const svgPlugin: Plugin = {
  pdf: async ({ value, schema }) => {
    const { width, height, position } = schema;

    // Создаем элемент SVG
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("width", width.toString());
    svgElement.setAttribute("height", height.toString());
    svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svgElement.innerHTML = value;

    // Конвертируем SVG в изображение
    const img = new Image();
    img.src = `data:image/svg+xml;base64,${btoa(svgElement.outerHTML)}`;

    // Ожидаем загрузки изображения
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Возвращаем изображение для вставки в PDF
    return { image: img, x: position.x, y: position.y, width, height };
  },
};

export default svgPlugin;
