const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchRandomPair() {
  const res = await fetch(`${API_BASE}/random_pair`);
  if (!res.ok) throw new Error('Failed to fetch pair');
  return res.json();
}

export async function selectWinner(country1Id, country2Id, winnerIsCountry1) {
  const params = new URLSearchParams({
    country1_id: country1Id,
    country2_id: country2Id,
    winner: winnerIsCountry1 ? 'true' : 'false',
  });
  const res = await fetch(`${API_BASE}/select_winner?${params}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to submit vote');
  return res.json();
}

export async function fetchCountries() {
  const res = await fetch(`${API_BASE}/countries`);
  if (!res.ok) throw new Error('Failed to fetch countries');
  return res.json();
}
