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

      window.open(data.playlistUrl, '_blank');
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
      
      <button
        onClick={handleCreatePlaylist}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Playlist...
          </div>
        ) : 'Generate Road Trip Playlist'}
      </button>

      {loading && loadingStatus && (
        <div className="text-sm text-gray-600 animate-pulse mt-2">
          {loadingStatus}
        </div>
      )}

      {genres && (
        <div className="mt-4 space-y-2 text-sm">
          <p className="font-medium">Playlist Genres:</p>
          <p><span className="font-medium">{initialStart}:</span> {genres.start.join(', ')}</p>
          <p><span className="font-medium">{initialEnd}:</span> {genres.end.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default PlaylistGenerator;