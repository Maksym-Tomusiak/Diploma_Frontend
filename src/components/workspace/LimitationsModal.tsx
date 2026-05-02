"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, AlertTriangle, ShieldCheck } from "lucide-react";

interface LimitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LimitationsModal({ isOpen, onClose }: LimitationsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[95vh] overflow-y-auto flex flex-col p-0">
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Info className="h-5 w-5 text-blue-600" />
              Технічні обмеження та особливості
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-base pt-2">
              Будь ласка, ознайомтеся з деякими нюансами роботи системи для кращого розуміння результатів.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 p-6 py-4 flex-1">
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-amber-50 border border-amber-100">
            <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">Нумерація сторінок</h4>
              <p className="text-sm text-amber-800 leading-relaxed">
                Через технічні обмеження Google Docs API, програма не може самостійно 
                <strong> увімкнути</strong> нумерацію, якщо вона відсутня. Проте, якщо 
                нумерація вже додана в документ, система успішно перевірить її формат та зможе відредагувати параметри.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
            <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Генерація контенту</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Програма фокусується виключно на <strong>перевірці та форматуванні</strong> структури. 
                Ми свідомо не займаємося автоматичною генерацією підписів чи джерел для зображень, 
                щоб зберегти точність та надати вам повний контроль над змістом роботи.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2">
          <DialogFooter>
            <Button onClick={onClose} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800">
              Зрозуміло
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
