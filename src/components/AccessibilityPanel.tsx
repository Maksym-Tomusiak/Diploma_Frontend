"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accessibility, Eye, Zap, BookOpen, MousePointer2 } from "lucide-react";

type ContrastMode =
  | "none"
  | "high"
  | "dark"
  | "invert"
  | "monochrome"
  | "low-saturation"
  | "high-saturation";

type CursorMode = "normal" | "big-black" | "big-white";
type TextAlign = "initial" | "left" | "center" | "right";
type TextTransform = "none" | "uppercase";

interface A11ySettings {
  fontSizeIndex: number;
  lineHeightIndex: number;
  letterSpacingIndex: number;
  textAlign: TextAlign;
  textTransform: TextTransform;
  contrastMode: ContrastMode;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  cursorMode: CursorMode;
  pauseAnimations: boolean;
  dyslexiaFont: boolean;
  boldText: boolean;
  readMask: boolean;
}

const defaultSettings: A11ySettings = {
  fontSizeIndex: 0,
  lineHeightIndex: 0,
  letterSpacingIndex: 0,
  textAlign: "initial",
  textTransform: "none",
  contrastMode: "none",
  highlightLinks: false,
  highlightHeadings: false,
  cursorMode: "normal",
  pauseAnimations: false,
  dyslexiaFont: false,
  boldText: false,
  readMask: false,
};

const fontSizes = ["100%", "120%", "140%", "160%", "180%"];
const lineHeights = ["1.5", "1.75", "2.0", "2.25"];
const letterSpacings = ["normal", "0.05em", "0.1em", "0.15em"];

export function AccessibilityPanel() {
  const [settings, setSettings] = useState<A11ySettings>(defaultSettings);
  const [isOpen, setIsOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("a11y-settings");
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to parse a11y settings", e);
      }
    }
  }, []);

  // Save to local storage & apply styles
  useEffect(() => {
    localStorage.setItem("a11y-settings", JSON.stringify(settings));

    const root = document.documentElement;
    const body = document.body;

    root.style.setProperty(
      "--a11y-font-size",
      fontSizes[settings.fontSizeIndex],
    );
    body.style.setProperty(
      "--a11y-line-height",
      lineHeights[settings.lineHeightIndex],
    );
    body.style.setProperty(
      "--a11y-letter-spacing",
      letterSpacings[settings.letterSpacingIndex],
    );
    body.style.setProperty("--a11y-text-align", settings.textAlign);
    body.style.setProperty("--a11y-text-transform", settings.textTransform);

    // Apply classes
    const classesToRemove = [
      "a11y-line-height",
      "a11y-letter-spacing",
      "a11y-text-align-left",
      "a11y-text-align-center",
      "a11y-text-align-right",
      "a11y-text-transform",
      "a11y-contrast-high",
      "a11y-contrast-dark",
      "a11y-invert",
      "a11y-monochrome",
      "a11y-low-saturation",
      "a11y-high-saturation",
      "a11y-highlight-links",
      "a11y-highlight-headings",
      "a11y-cursor-big-black",
      "a11y-cursor-big-white",
      "a11y-pause-animations",
      "a11y-dyslexia-font",
      "a11y-bold-text",
    ];
    body.classList.remove(...classesToRemove);

    if (settings.lineHeightIndex !== 0) body.classList.add("a11y-line-height");
    if (settings.letterSpacingIndex !== 0)
      body.classList.add("a11y-letter-spacing");
    if (settings.textAlign !== "initial")
      body.classList.add(`a11y-text-align-${settings.textAlign}`);
    if (settings.textTransform !== "none")
      body.classList.add("a11y-text-transform");

    if (settings.contrastMode === "high")
      body.classList.add("a11y-contrast-high");
    if (settings.contrastMode === "dark")
      body.classList.add("a11y-contrast-dark");
    if (settings.contrastMode === "invert") body.classList.add("a11y-invert");
    if (settings.contrastMode === "monochrome")
      body.classList.add("a11y-monochrome");
    if (settings.contrastMode === "low-saturation")
      body.classList.add("a11y-low-saturation");
    if (settings.contrastMode === "high-saturation")
      body.classList.add("a11y-high-saturation");

    if (settings.highlightLinks) body.classList.add("a11y-highlight-links");
    if (settings.highlightHeadings)
      body.classList.add("a11y-highlight-headings");

    if (settings.cursorMode === "big-black")
      body.classList.add("a11y-cursor-big-black");
    if (settings.cursorMode === "big-white")
      body.classList.add("a11y-cursor-big-white");

    if (settings.pauseAnimations) body.classList.add("a11y-pause-animations");
    if (settings.dyslexiaFont) body.classList.add("a11y-dyslexia-font");
    if (settings.boldText) body.classList.add("a11y-bold-text");
  }, [settings]);

  const updateSetting = <K extends keyof A11ySettings>(
    key: K,
    value: A11ySettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const applyProfile = (profile: string) => {
    let newSettings = { ...defaultSettings };
    switch (profile) {
      case "seizure":
        newSettings.pauseAnimations = true;
        newSettings.contrastMode = "low-saturation";
        break;
      case "vision":
        newSettings.contrastMode = "high";
        newSettings.fontSizeIndex = 2; // 140%
        newSettings.boldText = true;
        break;
      case "dyslexia":
        newSettings.dyslexiaFont = true;
        newSettings.letterSpacingIndex = 1;
        newSettings.textAlign = "left";
        break;
      case "cognitive":
        newSettings.readMask = true;
        newSettings.pauseAnimations = true;
        break;
      case "motor":
        newSettings.highlightLinks = true;
        newSettings.highlightHeadings = true;
        // bigger cursor too
        newSettings.cursorMode = "big-black";
        break;
    }
    setSettings(newSettings);
  };

  const resetSettings = () => setSettings(defaultSettings);

  const topMaskRef = React.useRef<HTMLDivElement>(null);
  const bottomMaskRef = React.useRef<HTMLDivElement>(null);
  const centerMaskRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!settings.readMask) return;

    const handleMouseMove = (e: MouseEvent) => {
      const y = e.clientY;
      const maskHeight = 150; // Total height of the reading window
      const halfMask = maskHeight / 2;

      if (topMaskRef.current) {
        topMaskRef.current.style.height = `${Math.max(0, y - halfMask)}px`;
      }
      if (centerMaskRef.current) {
        centerMaskRef.current.style.top = `${Math.max(0, y - halfMask)}px`;
        centerMaskRef.current.style.height = `${maskHeight}px`;
      }
      if (bottomMaskRef.current) {
        bottomMaskRef.current.style.top = `${y + halfMask}px`;
        bottomMaskRef.current.style.height = `calc(100vh - ${y + halfMask}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Initialize position to center of screen on mount
    handleMouseMove(
      new MouseEvent("mousemove", { clientY: window.innerHeight / 2 }),
    );

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [settings.readMask]);

  // Keyboard shortcut to toggle panel (Alt+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+A (or Option+A)
      if (e.altKey && e.code === "KeyA") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="sm:max-w-lg h-[85vh] sm:h-[80vh] flex flex-col p-0 gap-0 overflow-hidden"
          showCloseButton={true}
        >
          <DialogHeader className="px-8 py-6 pb-4 border-b">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Accessibility className="h-6 w-6" />
              Панель доступності
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 px-8 py-6">
            <div className="space-y-8 pb-8">
              {/* Profiles */}
              <section className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5" /> Профілі (Пресет)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => applyProfile("seizure")}
                    className="justify-start text-xs h-auto py-2 px-3"
                  >
                    Безпека при епілепсії
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyProfile("vision")}
                    className="justify-start text-xs h-auto py-2 px-3"
                  >
                    Слабкий зір
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyProfile("dyslexia")}
                    className="justify-start text-xs h-auto py-2 px-3"
                  >
                    Дислексія
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyProfile("cognitive")}
                    className="justify-start text-xs h-auto py-2 px-3"
                  >
                    Когнітивні порушення
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => applyProfile("motor")}
                    className="justify-start text-xs h-auto py-2 px-3"
                  >
                    Моторні порушення
                  </Button>
                </div>
              </section>

              {/* Text Adaptation */}
              <section className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" /> Візуальна адаптація тексту
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Розмір шрифту</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateSetting(
                            "fontSizeIndex",
                            Math.max(0, settings.fontSizeIndex - 1),
                          )
                        }
                        aria-label="Зменшити розмір шрифту"
                      >
                        A-
                      </Button>
                      <span className="w-12 text-center text-sm">
                        {fontSizes[settings.fontSizeIndex]}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateSetting(
                            "fontSizeIndex",
                            Math.min(
                              fontSizes.length - 1,
                              settings.fontSizeIndex + 1,
                            ),
                          )
                        }
                        aria-label="Збільшити розмір шрифту"
                      >
                        A+
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Міжрядковий інтервал</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateSetting(
                            "lineHeightIndex",
                            Math.max(0, settings.lineHeightIndex - 1),
                          )
                        }
                        aria-label="Зменшити інтервал"
                      >
                        -
                      </Button>
                      <span className="w-12 text-center text-sm">
                        {lineHeights[settings.lineHeightIndex]}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateSetting(
                            "lineHeightIndex",
                            Math.min(
                              lineHeights.length - 1,
                              settings.lineHeightIndex + 1,
                            ),
                          )
                        }
                        aria-label="Збільшити інтервал"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Міжлітерний простір</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateSetting(
                            "letterSpacingIndex",
                            Math.max(0, settings.letterSpacingIndex - 1),
                          )
                        }
                        aria-label="Зменшити простір між літерами"
                      >
                        -
                      </Button>
                      <span className="w-12 text-center text-sm">
                        {settings.letterSpacingIndex === 0
                          ? "Норм"
                          : settings.letterSpacingIndex}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateSetting(
                            "letterSpacingIndex",
                            Math.min(
                              letterSpacings.length - 1,
                              settings.letterSpacingIndex + 1,
                            ),
                          )
                        }
                        aria-label="Збільшити простір між літерами"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Вирівнювання тексту</Label>
                    <div className="flex gap-2">
                      {["initial", "left", "center", "right"].map((align) => (
                        <Button
                          key={align}
                          variant={
                            settings.textAlign === align ? "default" : "outline"
                          }
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            updateSetting("textAlign", align as TextAlign)
                          }
                          aria-label={`Вирівняти ${align}`}
                        >
                          {align === "initial"
                            ? "Станд."
                            : align === "left"
                              ? "Ліво"
                              : align === "center"
                                ? "Центр"
                                : "Право"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="uppercase-toggle">Верхній регістр</Label>
                    <Switch
                      id="uppercase-toggle"
                      checked={settings.textTransform === "uppercase"}
                      onCheckedChange={(c) =>
                        updateSetting("textTransform", c ? "uppercase" : "none")
                      }
                      aria-label="Перетворити текст на верхній регістр"
                    />
                  </div>
                </div>
              </section>

              {/* Color & Contrast */}
              <section className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" /> Кольори та Контраст
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "none", label: "Стандартний" },
                    { val: "high", label: "Високий контраст" },
                    { val: "dark", label: "Темна тема" },
                    { val: "invert", label: "Інверсія кольорів" },
                    { val: "monochrome", label: "Монохромний" },
                    { val: "low-saturation", label: "Низька насиченість" },
                    { val: "high-saturation", label: "Висока насиченість" },
                  ].map((mode) => (
                    <Button
                      key={mode.val}
                      variant={
                        settings.contrastMode === mode.val
                          ? "default"
                          : "outline"
                      }
                      className="justify-start text-xs py-2 px-3 h-auto"
                      onClick={() =>
                        updateSetting("contrastMode", mode.val as ContrastMode)
                      }
                      aria-pressed={settings.contrastMode === mode.val}
                    >
                      {mode.label}
                    </Button>
                  ))}
                </div>
              </section>

              {/* Navigation Aids */}
              <section className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MousePointer2 className="h-5 w-5" /> Навігація та Взаємодія
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="highlight-links">
                      Підсвічувати посилання
                    </Label>
                    <Switch
                      id="highlight-links"
                      checked={settings.highlightLinks}
                      onCheckedChange={(c) =>
                        updateSetting("highlightLinks", c)
                      }
                      aria-label="Увімкнути підсвічування посилань"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="highlight-headings">
                      Підсвічувати заголовки
                    </Label>
                    <Switch
                      id="highlight-headings"
                      checked={settings.highlightHeadings}
                      onCheckedChange={(c) =>
                        updateSetting("highlightHeadings", c)
                      }
                      aria-label="Увімкнути підсвічування заголовків"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Розмір курсора</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={
                          settings.cursorMode === "normal"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => updateSetting("cursorMode", "normal")}
                      >
                        Стандарт
                      </Button>
                      <Button
                        variant={
                          settings.cursorMode === "big-black"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => updateSetting("cursorMode", "big-black")}
                      >
                        Великий чорний
                      </Button>
                      <Button
                        variant={
                          settings.cursorMode === "big-white"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => updateSetting("cursorMode", "big-white")}
                      >
                        Великий білий
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="pause-animations">Зупинити анімації</Label>
                    <Switch
                      id="pause-animations"
                      checked={settings.pauseAnimations}
                      onCheckedChange={(c) =>
                        updateSetting("pauseAnimations", c)
                      }
                      aria-label="Вимкнути всі анімації на сторінці"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="read-mask">Читальна маска</Label>
                    <Switch
                      id="read-mask"
                      checked={settings.readMask}
                      onCheckedChange={(c) => updateSetting("readMask", c)}
                      aria-label="Увімкнути читальну маску"
                    />
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>

          <div className="px-8 py-4 border-t bg-muted/30">
            <Button
              variant="destructive"
              className="w-full"
              onClick={resetSettings}
            >
              Скинути налаштування
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Read Mask implementation */}
      {settings.readMask && (
        <div className="fixed inset-0 pointer-events-none z-[9998]">
          <div
            ref={topMaskRef}
            className="absolute top-0 left-0 w-full bg-black/60 backdrop-blur-[1px]"
            style={{ height: "35vh" }}
          />
          <div
            ref={centerMaskRef}
            className="absolute left-0 w-full border-y-2 border-primary bg-transparent"
            style={{ top: "35vh", height: "15vh" }}
          />
          <div
            ref={bottomMaskRef}
            className="absolute left-0 w-full bg-black/60 backdrop-blur-[1px]"
            style={{ top: "50vh", height: "50vh" }}
          />
        </div>
      )}
    </>
  );
}
