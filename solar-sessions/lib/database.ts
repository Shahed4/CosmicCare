import { supabase } from '../lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

// Types matching your database schema
export interface DatabaseEmotion {
  id: number;
  name: string;
  is_positive: boolean;
  color: string;
}

export interface DatabaseSessionEmotion {
  id: number;
  session_id: number;
  emotion_id: number;
  intensity: number;
  emotions: DatabaseEmotion;
}

export interface DatabaseSession {
  id: number;
  user_id: string;
  name: string;
  audio_file: string | null;
  transcript: string | null;
  advice: string | null;
  created_at: string;
  color: string;
  session_emotions: DatabaseSessionEmotion[];
}

export interface SessionEmotions {
  positive: Array<{
    name: string;
    intensity: number;
    color: string;
  }>;
  negative: Array<{
    name: string;
    intensity: number;
    color: string;
  }>;
}

export interface Session {
  id: number;
  date: string;
  name: string;
  color: string;
  transcript: string | null;
  advice: string | null;
  emotions: SessionEmotions;
}

export interface DayData {
  date: string;
  sessions: Session[];
}

// Utility function to get local date string from timestampz
function getLocalDateString(timestampz: string): string {
  const date = new Date(timestampz);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Utility function to get today's date in YYYY-MM-DD format (local time)
export function getTodayLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Utility function to create local date range for database queries
function createLocalDateRange(dateString: string): { start: string; end: string } {
  const date = new Date(dateString + 'T00:00:00'); // Local midnight
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString()
  };
}

// Utility function to transform database data to match your existing structure
export function transformDatabaseSessionToSession(dbSession: DatabaseSession): Session {
  const emotions: SessionEmotions = {
    positive: [],
    negative: []
  };

  // Group emotions by positive/negative
  dbSession.session_emotions.forEach(se => {
    const emotionData = {
      name: se.emotions.name,
      intensity: se.intensity,
      color: se.emotions.color
    };

    if (se.emotions.is_positive) {
      emotions.positive.push(emotionData);
    } else {
      emotions.negative.push(emotionData);
    }
  });

  return {
    id: dbSession.id,
    date: getLocalDateString(dbSession.created_at), // Extract local date from timestamp
    name: dbSession.name,
    color: dbSession.color,
    transcript: dbSession.transcript,
    advice: dbSession.advice,
    emotions
  };
}

// Fetch sessions for a specific date
export async function fetchSessionsForDate(userId: string, date: string, client?: SupabaseClient): Promise<DayData | null> {
  const { start, end } = createLocalDateRange(date);
  const supabaseClient = client || supabase;

  const { data, error } = await supabaseClient
    .from('sessions')
    .select(`
      *,
      session_emotions(
        *,
        emotions(*)
      )
    `)
    .eq('user_id', userId)
    .gte('created_at', start)
    .lte('created_at', end)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching sessions:', error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const sessions = data.map(transformDatabaseSessionToSession);

  return {
    date,
    sessions
  };
}

// Fetch sessions for a date range (for calendar view)
export async function fetchSessionsForDateRange(
  userId: string, 
  startDate: string, 
  endDate: string,
  client?: SupabaseClient
): Promise<DayData[]> {
  const startRange = createLocalDateRange(startDate);
  const endRange = createLocalDateRange(endDate);
  const supabaseClient = client || supabase;

  const { data, error } = await supabaseClient
    .from('sessions')
    .select(`
      *,
      session_emotions(
        *,
        emotions(*)
      )
    `)
    .eq('user_id', userId)
    .gte('created_at', startRange.start)
    .lte('created_at', endRange.end)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching sessions for date range:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Group sessions by local date
  const sessionsByDate = new Map<string, DatabaseSession[]>();
  
  data.forEach(session => {
    const date = getLocalDateString(session.created_at);
    if (!sessionsByDate.has(date)) {
      sessionsByDate.set(date, []);
    }
    sessionsByDate.get(date)!.push(session);
  });

  // Convert to DayData format
  const dayDataArray: DayData[] = [];
  sessionsByDate.forEach((sessions, date) => {
    const transformedSessions = sessions.map(transformDatabaseSessionToSession);
    dayDataArray.push({
      date,
      sessions: transformedSessions
    });
  });

  return dayDataArray.sort((a, b) => a.date.localeCompare(b.date));
}

// Create a new session
export async function createSession(
  userId: string,
  name: string,
  transcript: string,
  color: string,
  advice: string | null = null,
  client?: SupabaseClient
): Promise<DatabaseSession | null> {
  const supabaseClient = client || supabase;
  
  const { data, error } = await supabaseClient
    .from('sessions')
    .insert({
      user_id: userId,
      name: name,
      audio_file: null,
      transcript: transcript,
      advice: advice,
      color: color,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    return null;
  }

  return data;
}

// Create session emotions
export async function createSessionEmotions(
  sessionId: number,
  emotions: Array<{
    emotion_id: number;
    intensity: number;
  }>,
  client?: SupabaseClient
): Promise<boolean> {
  const supabaseClient = client || supabase;
  const sessionEmotionsData = emotions.map(emotion => ({
    session_id: sessionId,
    emotion_id: emotion.emotion_id,
    intensity: emotion.intensity,
  }));

  const { error } = await supabaseClient
    .from('session_emotions')
    .insert(sessionEmotionsData);

  if (error) {
    console.error('Error creating session emotions:', error);
    return false;
  }

  return true;
}

// Complete session creation with emotions
export async function createSessionWithEmotions(
  userId: string,
  name: string,
  transcript: string,
  color: string,
  emotions: Array<{
    emotion_id: number;
    intensity: number;
  }>,
  advice: string | null = null,
  client?: SupabaseClient
): Promise<{ success: boolean; sessionId?: number; error?: string }> {
  try {
    // Create the session
    const session = await createSession(userId, name, transcript, color, advice, client);
    if (!session) {
      return { success: false, error: 'Failed to create session' };
    }

    // Create the session emotions
    const emotionsCreated = await createSessionEmotions(session.id, emotions, client);
    if (!emotionsCreated) {
      return { success: false, error: 'Failed to create session emotions' };
    }

    return { success: true, sessionId: session.id };
  } catch (error) {
    console.error('Error in createSessionWithEmotions:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Fetch all available emotions
export async function fetchEmotions(client?: SupabaseClient): Promise<DatabaseEmotion[]> {
  const supabaseClient = client || supabase;
  
  const { data, error } = await supabaseClient
    .from('emotions')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching emotions:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return [];
  }

  return data || [];
}
