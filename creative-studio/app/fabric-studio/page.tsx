"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type Tool = "select" | "text" | "rect" | "circle" | "image" | "brush" | "eraser";

type Layer = {
  id: number;
  name: string;
  visible: boolean;
  color: string;
  type: string;
};

const initialLayers: Layer[] = [
  { id: 1, name: "Background", visible: true, color: "#111827", type: "bg" },
  { id: 2, name: "Accent Card", visible: true, color: "#14b8a6", type: "rect" },
  { id: 3, name: "Glow Orb", visible: true, color: "#f59e0b", type: "circle" },
  { id: 4, name: "Title", visible: true, color: "#e5e7eb", type: "text" },
];

export default function FabricStudioPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<any | null>(null);
  const fabricRef = useRef<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [strokeColor, setStrokeColor] = useState("#14b8a6");
  const [fillColor, setFillColor] = useState("#8b5cf6");
  const [brushSize, setBrushSize] = useState(6);
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [selectedLayerName, setSelectedLayerName] = useState("Background");

  const getFabric = () => fabricRef.current;

  useEffect(() => {
    let cancelled = false;

    const initCanvas = async () => {
      try {
        const fabricModule = await import("fabric");
        const FabricCtor =
          (fabricModule as any).fabric ??
          (fabricModule as any).default ??
          fabricModule;

        if (!FabricCtor || typeof FabricCtor.Canvas !== "function") {
          throw new Error("Fabric failed to initialize on the client");
        }

        if (cancelled || !canvasRef.current) return;

        fabricRef.current = FabricCtor;

        const canvas = new FabricCtor.Canvas(canvasRef.current, {
          width: 980,
          height: 610,
          backgroundColor: "#0b1020",
          selectionColor: "#60a5fa",
          selectionLineWidth: 1,
          preserveObjectStacking: true,
        });

        fabricCanvasRef.current = canvas;

        const bg = new FabricCtor.Rect({
          left: 0,
          top: 0,
          width: 980,
          height: 610,
          fill: "#111827",
          selectable: false,
          evented: false,
          name: "Background",
          objectId: 1,
        });

        const card = new FabricCtor.Rect({
          left: 130,
          top: 170,
          width: 300,
          height: 190,
          rx: 32,
          ry: 32,
          fill: "#14b8a6",
          opacity: 0.88,
          shadow: "0 18px 55px rgba(20,184,166,0.38)",
          name: "Accent Card",
          objectId: 2,
        });

        const orb = new FabricCtor.Circle({
          left: 610,
          top: 200,
          radius: 118,
          fill: "#f59e0b",
          opacity: 0.76,
          shadow: "0 18px 55px rgba(245,158,11,0.35)",
          name: "Glow Orb",
          objectId: 3,
        });

        const title = new FabricCtor.Textbox("ASTERA", {
          left: 458,
          top: 396,
          width: 260,
          fontSize: 46,
          fontWeight: 700,
          fill: "#f8fafc",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          name: "Title",
          objectId: 4,
        });

        canvas.add(bg, card, orb, title);
        canvas.renderAll();

        canvas.on("selection:created", (event: any) => {
          const active = event.selected?.[0];
          if (active && "name" in active) {
            setSelectedLayerName(String(active.name || "Object"));
          }
        });

        canvas.on("selection:updated", (event: any) => {
          const active = event.selected?.[0];
          if (active && "name" in active) {
            setSelectedLayerName(String(active.name || "Object"));
          }
        });

        canvas.on("selection:cleared", () => {
          setSelectedLayerName("Nothing selected");
        });
      } catch (error) {
        console.error("Fabric init failed:", error);
      }
    };

    initCanvas();

    return () => {
      cancelled = true;
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.dispose();
        fabricCanvasRef.current = null;
      }
      fabricRef.current = null;
    };
  }, []);

  const syncCanvasMode = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = activeTool === "brush";
    canvas.selection = activeTool === "select";
    canvas.hoverCursor = activeTool === "select" ? "move" : "crosshair";
  };

  useEffect(() => {
    syncCanvasMode();
  }, [activeTool]);

  const getCanvas = () => fabricCanvasRef.current;

  const addText = () => {
    const canvas = getCanvas();
    const fabricLib = getFabric();
    if (!canvas || !fabricLib) return;

    const text = new fabricLib.Textbox("New Text", {
      left: 300,
      top: 260,
      width: 220,
      fontSize: 30,
      fontWeight: 600,
      fill: "#ffffff",
      fontFamily: "Inter, sans-serif",
      borderColor: "#93c5fd",
      cornerColor: "#93c5fd",
      name: "Text Layer",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setSelectedLayerName("Text Layer");
  };

  const addRect = () => {
    const canvas = getCanvas();
    const fabricLib = getFabric();
    if (!canvas || !fabricLib) return;

    const rect = new fabricLib.Rect({
      left: 240,
      top: 160,
      width: 180,
      height: 120,
      fill: fillColor,
      rx: 24,
      ry: 24,
      opacity: 0.9,
      name: "Rectangle Layer",
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    setSelectedLayerName("Rectangle Layer");
  };

  const addCircle = () => {
    const canvas = getCanvas();
    const fabricLib = getFabric();
    if (!canvas || !fabricLib) return;

    const circle = new fabricLib.Circle({
      left: 520,
      top: 210,
      radius: 90,
      fill: fillColor,
      opacity: 0.82,
      name: "Circle Layer",
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    setSelectedLayerName("Circle Layer");
  };

  const addImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      const fabricLib = getFabric();
      if (!fabricLib) return;

      fabricLib.Image.fromURL(data, (img: any) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const object = img as any;
        object.set({
          left: 260,
          top: 180,
          scaleX: 0.7,
          scaleY: 0.7,
          name: "Image Layer",
        });

        canvas.add(object);
        canvas.setActiveObject(object);
        canvas.renderAll();
        setSelectedLayerName("Image Layer");
      });
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const deleteSelectedObject = () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  const exportPng = () => {
    const canvas = getCanvas();
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "astera-design.png";
    link.href = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
    link.click();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        deleteSelectedObject();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleLayerVisibility = (id: number) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );

    const canvas = getCanvas();
    if (!canvas) return;

    canvas.getObjects().forEach((obj: any) => {
      if (obj.objectId === id) {
        obj.visible = !obj.visible;
      }
    });

    canvas.renderAll();
  };

  const topTools = [
    { key: "select", label: "S" },
    { key: "text", label: "T" },
    { key: "rect", label: "R" },
    { key: "circle", label: "C" },
    { key: "image", label: "I" },
    { key: "brush", label: "B" },
    { key: "eraser", label: "E" },
  ] as const;

  return (
    <main className="studio-shell min-h-screen text-slate-100">
      <div className="mx-auto flex h-screen max-w-[1850px] flex-col">
        <header className="app-header flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-4">
            <div className="brand-mark flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black shadow-[0_12px_30px_rgba(59,130,246,0.45)]">
              A
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-slate-400">
                Creative Suite
              </p>
              <h1 className="text-xl font-semibold tracking-tight">Astera Studio</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {["File", "Edit", "Image", "Layer", "Type", "Select"].map((item) => (
              <button
                key={item}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-medium text-slate-300 transition hover:border-white/15 hover:bg-white/[0.07]"
              >
                {item}
              </button>
            ))}
            <button className="ml-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-[11px] font-semibold text-white shadow-[0_12px_25px_rgba(59,130,246,0.45)]">
              Share
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="toolbar-rail w-[96px] border-r border-white/10 bg-[#0b1524]/80">
            <div className="flex flex-col items-center gap-3 px-3 py-5">
              {topTools.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTool(key);
                    if (key === "text") addText();
                    if (key === "rect") addRect();
                    if (key === "circle") addCircle();
                    if (key === "image") fileInputRef.current?.click();
                    if (key === "eraser") setActiveTool("select");
                  }}
                  className={`tool-button flex h-12 w-12 items-center justify-center rounded-2xl border text-xs font-bold transition ${
                    activeTool === key ? "active" : "inactive"
                  }`}
                  title={key}
                >
                  {label}
                </button>
              ))}
            </div>
          </aside>

          <aside className="panel-surface w-[300px] border-r border-white/10 p-4">
            <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <p className="mb-2 text-[10px] uppercase tracking-[0.26em] text-slate-400">
                Project
              </p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Brand Launch</h2>
                  <p className="text-xs text-slate-400">Q4 creative system</p>
                </div>
                <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                  Live
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="mb-3 text-[10px] uppercase tracking-[0.26em] text-slate-400">
                Quick actions
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={addText} className="mini-action">Add text</button>
                <button onClick={addRect} className="mini-action">Add rect</button>
                <button onClick={addCircle} className="mini-action">Add circle</button>
                <button onClick={() => fileInputRef.current?.click()} className="mini-action">Import</button>
                <button onClick={deleteSelectedObject} className="mini-action danger">Delete</button>
                <button onClick={exportPng} className="mini-action accent">Export</button>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={addImage} className="hidden" />
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f1b2d]/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.26em] text-slate-400">Layers</p>
                <button className="text-[10px] uppercase tracking-[0.18em] text-cyan-300">+ Add</button>
              </div>

              <div className="space-y-2">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 transition hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full ring-2 ring-white/10" style={{ background: layer.color }} />
                      <span className="text-sm text-slate-200">{layer.name}</span>
                    </div>

                    <button
                      onClick={() => toggleLayerVisibility(layer.id)}
                      className={`h-6 w-11 rounded-full border transition ${
                        layer.visible ? "border-emerald-400/60 bg-emerald-500/20" : "border-white/10 bg-slate-800"
                      }`}
                    >
                      <span
                        className={`block h-4 w-4 rounded-full bg-white transition ${
                          layer.visible ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex flex-1 flex-col bg-[#091321]">
            <div className="border-b border-white/10 bg-[#0a1422]/90 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Workspace
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    16:10
                  </div>
                  <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-300">
                    Smart Layout
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.08]">
                    Undo
                  </button>
                  <button className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.08]">
                    Redo
                  </button>
                  <button className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_25px_rgba(168,85,247,0.42)]">
                    Publish
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.9),_rgba(2,6,23,1)_68%)] p-6">
              <div className="workspace-frame relative w-full max-w-[1280px] overflow-hidden rounded-[30px] border border-white/10 bg-[#0f172a]/80 shadow-[0_40px_100px_rgba(15,23,42,0.9)]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.26em] text-slate-400">
                    astera-brand.ai
                  </div>
                </div>

                <div className="canvas-toolbar flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                  {[
                    "Move Tool",
                    "Adjustment",
                    "Brush",
                    "Mask",
                    "Crop",
                    "Smart Object",
                  ].map((item) => (
                    <button
                      key={item}
                      className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-300 hover:bg-white/[0.06]"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="overflow-hidden rounded-b-[30px] p-4">
                  <div className="mx-auto flex w-full items-center justify-center overflow-auto rounded-[24px] border border-white/10 bg-[#0b1020] p-2 shadow-[inset_0_1px_0_rgba(148,163,184,0.1)]">
                    <canvas ref={canvasRef} id="studio-canvas" className="max-w-full rounded-[18px]" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="panel-surface w-[320px] border-l border-white/10 p-4">
            <div className="mb-5">
              <p className="mb-3 text-[10px] uppercase tracking-[0.26em] text-slate-400">Inspector</p>

              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div>
                  <label className="mb-1 block text-xs text-slate-400">Stroke color</label>
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="h-10 w-full rounded-xl border border-white/10 bg-[#101d30] p-1"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-400">Fill color</label>
                  <input
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="h-10 w-full rounded-xl border border-white/10 bg-[#101d30] p-1"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-400">Brush size</label>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-400">Active tool</label>
                  <div className="rounded-xl border border-white/10 bg-[#101d30] px-3 py-2 text-sm text-slate-200 uppercase tracking-[0.12em]">
                    {activeTool}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f1b2d]/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <p className="mb-3 text-[10px] uppercase tracking-[0.26em] text-slate-400">Properties</p>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Selected</span>
                  <span className="text-slate-400">{selectedLayerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Position</span>
                  <span className="text-slate-400">X 520 / Y 180</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Size</span>
                  <span className="text-slate-400">280 × 200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rotation</span>
                  <span className="text-slate-400">0°</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Scale</span>
                  <span className="text-slate-400">100%</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
