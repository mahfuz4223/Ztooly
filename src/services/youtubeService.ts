interface YouTubeVideoData {
  title: string;
  tags: string[];
  description: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration: string;
  thumbnailUrl: string;
  videoId: string;
}

export class YouTubeService {
  private static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  static async fetchVideoData(url: string): Promise<YouTubeVideoData> {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL. Please enter a valid YouTube video URL.');
    }

    try {
      // Method 1: Try using YouTube oEmbed API (no API key required)
      const oEmbedResponse = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );

      if (oEmbedResponse.ok) {
        const oEmbedData = await oEmbedResponse.json();
        
        // Method 2: Scrape additional data from YouTube page
        const pageData = await this.scrapeYouTubeData(videoId);
        
        return {
          title: oEmbedData.title || 'Unknown Title',
          tags: pageData.tags || [],
          description: pageData.description || 'No description available',
          channelTitle: oEmbedData.author_name || 'Unknown Channel',
          publishedAt: pageData.publishedAt || 'Unknown',
          viewCount: pageData.viewCount || 'Unknown',
          likeCount: pageData.likeCount || 'Unknown',
          duration: pageData.duration || 'Unknown',
          thumbnailUrl: oEmbedData.thumbnail_url || '',
          videoId: videoId
        };
      }

      throw new Error('Unable to fetch video data');
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
      throw new Error('Failed to extract video data. The video might be private, deleted, or restricted.');
    }
  }

  private static async scrapeYouTubeData(videoId: string): Promise<Partial<YouTubeVideoData>> {
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch page data');
      }

      const data = await response.json();
      const htmlContent = data.contents;

      // Enhanced fallback extraction with more robust description/metadata parsing:
      let description = '';
      // Try og:description
      const ogDesc = htmlContent.match(/<meta property="og:description" content="([^"]*)"/i);
      if (ogDesc) {
        description = ogDesc[1];
      } else {
        // Try meta name="description"
        const descMatch = htmlContent.match(/<meta name="description" content="([^"]*)"/i);
        if (descMatch) description = descMatch[1];
      }

      // published date: try itemprop="datePublished" or ld+json
      let publishedAt = '';
      const datePropMatch = htmlContent.match(/itemprop="datePublished" content="([^"]*)"/i);
      if (datePropMatch) {
        publishedAt = new Date(datePropMatch[1]).toLocaleDateString();
      }
      // try JSON-LD
      if (!publishedAt) {
        const jsonLdMatch = htmlContent.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/si);
        if (jsonLdMatch) {
          try {
            const jsonData = JSON.parse(jsonLdMatch[1]);
            if (jsonData.uploadDate) {
              publishedAt = new Date(jsonData.uploadDate).toLocaleDateString();
            }
          } catch {}
        }
      }

      let viewCount = '';
      // Extract viewCount from initialData or meta
      const viewMatchJson = htmlContent.match(/"viewCount":[\s{]*"(\d+)"/);
      if (viewMatchJson) {
        viewCount = parseInt(viewMatchJson[1]).toLocaleString();
      } else {
        const viewTextMatch = htmlContent.match(/<meta itemprop="interactionCount" content="(\d+)"/i);
        if (viewTextMatch) {
          viewCount = parseInt(viewTextMatch[1]).toLocaleString();
        }
      }

      let duration = '';
      // Extract durationISO8601 from JSON-LD or seconds from initialData
      const durIso = htmlContent.match(/"duration":"(PT[\dhms]+)"/i);
      if (durIso) {
        // Convert ISO 8601 to readable mm:ss
        duration = this.parseISO8601Duration(durIso[1]);
      } else {
        const secMatch = htmlContent.match(/"lengthSeconds":"(\d+)"/);
        if (secMatch) {
          const seconds = parseInt(secMatch[1]);
          duration = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
        }
      }

      // tags
      const tags = this.extractTagsFromHTML(htmlContent, { title: undefined, description });

      // fallback title
      let title = '';
      const titleMatch = htmlContent.match(/<title>([^<]*)<\/title>/i);
      if (titleMatch) {
        title = titleMatch[1].replace(' - YouTube', '').trim();
      }

      return {
        tags,
        description: description || 'No description available',
        publishedAt: publishedAt || 'Unknown',
        viewCount: viewCount || 'Unknown',
        likeCount: 'Unknown', // Scraping like count reliably is not possible without login
        duration: duration || 'Unknown',
        title,
      };
    } catch (error) {
      // Fallback: add hashtag/keyword extraction so tags are never empty!
      console.error('Error scraping YouTube data:', error);
      const oembed = await this.tryGetOEmbed(videoId);
      let tags: string[] = [];
      let description = '';
      let title = '';
      if (oembed) {
        tags = this.extractTagsFromHTML('', { title: oembed.title, description: oembed.author_name });
        description = oembed.description || 'Unavailable description';
        title = oembed.title || '';
      }
      return {
        tags,
        description: description || 'Unable to fetch description',
        publishedAt: 'Unknown',
        viewCount: 'Unknown',
        likeCount: 'Unknown',
        duration: 'Unknown',
        title,
      };
    }
  }

  private static parseISO8601Duration(iso: string): string {
    // Example: PT1H12M17S or PT10M17S or PT32S
    const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
    if (!match) return 'Unknown';
    const hours = parseInt(match[1] ?? '0');
    const minutes = parseInt(match[2] ?? '0');
    const seconds = parseInt(match[3] ?? '0');
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private static async tryGetOEmbed(videoId:string) {
    try {
      const oEmbedResponse = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (oEmbedResponse.ok) {
        return await oEmbedResponse.json();
      }
    } catch { /* ignore */ }
    return null;
  }

  private static extractTagsFromHTML(html: string, fallbackPayload?: {title?:string, description?:string}): string[] {
    try {
      // Try meta "keywords"
      const keywordsMatch = html.match(/<meta name="keywords" content="([^"]*)">/);
      if (keywordsMatch && keywordsMatch[1]) {
        return keywordsMatch[1].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }

      // Try JSON-LD
      const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s);
      if (jsonLdMatch) {
        try {
          const jsonData = JSON.parse(jsonLdMatch[1]);
          if (jsonData.keywords) {
            return Array.isArray(jsonData.keywords)
              ? jsonData.keywords
              : jsonData.keywords.split(',').map((t: string) => t.trim());
          }
        } catch (e) { /* Failed to parse JSON-LD */ }
      }
    } catch (error) {
      // Fallback handled below
    }

    // --- New: fallback using hashtags from description or title ---
    let tags: string[] = [];
    if (fallbackPayload) {
      // Extract hashtags (e.g., #ai, #reactjs)
      const hashtagRegex = /#(\w+)/g;
      const combinedText = (fallbackPayload.title || '') + '\n' + (fallbackPayload.description || '');
      const found = Array.from(combinedText.matchAll(hashtagRegex)).map(match => match[1]);
      if (found.length > 0) {
        tags = [...new Set(found.map(t => t.trim()))]; // Unique hashtags
      }

      // If no hashtags, extract frequent words from title/description
      if (tags.length === 0) {
        const text = (fallbackPayload.title + ' ' + fallbackPayload.description).toLowerCase();
        // Remove punctuation, split, remove stop words
        const stopWords = new Set([
          "the","and","for","with","this","that","from","they","have","been","were",
          "are","was","you","your","can","but","not","his","her","she","him","their",
          "has","will","had","all","any","one"
        ]);
        const wordCounts: Record<string, number> = {};
        for (const word of text.replace(/[^\w# ]/g, '').split(/\s+/)) {
          if (word.length >= 3 && !stopWords.has(word)) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          }
        }
        const sorted = Object.entries(wordCounts).sort((a,b)=>b[1]-a[1]);
        tags = sorted.slice(0, 10).map(([w]) => w);
      }
    }

    // Fallback: at least some tag, even if generic!
    return tags.length ? tags : ['youtube','video'];
  }

  private static extractMetadataFromHTML(html: string): Partial<YouTubeVideoData> {
    const metadata: Partial<YouTubeVideoData> = {};

    try {
      // Extract description
      const descMatch = html.match(/<meta name="description" content="([^"]*)">/);
      if (descMatch) {
        metadata.description = descMatch[1];
      }

      // Extract view count (approximate)
      const viewMatch = html.match(/["']viewCount["']:\s*["'](\d+)["']/);
      if (viewMatch) {
        const views = parseInt(viewMatch[1]);
        metadata.viewCount = views.toLocaleString();
      }

      // Extract published date
      const dateMatch = html.match(/["']publishDate["']:\s*["']([^"']*)["']/);
      if (dateMatch) {
        const date = new Date(dateMatch[1]);
        metadata.publishedAt = date.toLocaleDateString();
      }

      // Extract duration
      const durationMatch = html.match(/["']lengthSeconds["']:\s*["'](\d+)["']/);
      if (durationMatch) {
        const seconds = parseInt(durationMatch[1]);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        metadata.duration = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
      }
    } catch (error) {
      console.error('Error extracting metadata:', error);
    }

    return metadata;
  }
}
