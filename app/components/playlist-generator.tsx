'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

const PlaylistGenerator = () => {
  const { data: session, status } = useSession();
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingCreate, setPendingCreate] = useState(false);

  // Save form data before redirecting to login
  const saveFormData = () => {
    sessionStorage.setItem('pendingPlaylist', JSON.stringify({
      startLocation,
      endLocation,
      pending: true
    }));
  };

  // Check for pending playlist creation after login
  useEffect(() => {
    if (session && status === 'authenticated') {
      const savedData = sessionStorage.getItem('pendingPlaylist');
      if (savedData) {
        const { startLocation: savedStart, endLocation: savedEnd, pending } = JSON.parse(savedData);
        if (pending) {
          setStartLocation(savedStart);
          setEndLocation(savedEnd);
          setPendingCreate(true);
          sessionStorage.removeItem('pendingPlaylist');
        }
      }
    }
  }, [session, status]);

  // Automatically create playlist if pending after login
  useEffect(() => {
    if (pendingCreate && session && startLocation && endLocation) {
      handleCreatePlaylist();
      setPendingCreate(false);
    }
  }, [pendingCreate, session, startLocation, endLocation]);

  const handleCreatePlaylist = async () => {
    if (!session) {
      saveFormData();
      signIn('spotify');
      return;
    }

    setLoading(true);
    setError('');
    
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

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create playlist');
      }

      window.open(data.playlistUrl, '_blank');
    } catch (error) {
      console.error('Error creating playlist:', error);
      setError(error instanceof Error ? error.message : 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
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