/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";
import { deleteSession } from "../../../lib/auth.ts";

export const handler: Handlers = {
  // POST /api/auth/logout - Logout user
  async POST(req) {
    try {
      // Get session from cookie
      const cookies = req.headers.get("cookie") || "";
      const sessionMatch = cookies.match(/session=([^;]+)/);
      
      if (sessionMatch) {
        const sessionId = sessionMatch[1];
        await deleteSession(sessionId);
      }

      // Clear session cookie
      const response = new Response(
        JSON.stringify({ success: true, message: "Logged out successfully" }),
        {
          headers: { "content-type": "application/json" },
        }
      );

      response.headers.set("Set-Cookie", `session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
      return response;

    } catch (error) {
      console.error("Logout error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { 
          status: 500, 
          headers: { "content-type": "application/json" } 
        }
      );
    }
  },
};
