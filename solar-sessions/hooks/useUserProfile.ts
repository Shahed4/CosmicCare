"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  id: string;
  display_name: string;
  created_at: string;
  last_login: string;
}

export function useUserProfile() {
  const { user, getUserProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getUserProfile()
        .then(({ data, error }) => {
          if (error) {
            setError(error);
          } else {
            setProfile(data);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setProfile(null);
      setError(null);
    }
  }, [user, getUserProfile]);

  return { profile, loading, error };
}
