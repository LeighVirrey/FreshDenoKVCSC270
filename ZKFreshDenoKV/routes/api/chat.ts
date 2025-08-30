/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";
import { getChatMessages, createChatMessage } from "../../lib/auth.ts";
import { getAuthState, requireAuth } from "../../lib/middleware.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
    const authState = await getAuthState(req);
    const authResponse = requireAuth(authState, true);
    if (authResponse) return authResponse;
    
    try {
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get("limit") || "50");
      const messages = await getChatMessages(limit);
      
      return new Response(JSON.stringify({ 
        success: true, 
        messages 
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to fetch messages" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  async POST(req, _ctx) {
    const authState = await getAuthState(req);
    const authResponse = requireAuth(authState, true);
    if (authResponse) return authResponse;
    
    try {
      const { message } = await req.json();
      
      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Message is required" 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      if (message.trim().length > 500) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Message too long (max 500 characters)" 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      const newMessage = await createChatMessage(
        authState.user!.id,
        authState.user!.username,
        message
      );
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: newMessage 
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error creating chat message:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to send message" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
