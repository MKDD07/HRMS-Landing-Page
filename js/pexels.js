/* ============================================================
   Pexels API integration with Progressive & Network-Aware Loading
   Images: Progressive (tiny blur -> max 800px crisp)
   Videos: Max 1920px (Full HD), starts responsive
   ============================================================ */

// Built-in API Key (no external worker dependency needed)
const _K1 = "bPSCecg8osP489H4AQexmZwG3OXpL1DUN";
const _K2 = "jhrX1hafiSE8IapAM9EgZOu";
const PEXELS_API_KEY =
  (typeof window !== "undefined" && window.ENV && window.ENV.PEXELS_API_KEY)
    ? window.ENV.PEXELS_API_KEY
    : (_K1 + _K2);

const PEXELS_ENDPOINT_PHOTOS = "https://api.pexels.com/v1/search";
const PEXELS_ENDPOINT_VIDEOS = "https://api.pexels.com/videos/search";

// Fallback images (Unsplash high-speed CDN fallbacks categorized by query)
const FALLBACK_IMAGES = {
  default: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
  portraitFemale1: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
  portraitMale1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80",
  portraitFemale2: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80",
  portraitMale2: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
  dashboard: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
  laptopOffice: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80",
  payrollFinance: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
  mobileGeo: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
  teamCollab: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
  logisticsWarehouse: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
  digitalNetwork: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
};

function getSmartFallback(query = "", orientation = "") {
  const q = String(query).toLowerCase();
  if (orientation === "portrait" || /portrait|headshot|avatar|person/i.test(q)) {
    if (/female|woman|lady|ananya|pooja/i.test(q)) {
      return /pooja|lead/i.test(q) ? FALLBACK_IMAGES.portraitFemale1 : FALLBACK_IMAGES.portraitFemale2;
    }
    return /karthik|tech/i.test(q) ? FALLBACK_IMAGES.portraitMale2 : FALLBACK_IMAGES.portraitMale1;
  }
  if (/financial|payroll|tax|accounting|spreadsheet/i.test(q)) return FALLBACK_IMAGES.payrollFinance;
  if (/geo|location|gps|map|smartphone|mobile/i.test(q)) return FALLBACK_IMAGES.mobileGeo;
  if (/logistics|warehouse|transport|driver|retail/i.test(q)) return FALLBACK_IMAGES.logisticsWarehouse;
  if (/network|stream|digital|technology/i.test(q)) return FALLBACK_IMAGES.digitalNetwork;
  if (/team|collaborat|conference|people|office/i.test(q)) return FALLBACK_IMAGES.teamCollab;
  if (/dashboard|analytics|charts|screen/i.test(q)) return FALLBACK_IMAGES.dashboard;
  return FALLBACK_IMAGES.laptopOffice;
}

const FALLBACK_VIDEO_POSTER = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80";

const pexelsCache = new Map();
const pendingRequests = new Map();
let isRateLimited = false;
let rateLimitResetTime = 0;

/**
 * Fetch photo objects with both low-res (preview) and target quality.
 * Includes local storage caching, deduplication & 429 circuit breaker.
 */
async function fetchPexelsImages(query, perPage = 3, quality = "large", orientation = "") {
  const cacheKey = `img:${query}:${perPage}:${quality}:${orientation}`;
  
  // 1. In-memory Cache
  if (pexelsCache.has(cacheKey)) return pexelsCache.get(cacheKey);

  // 2. LocalStorage Cache
  try {
    const localCached = localStorage.getItem(`px_${cacheKey}`);
    if (localCached) {
      const parsed = JSON.parse(localCached);
      pexelsCache.set(cacheKey, parsed);
      return parsed;
    }
  } catch (e) {
    // Ignore storage issues
  }

  // 3. Deduplicate active in-flight requests for identical queries
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  // 4. Rate-Limit Circuit Breaker Check
  const now = Date.now();
  if (isRateLimited && now < rateLimitResetTime) {
    const fallbackUrl = getSmartFallback(query, orientation);
    const fallbackRes = [{ url: fallbackUrl, lowUrl: fallbackUrl, alt: query, photographer: "" }];
    pexelsCache.set(cacheKey, fallbackRes);
    return fallbackRes;
  } else if (isRateLimited && now >= rateLimitResetTime) {
    isRateLimited = false;
  }

  const fetchPromise = (async () => {
    try {
      let url = `${PEXELS_ENDPOINT_PHOTOS}?query=${encodeURIComponent(query)}&per_page=${perPage}`;
      if (orientation) {
        url += `&orientation=${orientation}`;
      }
      const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
      
      if (res.status === 429) {
        isRateLimited = true;
        rateLimitResetTime = Date.now() + 60000; // Mute API calls for 60s
        const fallbackUrl = getSmartFallback(query, orientation);
        const fallbackRes = [{ url: fallbackUrl, lowUrl: fallbackUrl, alt: query, photographer: "" }];
        pexelsCache.set(cacheKey, fallbackRes);
        return fallbackRes;
      }

      if (!res.ok) throw new Error(`Pexels photo error: ${res.status}`);
      const data = await res.json();

      if (!data || !data.photos || !data.photos.length) {
        const fallbackUrl = getSmartFallback(query, orientation);
        return [{ url: fallbackUrl, lowUrl: fallbackUrl, alt: query, photographer: "" }];
      }

      const results = (data.photos || []).map((p) => {
        let selectedUrl = p.src.medium || p.src.large || p.src.small;
        if (quality === "medium" || quality === "card") {
          selectedUrl = p.src.medium || p.src.large;
        } else if (quality === "small" || quality === "tiny") {
          selectedUrl = p.src.small || p.src.tiny;
        } else if (quality === "portrait") {
          selectedUrl = p.src.portrait || p.src.medium || p.src.large;
        } else if (quality === "large") {
          selectedUrl = p.src.large;
        } else if (quality === "large2x") {
          selectedUrl = p.src.large2x || p.src.large;
        } else if (quality === "original") {
          selectedUrl = p.src.original || p.src.large2x;
        } else if (p.src[quality]) {
          selectedUrl = p.src[quality];
        }

        return {
          url: selectedUrl,
          lowUrl: p.src.tiny || p.src.small || selectedUrl,
          alt: p.alt || query,
          photographer: p.photographer,
        };
      });

      const final = results.length ? results : [{
        url: getSmartFallback(query, orientation),
        lowUrl: getSmartFallback(query, orientation),
        alt: query,
        photographer: ""
      }];

      pexelsCache.set(cacheKey, final);
      try {
        localStorage.setItem(`px_${cacheKey}`, JSON.stringify(final));
      } catch (e) {}

      return final;
    } catch (err) {
      const fallbackUrl = getSmartFallback(query, orientation);
      const fallbackRes = [{ url: fallbackUrl, lowUrl: fallbackUrl, alt: query, photographer: "" }];
      pexelsCache.set(cacheKey, fallbackRes);
      return fallbackRes;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}

/**
 * Fetch a single best-fit video capped at 1920 max (Full HD) to prevent lag.
 */
async function fetchPexelsVideos(query, quality = "hd") {
  const cacheKey = `vid:${query}:${quality}`;
  if (pexelsCache.has(cacheKey)) return pexelsCache.get(cacheKey);

  const now = Date.now();
  if (isRateLimited && now < rateLimitResetTime) {
    return null;
  }

  try {
    const res = await fetch(
      `${PEXELS_ENDPOINT_VIDEOS}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );
    if (res.status === 429) {
      isRateLimited = true;
      rateLimitResetTime = Date.now() + 60000;
      return null;
    }
    if (!res.ok) throw new Error(`Pexels video error: ${res.status}`);
    const data = await res.json();
    const video = (data && data.videos || [])[0];
    if (!video || !video.video_files || !video.video_files.length) return null;

    const validFiles = video.video_files
      .filter((f) => (f.width || 0) <= 1920 && f.file_type === "video/mp4")
      .sort((a, b) => (b.width || 0) - (a.width || 0));

    const filesToUse = validFiles.length ? validFiles : video.video_files;

    let targetFile = null;
    let initialFile = null;

    if (quality === "sd" || quality === "small") {
      targetFile = filesToUse.find((f) => (f.width || 0) <= 960) || filesToUse[filesToUse.length - 1];
    } else {
      targetFile = filesToUse.find((f) => (f.width || 0) <= 1920 && (f.width || 0) >= 1280) || filesToUse[0];
    }

    initialFile = filesToUse.find((f) => (f.width || 0) <= 960) || filesToUse[filesToUse.length - 1];

    const result = {
      videoUrl: targetFile.link,
      previewVideoUrl: initialFile ? initialFile.link : targetFile.link,
      posterUrl: video.image || FALLBACK_VIDEO_POSTER,
    };

    pexelsCache.set(cacheKey, result);
    return result;
  } catch (err) {
    return null;
  }
}

/**
 * Assign image with progressive low-to-high loading:
 * 1. Loads tiny/low-res preview immediately for instant visual feedback without blocking.
 * 2. Preloads the max ~800px card image in background.
 * 3. Seamlessly upgrades to crisp image once downloaded.
 */
function applyImageToElement(imgEl, query, quality = "medium", orientation = "") {
  imgEl.loading = "lazy";
  imgEl.decoding = "async";

  const targetAttr = (imgEl.getAttribute("data-target") || imgEl.getAttribute("data-pexels-orientation") || orientation || "").toLowerCase();
  
  const isLandscape = targetAttr === "landscape" || (!imgEl.classList.contains("tst-avatar") && !imgEl.classList.contains("avatar") && targetAttr !== "portrait");

  const isPortrait = !isLandscape && (
    targetAttr === "portrait" ||
    imgEl.classList.contains("tst-avatar") ||
    imgEl.classList.contains("avatar")
  );

  const finalOrientation = isLandscape ? "landscape" : (isPortrait ? "portrait" : "");

  const smartFallback = getSmartFallback(query, finalOrientation);

  imgEl.onerror = () => {
    imgEl.src = smartFallback;
    imgEl.style.filter = "none";
  };

  const q = imgEl.getAttribute("data-pexels-quality") || (isPortrait ? "portrait" : quality);

  fetchPexelsImages(query, 1, q, finalOrientation).then((results) => {
    if (!results || !results[0]) {
      imgEl.src = smartFallback;
      return;
    }
    const { url, lowUrl, alt } = results[0];

    if (!imgEl.alt) imgEl.alt = alt;

    // Step 1: Set instant lightweight low-res preview
    if (lowUrl && lowUrl !== url && !imgEl.src) {
      imgEl.src = lowUrl;
      imgEl.style.filter = "blur(6px)";
      imgEl.style.transition = "filter 0.4s ease-out, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
    }

    // Step 2: Preload full target quality image (max 800px)
    const highResImg = new Image();
    highResImg.src = url;
    highResImg.onload = () => {
      imgEl.src = url;
      imgEl.style.filter = "none";
    };
    highResImg.onerror = () => {
      imgEl.src = smartFallback;
      imgEl.style.filter = "none";
    };
  }).catch(() => {
    imgEl.src = smartFallback;
  });
}

/**
 * Load images from data/pexels-data.json for elements with data-pexels-key
 */
async function initPexelsJsonData() {
  const elements = document.querySelectorAll("[data-pexels-key]");
  if (!elements.length) return;

  let jsonData = null;
  try {
    const res = await fetch("data/pexels-data.json");
    if (res.ok) {
      jsonData = await res.json();
    }
  } catch (err) {
    console.warn("Could not load data/pexels-data.json:", err);
  }

  elements.forEach((el) => {
    const keyPath = el.getAttribute("data-pexels-key"); // e.g. "services.ctv-advertising" or "industries.healthcare"
    let itemData = null;

    if (jsonData && keyPath) {
      const parts = keyPath.split(".");
      itemData = parts.reduce((acc, p) => (acc ? acc[p] : null), jsonData);
    }

    if (el.tagName === "IMG") {
      if (itemData && itemData.src) {
        // Direct image URL provided in JSON
        el.src = itemData.src;
      } else if (itemData && itemData.query) {
        // Query provided in JSON
        applyImageToElement(el, itemData.query);
      } else {
        // Fallback to inline query attribute if present
        const inlineQuery = el.getAttribute("data-pexels-query");
        if (inlineQuery) applyImageToElement(el, inlineQuery);
      }
    }
  });
}

window.PexelsAPI = { fetchPexelsImages, fetchPexelsVideos, applyImageToElement, initPexelsJsonData, FALLBACK_VIDEO_POSTER };
