import { useCallback, useEffect, useRef } from "react";
import { Designer } from "@pdfme/ui";
import {
  generatePDF,
  getBlankTemplate,
  getFontsData,
} from "../../utils/helper";
import { Template } from "@pdfme/common";
import { getPlugins } from "../../plugins";

const PDFEditor = () => {
  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);

  const buildDesigner = useCallback(async () => {
    if (!designerRef.current) return;
    try {
      let template: Template = getBlankTemplate();

      designer.current = new Designer({
        domContainer: designerRef.current,
        template,
        options: {
          font: getFontsData(),
          lang: "en",
          labels: {
            "signature.clear": "🗑️",
          },
          theme: {
            token: { colorPrimary: "#25c2a0" },
          },
          icons: {
            multiVariableText:
              '<svg fill="#000000" width="24px" height="24px" viewBox="0 0 24 24"><path d="M6.643,13.072,17.414,2.3a1.027,1.027,0,0,1,1.452,0L20.7,4.134a1.027,1.027,0,0,1,0,1.452L9.928,16.357,5,18ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"/></svg>',
          },
          maxZoom: 250,
        },
        plugins: getPlugins(),
      });
    } catch {
      localStorage.removeItem("template");
    }
  }, []);

  useEffect(() => {
    if (designerRef.current) {
      buildDesigner();
    }
    return () => {
      designer.current?.destroy();
    };
  }, [designerRef, buildDesigner]);

  const handleGeneratePDF = async () => {
    await generatePDF(designer.current);
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex justify-end gap-2 p-2'>
        <button
          className='border-1 border-black p-1 rounded-md cursor-pointer'
          onClick={handleGeneratePDF}
        >
          Export PDF
        </button>
      </div>
      <div className='flex-1 w-full' ref={designerRef} />
    </div>
  );
};

export default PDFEditor;
