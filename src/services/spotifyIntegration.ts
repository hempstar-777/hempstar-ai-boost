
interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyArtistData {
  id: string;
  followers: {
    total: number;
  };
  popularity: number;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

interface SpotifyTrackData {
  name: string;
  popularity: number;
  external_urls: {
    spotify: string;
  };
  album: {
    name: string;
    images: Array<{
      url: string;
    }>;
  };
}

export class SpotifyIntegration {
  private static instance: SpotifyIntegration;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private lastError: string | null = null;

  static getInstance(): SpotifyIntegration {
    if (!SpotifyIntegration.instance) {
      SpotifyIntegration.instance = new SpotifyIntegration();
    }
    return SpotifyIntegration.instance;
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    
    if (this.accessToken && now < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('🎵 Attempting to get Spotify access token...');
      
      // Call our edge function to get access token
      const response = await fetch('/functions/v1/spotify-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Spotify auth failed: ${response.status} ${response.statusText}`);
      }

      const data: SpotifyTokenResponse = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = now + (data.expires_in * 1000) - 60000; // Refresh 1 minute early
      this.lastError = null;

      console.log('🎵 Successfully obtained Spotify access token');
      return this.accessToken;
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : 'Unknown error';
      console.error('🎵 Error getting Spotify access token:', error);
      throw error;
    }
  }

  async searchArtist(artistName: string): Promise<SpotifyArtistData | null> {
    try {
      console.log(`🎵 Searching for artist: ${artistName}`);
      const token = await this.getAccessToken();
      
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const artist = data.artists.items[0] || null;
      
      if (artist) {
        console.log(`🎵 Found artist: ${artist.name} with ${artist.followers.total} followers`);
      } else {
        console.log(`🎵 No artist found for: ${artistName}`);
      }
      
      return artist;
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : 'Search failed';
      console.error('🎵 Error searching for artist:', error);
      return null;
    }
  }

  async getArtistTopTracks(artistId: string): Promise<SpotifyTrackData[]> {
    try {
      console.log(`🎵 Getting top tracks for artist: ${artistId}`);
      const token = await this.getAccessToken();
      
      const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Top tracks failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const tracks = data.tracks || [];
      console.log(`🎵 Found ${tracks.length} top tracks`);
      return tracks;
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : 'Failed to get tracks';
      console.error('🎵 Error getting top tracks:', error);
      return [];
    }
  }

  getConnectionStatus(): 'connected' | 'connecting' | 'error' {
    if (this.lastError) {
      return 'error';
    }
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return 'connected';
    }
    return 'connecting';
  }

  getLastError(): string | null {
    return this.lastError;
  }

  clearError(): void {
    this.lastError = null;
  }
}

export const spotifyIntegration = SpotifyIntegration.getInstance();
