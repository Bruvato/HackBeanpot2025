'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

const PlaylistGenerator = () => {
  const { data: session } = useSession();
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePlaylist = async () => {
    if (!session) {
      signIn('spotify');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/create-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startLocation,
          endLocation,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }

      const data = await response.json();
      window.open(data.playlistUrl, '_blank');
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="start" className="block text-sm font-medium text-gray-700">
          Start Location
        </label>
        <input
          type="text"
          id="start"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter start location"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="end" className="block text-sm font-medium text-gray-700">
          End Location
        </label>
        <input
          type="text"
          id="end"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter end location"
        />
      </div>

      <button
        onClick={handleCreatePlaylist}
        disabled={loading || !startLocation || !endLocation}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Playlist'}
      </button>
    </div>
  );
};

export default PlaylistGenerator;
