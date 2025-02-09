import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function generatePlaylistDescription(startLocation: string, endLocation: string) {
  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create a short, fun Spotify playlist description for a road trip from ${startLocation} to ${endLocation}. 
                   Include the mood of the journey and why the music fits the trip. 
                   Keep it under 300 characters and make it engaging. Make sure it does not get cut off.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const description = response.text()
      .trim()
      .slice(0, 300);
      
    return description || `A musical journey from ${startLocation} to ${endLocation}`;
  } catch (error) {
    console.error('Error generating description:', error);
    return `A musical journey from ${startLocation} to ${endLocation}`;
  }
}

interface Track {
  uri: string;
}

async function getLocationGenres(location: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `What are the top 5 most listened-to Spotify genres that best represent ${location}? Return genre names spearated by comma.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const genres = response.text().trim();
    
    return genres.split(',').map(genre => genre.trim());
  } catch (error) {
    console.error('Error getting location genres:', error);
    return ['pop', 'rock']; // fallback genres
  }
}

async function searchGenreBasedTracks(genres: string[], accessToken: string) {
  const tracks: Track[] = [];
  
  // Search for tracks for each genre
  for (const genre of genres) {
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(genre)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    const searchData = await searchResponse.json();
    if (searchData.tracks?.items) {
      // Get exactly 10 tracks for this genre
      const genreTracks = searchData.tracks.items
        .sort(() => Math.random() - 0.5) // Shuffle the tracks
        .slice(0, 10); // Take exactly 10 tracks
      tracks.push(...genreTracks);
    }
  }
  
  // Return all tracks (should be about 30 tracks - 10 per genre)
  return tracks.map(track => track.uri);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { startLocation, endLocation } = await req.json();
    const accessToken = session.accessToken as string;

    // Get user's Spotify ID
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.text();
      console.error('Failed to get user profile:', errorData);
      return NextResponse.json({ error: 'Failed to authenticate with Spotify' }, { status: 401 });
    }

    // Get genres for both locations
    const startLocationGenres = await getLocationGenres(startLocation);
    const endLocationGenres = await getLocationGenres(endLocation);

    // Generate AI description
    const description = await generatePlaylistDescription(startLocation, endLocation);

    // Create a new playlist
    const playlistResponse = await fetch(
      'https://api.spotify.com/v1/me/playlists',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Road Trip from ${startLocation} to ${endLocation}`,
          description: description,
          public: true,
        }),
      }
    );

    if (!playlistResponse.ok) {
      const errorData = await playlistResponse.text();
      console.error('Failed to create playlist:', errorData);
      return NextResponse.json({ error: 'Failed to create playlist' }, { status: playlistResponse.status });
    }

    const playlistData = await playlistResponse.json();

    // Get tracks based on genres for both locations
    const startLocationTracks = await searchGenreBasedTracks(startLocationGenres, accessToken);
    const endLocationTracks = await searchGenreBasedTracks(endLocationGenres, accessToken);
    
    // Combine tracks
    const allTracks = [...startLocationTracks, ...endLocationTracks];

    // Add tracks to playlist
    if (allTracks.length > 0) {
      await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: allTracks,
          }),
        }
      );
    }

    return NextResponse.json({
      success: true,
      playlistUrl: playlistData.external_urls.spotify,
      startLocationGenres,
      endLocationGenres
    });
  } catch (error) {
    console.error('Error creating playlist:', error);
    return NextResponse.json(
      { error: 'Failed to create playlist' },
      { status: 500 }
    );
  }
}
