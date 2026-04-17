import { useState, useEffect, useRef } from 'react';
import { subscribeToEvents, isParsedEvent, asKind0, type ParsedEvent, type WorkerMessage } from '../lib/nipworker-mock.js';

export interface UserProfileState {
  profile: ParsedEvent | null;
  loading: boolean;
}

export function useUserProfile(pubkey: string | undefined): UserProfileState {
  const [profile, setProfile] = useState<ParsedEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (!pubkey) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setProfile(null);

    const subId = `user_profile_${pubkey}`;
    unsubscribeRef.current = subscribeToEvents(subId, [{ kinds: [0], authors: [pubkey] }], (message: WorkerMessage) => {
      const parsed = isParsedEvent(message);
      const kind0 = asKind0(parsed);
      if (!kind0 || !parsed) return;
      setProfile(parsed);
      setLoading(false);
    });

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      unsubscribeRef.current?.();
    };
  }, [pubkey]);

  return { profile, loading };
}
