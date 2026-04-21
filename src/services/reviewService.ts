// Review Service - Simple Keyword-based filtering
export interface Review {
  id?: string;
  name: string;
  rating: number;
  review: string;
  timestamp?: string;
  positivityScore?: number;
  gmapsStatus?: "N/R" | "R";
}

export interface ValidationResponse {
  isApproved: boolean;
  reason: string;
  positivityScore: number;
}

/**
 * Validates a review using simple keyword-based logic and calculates a positivity score (Fast & Efficient)
 */
export function validateReview(review: Review): ValidationResponse {
  const positiveWords = [
    "good", "great", "excellent", "professional", "quick", "clean", 
    "affordable", "recommend", "recommended", "satisfied", "best", 
    "nice", "quality", "fast", "reliable", "safe", "neat", "timely"
  ];

  const text = review.review.toLowerCase();
  
  // Count positive keywords for scoring
  let score = 0;
  positiveWords.forEach(word => {
    // Exact word matching using boundaries
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = text.match(regex);
    if (matches) {
      score += matches.length;
    }
  });

  const hasPositiveKeyword = score > 0;
  const isRatingGood = review.rating >= 3;
  const isNotEmpty = review.review.trim().length > 0;

  if (isRatingGood && hasPositiveKeyword && isNotEmpty) {
    return { 
      isApproved: true, 
      reason: "Matches positive criteria.",
      positivityScore: score
    };
  }

  return { 
    isApproved: false, 
    reason: !isRatingGood ? "Rating too low." : "No positive keywords found or empty text.",
    positivityScore: score
  };
}

/**
 * Sorts reviews according to priority logic: 
 * 1. Higher Rating (5 > 4 > 3)
 * 2. Higher Positivity Score (frequency of keywords)
 * 3. Recency (Latest first)
 */
export function sortReviews(reviews: Review[]): Review[] {
  return [...reviews].sort((a, b) => {
    // 1st Priority: Higher star rating
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    // 2nd Priority: Positivity strength
    const scoreDiff = (b.positivityScore || 0) - (a.positivityScore || 0);
    if (scoreDiff !== 0) {
      return scoreDiff;
    }
    // 3rd Priority: Recency (assuming a more recent review has a higher timestamp value or was added later)
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return timeB - timeA;
  });
}

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw0HUY2uISbRFVRbD3uKlA_77fIZSu5IAZLz2X7JZ_PikX9gVlM2NE3aHGpUSmMFQFFsQ/exec";

/**
 * Submits a new review to Google Sheets
 */
export async function submitReviewToSheet(
  review: { name: string; rating: number; review: string },
  gmapsStatus: "R" | "N/R"
): Promise<boolean> {
  const payload = {
    name: review.name,
    rating: review.rating,
    review: review.review,
    date: new Date().toISOString(),
    Gmaps_Status: gmapsStatus
  };

  await fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain"
    },
    body: JSON.stringify(payload)
  });

  return true;
}

/**
 * Fetches reviews from a Google Sheet (exported as CSV)
 */
export async function fetchReviewsFromSheet(sheetUrl: string): Promise<Review[]> {
  try {
    // Convert regular sheet URL to CSV export URL
    const idMatch = sheetUrl.match(/\/d\/([^/]+)/);
    if (!idMatch) throw new Error("Invalid Google Sheet URL - Could not find Document ID");
    const docId = idMatch[1];
    
    // Using the gviz/tq endpoint is often more robust for CORS when fetching public sheet data as CSV
    const csvUrl = `https://docs.google.com/spreadsheets/d/${docId}/gviz/tq?tqx=out:csv&gid=0&_cb=${Date.now()}`;

    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      const errorMsg = response.status === 401 || response.status === 403
        ? "Access Denied: The Google Sheet is private. Please go to 'Share' and set 'General access' to 'Anyone with the link can view'."
        : `Network Error: Received status ${response.status} from Google Sheets.`;
      throw new Error(errorMsg);
    }

    const csvText = await response.text();
    
    if (!csvText || csvText.trim().length === 0 || csvText.startsWith('<!DOCTYPE html>')) {
      throw new Error("Invalid Response: Likely redirected to a login page. Please ensure the sheet is PUBLICLY shared with 'Anyone with the link'.");
    }
    
    // Simple CSV parser (assuming columns: Name, Rating, Review, Date, Gmaps_Status)
    const lines = csvText.split('\n').slice(1); // Skip header
    const rawReviews = lines
      .map((line) => {
        if (!line.trim()) return null;
        // Handle basic quoted strings in CSV
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        // We expect at least columns 0, 1, 2 (Name, Rating, Review)
        if (parts.length < 3) return null;
        
        const review: Review = {
          name: parts[0]?.replace(/^"|"$/g, '').trim() || "Anonymous",
          rating: parseInt(parts[1]?.replace(/^"|"$/g, '').trim()) || 0,
          review: parts[2]?.replace(/^"|"$/g, '').trim() || "",
          timestamp: parts[3]?.replace(/^"|"$/g, '').trim(),
          gmapsStatus: (parts[4]?.replace(/^"|"$/g, '').trim() as Review["gmapsStatus"]) || "N/R"
        };
        return review;
      });

    const reviews: Review[] = rawReviews.filter((r): r is Review => r !== null && !!r.review);

    return reviews;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      console.error("CRITICAL ERROR: Failed to fetch the Google Sheet. \n\n" +
        "POSSIBLE CAUSES:\n" +
        "1. The Sheet is PRIVATE: Click 'Share' -> 'General access' -> 'Anyone with the link' -> 'Viewer'.\n" +
        "2. Ad-blockers or restrictive corporate firewalls are blocking docs.google.com.\n\n" +
        "Please verify your sharing settings at the link in your console.");
    } else {
      console.error("Fetch Error:", error);
    }
    return [];
  }
}
