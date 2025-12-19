"use client";

import { useEffect, useState } from "react";

// Types for Google global objects
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export interface GoogleDocument {
  id: string;
  name: string;
  mimeType: string;
  iconUrl?: string;
}

export function useGooglePicker() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load only GAPI for picker (no need for separate auth)
    const loadGapi = async () => {
      if (!window.gapi) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://apis.google.com/js/api.js";
          script.async = true;
          script.defer = true;
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      // Initialize picker module
      window.gapi.load("picker", () => {
        setIsLoaded(true);
        setIsLoading(false);
      });
    };

    loadGapi();
  }, []);

  // Now accepts accessToken as a parameter from backend session
  const openPicker = (
    accessToken: string,
    onSelect: (doc: GoogleDocument) => void,
    onCancel?: () => void
  ) => {
    if (!isLoaded) {
      console.error("Google Picker API not loaded yet");
      return;
    }

    if (!accessToken) {
      console.error("No access token provided");
      return;
    }

    const appId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.split("-")[0] || "";

    const picker = new window.google.picker.PickerBuilder()
      .addView(
        new window.google.picker.DocsView(window.google.picker.ViewId.DOCUMENTS)
          .setMode(window.google.picker.DocsViewMode.LIST)
          .setSelectFolderEnabled(false)
      )
      .setOAuthToken(accessToken) // Use token from backend OAuth flow
      .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "")
      .setAppId(appId)
      .setCallback((data: any) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const doc = data.docs[0];
          onSelect({
            id: doc.id,
            name: doc.name,
            mimeType: doc.mimeType,
            iconUrl: doc.iconUrl,
          });
        } else if (data.action === window.google.picker.Action.CANCEL) {
          if (onCancel) onCancel();
        }
      })
      .setTitle("Select a Google Document")
      .build();

    picker.setVisible(true);
  };

  return {
    isLoaded,
    isLoading,
    openPicker,
  };
}
