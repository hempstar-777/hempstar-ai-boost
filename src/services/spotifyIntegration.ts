
interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyArtistData {
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
      // Call our edge function to get access token
      const response = await fetch('/functions/v1/spotify-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get Spotify access token');
      }

      const data: SpotifyTokenResponse = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = now + (data.expires_in * 1000) - 60000; // Refresh 1 minute early

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw error;
    }
  }

  async searchArtist(artistName: string): Promise<SpotifyArtistData | null> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search for artist');
      }

      const data = await response.json();
      return data.artists.items[0] || null;
    } catch (error) {
      console.error('Error searching for artist:', error);
      return null;
    }
  }

  async getArtistTopTracks(artistId: string): Promise<SpotifyTrackData[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get top tracks');
      }

      const data = await response.json();
      return data.tracks || [];
    } catch (error) {
      console.error('Error getting top tracks:', error);
      return [];
    }
  }

  getConnectionStatus(): 'connected' | 'connecting' | 'error' {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return 'connected';
    }
    return 'connecting';
  }
}

export const spotifyIntegration = SpotifyIntegration.getInstance();
