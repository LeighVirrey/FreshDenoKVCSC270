/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";
import { createUser, authenticateUser, createSession } from "../../../lib/auth.ts";

export const handler: Handlers = {
  // POST /api/auth/register - Register a new user
  async POST(req) {
    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();

    try {
      const body = await req.json();

      if (endpoint === "register") {
        // Validate required fields
        if (!body.username || typeof body.username !== "string") {
          return new Response(
            JSON.stringify({ error: "Username is required" }),
            { 
              status: 400, 
              headers: { "content-type": "application/json" } 
            }
          );
        }

        if (!body.email || typeof body.email !== "string") {
          return new Response(
            JSON.stringify({ error: "Email is required" }),
            { 
              status: 400, 
              headers: { "content-type": "application/json" } 
            }
          );
        }

        if (!body.password || typeof body.password !== "string" || body.password.length < 6) {
          return new Response(
            JSON.stringify({ error: "Password must be at least 6 characters long" }),
            { 
              status: 400, 
              headers: { "content-type": "application/json" } 
            }
          );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
          return new Response(
            JSON.stringify({ error: "Invalid email format" }),
            { 
              status: 400, 
              headers: { "content-type": "application/json" } 
            }
          );
        }

        // Create user
        const user = await createUser(body.username.trim(), body.email.trim().toLowerCase(), body.password);
        
        if (!user) {
          return new Response(
            JSON.stringify({ error: "Username or email already exists" }),
            { 
              status: 409, 
              headers: { "content-type": "application/json" } 
            }
          );
        }

        // Create session
        const session = await createSession(user);

        // Set session cookie
        const response = new Response(
          JSON.stringify({ 
            success: true, 
            user: { 
              id: user.id, 
              username: user.username, 
              email: user.email 
            } 
          }),
          {
            status: 201,
            headers: { "content-type": "application/json" },
          }
        );

        response.headers.set("Set-Cookie", `session=${session.id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
        return response;

      } else if (endpoint === "login") {
        // Validate required fields
        if (!body.usernameOrEmail || typeof body.usernameOrEmail !== "string") {
          return new Response(
            JSON.stringify({ error: "Username or email is required" }),
            { 
              status: 400, 
              headers: { "content-type": "application/json" } 
            }
          );
        }

        if (!body.password || typeof body.password !== "string") {
          return new Response(
            JSON.stringify({ error: "Password is required" }),
            { 
              status: 400, 
              headers: { "content-type": "application/json" } 
            }
          );
        }

        // Authenticate user
        const user = await authenticateUser(body.usernameOrEmail.trim(), body.password);
        
        if (!user) {
          return new Response(
            JSON.stringify({ error: "Invalid username/email or password" }),
            { 
              status: 401, 
              headers: { "content-type": "application/json" } 
            }
          );
        }

        // Create session
        const session = await createSession(user);

        // Set session cookie
        const response = new Response(
          JSON.stringify({ 
            success: true, 
            user: { 
              id: user.id, 
              username: user.username, 
              email: user.email 
            } 
          }),
          {
            headers: { "content-type": "application/json" },
          }
        );

        response.headers.set("Set-Cookie", `session=${session.id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
        return response;
      }

      return new Response(
        JSON.stringify({ error: "Invalid endpoint" }),
        { 
          status: 404, 
          headers: { "content-type": "application/json" } 
        }
      );

    } catch (error) {
      console.error("Auth API error:", error);
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
