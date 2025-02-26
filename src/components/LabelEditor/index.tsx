import React, { useEffect, useRef, useState } from "react";
import { Canvas, Text, Image } from "fabric";
import { generate, Renderer } from "@pdfme/generator";
import svgRenderer from "../../utils/svgRenderer";
import { generatePDF } from "../../utils/helper";
import svgPlugin from "../../plugins/svgPlugin";
import { BLANK_PDF, Template } from "@pdfme/common";
import { text, image, barcodes } from "@pdfme/schemas";

const LabelEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  // Инициализация Fabric.js
  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new Canvas(canvasRef.current);
      setCanvas(fabricCanvas);

      // Добавление текста
      const text = new Text("Hello World", {
        left: 50,
        top: 50,
        fontSize: 30,
        fontFamily: "Arial",
      });
      fabricCanvas.add(text);

      // Добавление изображения
      Image.fromURL("https://example.com/image.png", (img) => {
        img.set({ left: 200, top: 200 });
        fabricCanvas.add(img);
      });

      // Очистка при размонтировании
      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

  const template: Template = {
    basePdf: BLANK_PDF,
    schemas: [
      [
        {
          name: "example_text",
          type: "text",
          position: { x: 0, y: 0 },
          width: 40,
          height: 10,
        },
      ],
    ],
  };

  const handleExportPDF = async () => {
    if (!canvas) return;

    // Экспорт холста в изображение (PNG)
    const imageURL = canvas.toDataURL("png");

    // Создание шаблона для PDFMe

    // Данные для заполнения шаблона
    const inputs = [{ label: imageURL }];

    try {
      // Генерация PDF
      const pdf = await generate({
        template,
        inputs,
        plugins: {
          text,
          image,
          qrcode: barcodes.qrcode,
        },
      });

      // Создание ссылки для скачивания
      const blob = new Blob([pdf], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "label.pdf";
      link.click();
    } catch (error) {
      console.error("Ошибка при генерации PDF:", error);
    }
  };
  //   const handleExportPDF = () => {
  //     generate({ template, inputs: [{ a: "a1", b: "b1", c: "c1" }] }).then(
  //       (pdf) => {
  //         // Browser
  //         const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  //         window.open(URL.createObjectURL(blob));

  //         // Node.js
  //         // fs.writeFileSync(path.join(__dirname, `test.pdf`), pdf);
  //       }
  //     );
  //   };

  return (
    <div>
      <h1>Редактор этикеток</h1>
      <canvas ref={canvasRef} width={800} height={600} />
      <button onClick={handleExportPDF}>Экспорт в PDF</button>
    </div>
  );
};

export default LabelEditor;
