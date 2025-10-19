import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "./supabase";

export interface AuthenticatedUser {
  id: string;
  email: string;
  user_metadata?: {
    display_name?: string;
  };
}

export interface AuthResult {
  user: AuthenticatedUser | null;
  error: string | null;
}

/**
 * Authenticate user from request headers
 * Extracts JWT token from Authorization header and verifies it
 */
export async function authenticateUser(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        user: null,
        error: 'Missing or invalid authorization header'
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const supabase = createServerSupabaseClient(token);
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return {
        user: null,
        error: error?.message || 'Invalid token'
      };
    }

    return {
      user: {
        id: user.id,
        email: user.email || '',
        user_metadata: user.user_metadata
      },
      error: null
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
}

/**
 * Create authenticated Supabase client for server-side operations
 */
export async function createAuthenticatedSupabaseClient(request: NextRequest) {
  const authResult = await authenticateUser(request);
  
  if (authResult.error || !authResult.user) {
    throw new Error(authResult.error || 'Authentication failed');
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.substring(7); // Remove 'Bearer ' prefix
  
  return {
    supabase: createServerSupabaseClient(token),
    user: authResult.user
  };
}
