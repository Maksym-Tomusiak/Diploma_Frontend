"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Zap } from "lucide-react";
import { X } from "lucide-react";
import Link from "next/link";

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LimitReachedModal({ isOpen, onClose }: LimitReachedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md border-none p-0 overflow-hidden bg-white shadow-2xl"
      >
        <div className="bg-blue-600 h-24 flex items-center justify-center relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700"></div>
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-800/30 rounded-full blur-3xl"></div>
          <Zap className="h-12 w-12 text-white relative z-10 animate-pulse" />
        </div>

        <div className="p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 mb-2">
              Ліміт вичерпано!
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-base leading-relaxed">
              Ви використали всі безкоштовні перевірки на сьогодні. Щоб
              продовжувати користуватися сервісом без обмежень, будь ласка,
              увійдіть у свій акаунт.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-3">
            <Link href="/login" className="block w-full">
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold shadow-lg shadow-blue-200">
                Увійти через Google
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full h-11 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
            >
              Спробувати пізніше
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldAlert className="h-3 w-3" />
            <span>Це допомагає нам підтримувати сервіс безкоштовним</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
