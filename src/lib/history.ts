export interface ReviewHistoryItem {
  id: string;
  code: string;
  language: string;
  review: {
    issues: string[];
    suggestions: string[];
    corrected_code: string;
  };
  timestamp: number;
}

const STORAGE_KEY = "code-review-history";

export const saveReviewToHistory = (
  code: string,
  language: string,
  review: ReviewHistoryItem["review"]
): void => {
  if (typeof window === "undefined") return;

  const history = getReviewHistory();
  const newItem: ReviewHistoryItem = {
    id: Date.now().toString(),
    code,
    language,
    review,
    timestamp: Date.now(),
  };

  // Add to beginning of array (most recent first)
  const updatedHistory = [newItem, ...history].slice(0, 50); // Keep only last 50 reviews

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save review to history:", error);
  }
};

export const getReviewHistory = (): ReviewHistoryItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as ReviewHistoryItem[];
  } catch (error) {
    console.error("Failed to load review history:", error);
    return [];
  }
};

export const deleteReviewFromHistory = (id: string): void => {
  if (typeof window === "undefined") return;

  const history = getReviewHistory();
  const updatedHistory = history.filter((item) => item.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to delete review from history:", error);
  }
};

export const clearReviewHistory = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear review history:", error);
  }
};

