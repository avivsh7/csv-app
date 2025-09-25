import React, { useState, useEffect } from 'react';
import '../index.css'
import type { Song } from '../types/Song';
import { songService } from '../services/songService';

const SongTable: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data: Song[] = await songService.fetchSongs();
        setSongs(data);
      } catch (err) {
        setError('Failed to fetch songs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []); 

  if (loading) {
    return <div className="loading-message">Loading CSV File Reader App...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="song-table-container">
      <h1>Song List</h1>
      <table>
        <thead>
          <tr>
            <th>Band</th>
            <th>Song Name</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>{song.band}</td>
              <td>{song.song_name}</td>
              <td>{song.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongTable;