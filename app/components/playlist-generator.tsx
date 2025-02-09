'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

const PlaylistGenerator = ({ startLocation: initialStart, endLocation: initialEnd }: { startLocation: string; endLocation: string }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState('');
  const [pendingCreate, setPendingCreate] = useState(false);
  const [genres, setGenres] = useState<{ start: string[], end: string[] } | null>(null);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [previousLocations, setPreviousLocations] = useState({ start: initialStart, end: initialEnd });

  // Save form data before redirecting to login
  const saveFormData = () => {
    sessionStorage.setItem('pendingPlaylist', JSON.stringify({
      startLocation: initialStart,
      endLocation: initialEnd,
      pending: true
    }));
  };

  // Check for pending playlist creation after login
  useEffect(() => {
    if (session && status === 'authenticated') {
      const savedData = sessionStorage.getItem('pendingPlaylist');
      if (savedData) {
        const { pending } = JSON.parse(savedData);
        if (pending) {
          setPendingCreate(true);
          sessionStorage.removeItem('pendingPlaylist');
        }
      }
    }
  }, [session, status]);

  // Watch for changes in start or end location
  useEffect(() => {
    // Only update if the locations have actually changed and are not empty
    if (
      initialStart && 
      initialEnd && 
      session && 
      (initialStart !== previousLocations.start || initialEnd !== previousLocations.end) &&
      initialStart !== "Unknown Start" && 
      initialEnd !== "Unknown Destination"
    ) {
      handleCreatePlaylist();
      setPreviousLocations({ start: initialStart, end: initialEnd });
    }
  }, [initialStart, initialEnd, session]);

  // Automatically create playlist if pending after login
  useEffect(() => {
    if (pendingCreate && session) {
      handleCreatePlaylist();
      setPendingCreate(false);
    }
  }, [pendingCreate, session]);

  const handleCreatePlaylist = async () => {
    if (!session) {
      saveFormData();
      signIn('spotify');
      return;
    }

    setLoading(true);
    setError('');
    setGenres(null);
    setPlaylistUrl(null);
    setLoadingStatus('Analyzing locations for music genres...');
    
    try {
      const response = await fetch('/api/create-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startLocation: initialStart,
          endLocation: initialEnd,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create playlist');
      }

      // Set the genres from the response
      setGenres({
        start: data.startLocationGenres,
        end: data.endLocationGenres
      });

      // Extract playlist ID from URL and set it
      const playlistId = data.playlistUrl.split('/playlist/')[1];
      setPlaylistUrl(playlistId);
    } catch (error) {
      console.error('Error creating playlist:', error);
      setError(error instanceof Error ? error.message : 'Failed to create playlist');
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {!playlistUrl && (
        <button
          onClick={handleCreatePlaylist}
          disabled={loading}
          className="w-full bg-[#1DB954] text-white font-bold py-2 px-4 rounded hover:bg-[#1ed760] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? loadingStatus : 'Generate Road Trip Playlist'}
        </button>
      )}

      {loading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1DB954] mx-auto"></div>
        </div>
      )}

      {genres && (
        <div className="space-y-2 text-sm">
          <p><strong>Starting Location Vibes:</strong> {genres.start.join(', ')}</p>
          <p><strong>Destination Vibes:</strong> {genres.end.join(', ')}</p>
        </div>
      )}

      {playlistUrl && (
        <div className="w-full h-[450px] bg-[#282828] rounded-lg overflow-hidden shadow-lg">
          <iframe
            src={`https://open.spotify.com/embed/playlist/${playlistUrl}?utm_source=generator&theme=0`}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default PlaylistGenerator;