import { supabase } from '../lib/supabase';

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
  emotions: SessionEmotions;
}

export interface DayData {
  date: string;
  sessions: Session[];
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
    date: dbSession.created_at.split('T')[0], // Extract date from timestamp
    name: dbSession.name,
    color: dbSession.color,
    emotions
  };
}

// Fetch sessions for a specific date
export async function fetchSessionsForDate(userId: string, date: string): Promise<DayData | null> {
  const startOfDay = `${date}T00:00:00.000Z`;
  const endOfDay = `${date}T23:59:59.999Z`;

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      session_emotions(
        *,
        emotions(*)
      )
    `)
    .eq('user_id', userId)
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)
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
  endDate: string
): Promise<DayData[]> {
  const startOfRange = `${startDate}T00:00:00.000Z`;
  const endOfRange = `${endDate}T23:59:59.999Z`;

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      session_emotions(
        *,
        emotions(*)
      )
    `)
    .eq('user_id', userId)
    .gte('created_at', startOfRange)
    .lte('created_at', endOfRange)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching sessions for date range:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Group sessions by date
  const sessionsByDate = new Map<string, DatabaseSession[]>();
  
  data.forEach(session => {
    const date = session.created_at.split('T')[0];
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
  color: string
): Promise<DatabaseSession | null> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      name: name,
      audio_file: null,
      transcript: transcript,
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
  }>
): Promise<boolean> {
  const sessionEmotionsData = emotions.map(emotion => ({
    session_id: sessionId,
    emotion_id: emotion.emotion_id,
    intensity: emotion.intensity,
  }));

  const { error } = await supabase
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
  }>
): Promise<{ success: boolean; sessionId?: number; error?: string }> {
  try {
    // Create the session
    const session = await createSession(userId, name, transcript, color);
    if (!session) {
      return { success: false, error: 'Failed to create session' };
    }

    // Create the session emotions
    const emotionsCreated = await createSessionEmotions(session.id, emotions);
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
export async function fetchEmotions(): Promise<DatabaseEmotion[]> {
  const { data, error } = await supabase
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
