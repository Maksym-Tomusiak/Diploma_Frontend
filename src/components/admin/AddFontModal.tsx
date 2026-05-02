"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddFontModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    family: string;
    category?: string;
    variants?: string;
    subsets?: string;
    version?: string;
  }) => Promise<boolean>;
}

export function AddFontModal({ isOpen, onClose, onSubmit }: AddFontModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    family: "",
    category: "sans-serif",
    variants: "regular,italic,700,700italic",
    subsets: "latin,cyrillic",
    version: "v1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.family) return;

    setLoading(true);
    const success = await onSubmit(formData);
    setLoading(false);
    
    if (success) {
      setFormData({
        family: "",
        category: "sans-serif",
        variants: "regular,italic,700,700italic",
        subsets: "latin,cyrillic",
        version: "v1",
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Додати шрифт вручну</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="family">Сімейство шрифту (Family)</Label>
            <Input
              id="family"
              placeholder="Наприклад: Roboto"
              value={formData.family}
              onChange={(e) => setFormData({ ...formData, family: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Категорія</Label>
            <Select 
              value={formData.category} 
              onValueChange={(val) => setFormData({ ...formData, category: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Оберіть категорію" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans-serif">Sans Serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="display">Display</SelectItem>
                <SelectItem value="handwriting">Handwriting</SelectItem>
                <SelectItem value="monospace">Monospace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="variants">Варіанти (через кому)</Label>
            <Input
              id="variants"
              placeholder="regular,700,italic"
              value={formData.variants}
              onChange={(e) => setFormData({ ...formData, variants: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subsets">Набори символів (через кому)</Label>
            <Input
              id="subsets"
              placeholder="latin,cyrillic"
              value={formData.subsets}
              onChange={(e) => setFormData({ ...formData, subsets: e.target.value })}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Скасувати
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.family}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Додавання..." : "Додати шрифт"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
