import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

async function searchLocationBasedTracks(location: string, accessToken: string) {
  // Search for tracks related to the location
  const searchResponse = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(location)}&type=track&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  const searchData = await searchResponse.json();
  return searchData.tracks.items.map((track: any) => track.uri);
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
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = await userResponse.json();

    // Create a new playlist
    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userData.id}/playlists`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Journey from ${startLocation} to ${endLocation}`,
          description: `A musical journey from ${startLocation} to ${endLocation}`,
          public: true,
        }),
      }
    );
    const playlistData = await playlistResponse.json();

    // Get tracks for both locations
    const startLocationTracks = await searchLocationBasedTracks(startLocation, accessToken);
    const endLocationTracks = await searchLocationBasedTracks(endLocation, accessToken);
    
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
    });
  } catch (error) {
    console.error('Error creating playlist:', error);
    return NextResponse.json(
      { error: 'Failed to create playlist' },
      { status: 500 }
    );
  }
}
