export const songService = {
  async fetchSongs() {
    const response = await fetch(`${import.meta.env.VITE_LOCALHOST}/songs`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch songs`);
    }
    
    return response.json();
  }
};