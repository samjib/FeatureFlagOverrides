'use client'

import { useEffect, useState } from 'react';

export default function Home() {
  const [flags, setFlags] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch feature flags from /configuration
    fetch('/api/feature-flags')
      .then((response) => response.json())
      .then((data) => {
        setFlags(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching feature flags:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1 style={{ marginBottom: "1rem", fontSize: "2rem" }}>Feature Flag Demo</h1>

      <h2 style={{ marginBottom: "0.75rem", fontSize: "1.5rem" }}>Current Feature Flags</h2>
      <pre>{JSON.stringify(flags, null, 2)}</pre>

      <button
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "1rem", borderRadius: "0.25rem", border: "1px solid #333", backgroundColor: "#f0f0f0", cursor: "pointer", color: "#333", fontWeight: "bold" }}
        onClick={() => {
          setLoading(true);
          fetch('/api/feature-flags')
            .then((response) => response.json())
            .then((data) => {
              setFlags(data);
              setLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching feature flags:', error);
              setLoading(false);
            });
        }
        }>Refresh</button>
    </div>
  );
}