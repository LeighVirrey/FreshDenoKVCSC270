/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";
import { getAuthState } from "../../../lib/middleware.ts";

export const handler: Handlers = {
  // GET /api/auth/status - Check authentication status
  async GET(req) {
    try {
      const authState = await getAuthState(req);
      
      return new Response(
        JSON.stringify({ 
          authenticated: !!authState.user,
          user: authState.user 
        }),
        {
          headers: { "content-type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Auth status error:", error);
      return new Response(
        JSON.stringify({ 
          authenticated: false, 
          user: null,
          error: "Internal server error" 
        }),
        { 
          status: 500, 
          headers: { "content-type": "application/json" } 
        }
      );
    }
  },
};
