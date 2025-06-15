
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
      // Using a CORS proxy to fetch YouTube page content
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch page data');
      }

      const data = await response.json();
      const htmlContent = data.contents;
      
      // Extract data from the HTML content
      const tags = this.extractTagsFromHTML(htmlContent);
      const metadata = this.extractMetadataFromHTML(htmlContent);
      
      return {
        tags,
        ...metadata
      };
    } catch (error) {
      console.error('Error scraping YouTube data:', error);
      return {
        tags: [],
        description: 'Unable to fetch description',
        publishedAt: 'Unknown',
        viewCount: 'Unknown',
        likeCount: 'Unknown',
        duration: 'Unknown'
      };
    }
  }

  private static extractTagsFromHTML(html: string): string[] {
    try {
      // Look for keywords in meta tags
      const keywordsMatch = html.match(/<meta name="keywords" content="([^"]*)">/);
      if (keywordsMatch && keywordsMatch[1]) {
        return keywordsMatch[1].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }

      // Look for tags in JSON-LD structured data
      const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s);
      if (jsonLdMatch) {
        try {
          const jsonData = JSON.parse(jsonLdMatch[1]);
          if (jsonData.keywords) {
            return Array.isArray(jsonData.keywords) ? jsonData.keywords : jsonData.keywords.split(',');
          }
        } catch (e) {
          console.log('Failed to parse JSON-LD');
        }
      }

      // Fallback: Extract from title and description
      const titleMatch = html.match(/<title>([^<]*)<\/title>/);
      const title = titleMatch ? titleMatch[1].replace(' - YouTube', '') : '';
      
      // Generate tags from title
      const titleWords = title.split(/\s+/).filter(word => 
        word.length > 3 && !['with', 'that', 'this', 'from', 'they', 'have', 'been', 'were'].includes(word.toLowerCase())
      );
      
      return titleWords.slice(0, 10); // Limit to 10 tags
    } catch (error) {
      console.error('Error extracting tags:', error);
      return ['youtube', 'video'];
    }
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
