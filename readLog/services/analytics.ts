import { Mixpanel } from "mixpanel-react-native";

const MIXPANEL_TOKEN = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN ?? "";

export const mixpanel = new Mixpanel(MIXPANEL_TOKEN, true);

let isInitialized = false;

export async function initAnalytics(): Promise<void> {
  try {
    await mixpanel.init();
    isInitialized = true;
  } catch (e) {
    console.error("[Analytics] Mixpanel init failed", e);
  }
}

export type Tracker = (event: string, props: Record<string, unknown>) => void;

export type AnalyticsEvent =
  | {
      event: "ol_search";
      properties: { mode: "title" | "isbn"; query: string };
    }
  | {
      event: "ol_search_success";
      properties: {
        mode: "title" | "isbn";
        query: string;
        resultCount: number;
      };
    }
  | {
      event: "ol_search_error";
      properties: {
        mode: "title" | "isbn";
        query: string;
        status: number;
        reason: "http_error" | "network_failure";
      };
    }
  | {
      event: "book_added";
      properties: { olKey: string; title: string; hasCover: boolean };
    }
  | {
      event: "book_removed";
      properties: { olKey: string; title: string };
    }
  | {
      event: "book_finished";
      properties: {
        olKey: string;
        title: string;
        totalSessions: number;
        totalTimeSeconds: number;
      };
    }
  | {
      event: "session_started";
      properties: { olKey: string; title: string };
    }
  | {
      event: "session_ended";
      properties: {
        olKey: string;
        title: string;
        durationSeconds: number;
        pagesRead: number;
      };
    };

export function useAnalytics(): { track: Tracker } {
  const track: Tracker = (event, properties) => {
    // Dev-only logging so you can still verify events fire during development
    if (__DEV__) {
      console.log(`[Analytics] ${event}`, properties);
      return;
    }

    if (!isInitialized) {
      return;
    }

    mixpanel.track(event, properties);
  };

  return { track };
}
