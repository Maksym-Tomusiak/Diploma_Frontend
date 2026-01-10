"use client";

import {
  Plus,
  Edit,
  MoreHorizontal,
  Type,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/Pagination";
import { Font } from "@/types/document";
import { formatDate } from "@/lib/formatters";

interface FontsTableProps {
  fonts: Font[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  fontsLoading: boolean;
  fontsError: string | null;
  onSeedFonts: () => void;
  onRefresh: () => void;
}

export function FontsTable({
  fonts,
  searchQuery,
  setSearchQuery,
  currentPage,
  totalPages,
  onPageChange,
  fontsLoading,
  fontsError,
  onSeedFonts,
  onRefresh,
}: FontsTableProps) {
  const [selectedFont, setSelectedFont] = useState<Font | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (font: Font) => {
    setSelectedFont(font);
    setDetailsOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-[12px] items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Available Fonts
        </h2>
        <div className="flex gap-2">
          <Button onClick={onRefresh} variant="outline" disabled={fontsLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${fontsLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={onSeedFonts}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Seed Fonts
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search fonts by family name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        {fontsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
          </div>
        ) : fontsError ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-slate-600">{fontsError}</p>
            <Button variant="outline" onClick={onRefresh}>
              Retry
            </Button>
          </div>
        ) : fonts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Type className="h-10 w-10 text-slate-300" />
            <p className="text-slate-600">No fonts available</p>
            <p className="text-sm text-slate-500">
              Seed fonts from Google Web Fonts API
            </p>
            <Button
              onClick={onSeedFonts}
              className="mt-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Seed Fonts
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-b border-slate-200 hover:bg-slate-50">
                  <TableHead className="w-[30%] font-semibold text-slate-700">
                    Font Family
                  </TableHead>
                  <TableHead className="w-[18%] font-semibold text-slate-700">
                    Category
                  </TableHead>
                  <TableHead className="w-[15%] font-semibold text-slate-700">
                    Variants
                  </TableHead>
                  <TableHead className="w-[22%] font-semibold text-slate-700">
                    Added Date
                  </TableHead>
                  <TableHead className="w-[15%] text-right font-semibold text-slate-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fonts.map((font) => (
                  <TableRow
                    key={font.id}
                    className="hover:bg-slate-50 border-b border-slate-100"
                  >
                    <TableCell
                      className="font-medium"
                      style={{ fontFamily: font.family }}
                    >
                      {font.family}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {font.category || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {font.variants?.split(",").length || 0}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {formatDate(font.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(font)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Font Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Font Details</DialogTitle>
            <DialogDescription>
              Information about {selectedFont?.family}
            </DialogDescription>
          </DialogHeader>
          {selectedFont && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <div
                  className="text-2xl font-medium"
                  style={{ fontFamily: selectedFont.family }}
                >
                  {selectedFont.family}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={selectedFont.category || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Version</Label>
                <Input value={selectedFont.version || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Variants</Label>
                <div className="max-h-32 overflow-y-auto border rounded-md p-2 pr-4 text-sm">
                  {selectedFont.variants?.split(",").join(", ") || "N/A"}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subsets</Label>
                <div className="max-h-32 overflow-y-auto border rounded-md p-2 pr-4 text-sm">
                  {selectedFont.subsets?.split(",").join(", ") || "N/A"}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Last Modified</Label>
                <Input value={selectedFont.last_modified || "N/A"} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Added Date</Label>
                <Input value={formatDate(selectedFont.created_at)} readOnly />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-4"
      />
    </>
  );
}
