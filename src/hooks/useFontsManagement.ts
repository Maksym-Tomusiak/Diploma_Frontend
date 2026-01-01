import { useState, useEffect } from "react";
import { fontService } from "@/services/FontService";
import type { Font } from "@/types/document";
import { useToast } from "@/hooks/use-toast";

export function useFontsManagement(
  isAdmin: boolean,
  authLoading: boolean,
  activeTab: string
) {
  const { toast } = useToast();
  const [fonts, setFonts] = useState<Font[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [fontsLoading, setFontsLoading] = useState(false);
  const [fontsError, setFontsError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      // Reset to first page when search query changes
      if (searchQuery !== debouncedSearchQuery) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch fonts
  const fetchFonts = async () => {
    try {
      setFontsLoading(true);
      setFontsError(null);
      const skip = (currentPage - 1) * pageSize;
      const data = await fontService.getFonts(
        skip,
        pageSize,
        debouncedSearchQuery || undefined
      );
      setFonts(data.fonts);
      setTotal(data.total);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setFontsError(err.response?.data?.detail || "Failed to load fonts");
      }
    } finally {
      setFontsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (!authLoading && isAdmin && activeTab === "fonts") {
      fetchFonts();
    }

    return () => controller.abort();
  }, [authLoading, isAdmin, activeTab, currentPage, debouncedSearchQuery]);

  const handleSeedFonts = async () => {
    if (
      !confirm(
        "Are you sure you want to seed fonts from Google Web Fonts API? This will fetch all available fonts."
      )
    ) {
      return;
    }

    try {
      setSeeding(true);
      const result = await fontService.seedFonts();

      toast({
        title: "Fonts seeded successfully",
        description: `Added ${result.fonts_added} fonts from Google Web Fonts API.`,
      });

      // Refresh fonts list
      await fetchFonts();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to seed fonts",
        description:
          err.response?.data?.detail ||
          "An error occurred while seeding fonts. Make sure GOOGLE_FONTS_API_KEY is set in environment variables.",
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleRefresh = () => {
    fetchFonts();
  };

  return {
    fonts,
    total,
    currentPage,
    totalPages,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    fontsLoading,
    fontsError,
    seeding,
    handleSeedFonts,
    handleRefresh,
  };
}
