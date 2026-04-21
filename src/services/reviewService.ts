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
export async function submitReviewToSheet(review: { name: string, rating: number, review: string }): Promise<boolean> {
  const payload = {
    name: review.name,
    rating: review.rating,
    review: review.review,
    date: new Date().toISOString(),
    Gmaps_Status: "N/R"
  };

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error("Submitting review failed:", error);
    return false;
  }
}

/**
 * Fetches reviews from a Google Sheet (exported as CSV)
 */
export async function fetchReviewsFromSheet(sheetUrl: string): Promise<Review[]> {
  try {
    // Convert regular sheet URL to CSV export URL
    const idMatch = sheetUrl.match(/\/d\/([^/]+)/);
    if (!idMatch) throw new Error("Invalid Google Sheet URL");
    const csvUrl = `https://docs.google.com/spreadsheets/d/${idMatch[1]}/export?format=csv`;

    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    // Simple CSV parser (assuming columns: Name, Rating, Review, Date, Gmaps_Status)
    const lines = csvText.split('\n').slice(1); // Skip header
    const rawReviews = lines
      .map(line => {
        // Handle basic quoted strings in CSV
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length < 4) return null;
        
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
    console.error("Fetch Error:", error);
    return [];
  }
}
