/// <reference lib="deno.unstable" />
import { getSession, Session } from "./auth.ts";

export interface AuthState {
  user: {
    id: string;
    username: string;
    email: string;
  } | null;
  session: Session | null;
}

export async function getAuthState(request: Request): Promise<AuthState> {
  const cookies = request.headers.get("cookie") || "";
  const sessionMatch = cookies.match(/session=([^;]+)/);
  
  if (!sessionMatch) {
    return { user: null, session: null };
  }

  const sessionId = sessionMatch[1];
  const session = await getSession(sessionId);
  
  if (!session) {
    return { user: null, session: null };
  }

  return {
    user: {
      id: session.userId,
      username: session.username,
      email: session.email,
    },
    session,
  };
}

export function requireAuth(authState: AuthState, isApiRequest = false): Response | null {
  if (!authState.user) {
    if (isApiRequest) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "content-type": "application/json" },
        }
      );
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
      },
    });
  }
  return null;
}
