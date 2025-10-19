"use client";

import { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfileTest() {
  const { profile, loading, error } = useUserProfile();
  const { ensureUserExists } = useAuth();
  const [ensuring, setEnsuring] = useState(false);

  const handleEnsureUser = async () => {
    setEnsuring(true);
    const { error } = await ensureUserExists();
    if (error) {
      console.error('Error ensuring user exists:', error);
    } else {
      console.log('User ensured successfully');
      // Refresh the profile data
      window.location.reload();
    }
    setEnsuring(false);
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!profile) return <div>No profile data</div>;

  return (
    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', margin: '1rem' }}>
      <h3>User Profile Data</h3>
      <p><strong>ID:</strong> {profile.id}</p>
      <p><strong>Display Name:</strong> {profile.display_name}</p>
      <p><strong>Created:</strong> {new Date(profile.created_at).toLocaleString()}</p>
      <p><strong>Last Login:</strong> {new Date(profile.last_login).toLocaleString()}</p>
      
      <button 
        onClick={handleEnsureUser}
        disabled={ensuring}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#ffd700',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: ensuring ? 'not-allowed' : 'pointer'
        }}
      >
        {ensuring ? 'Ensuring...' : 'Ensure User Exists'}
      </button>
    </div>
  );
}
