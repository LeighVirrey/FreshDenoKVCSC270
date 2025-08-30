/// <reference lib="deno.unstable" />
import { PageProps, Handlers } from "$fresh/server.ts";
import { getAuthState, requireAuth, AuthState } from "../lib/middleware.ts";
import ChatRoom from "../islands/ChatRoom.tsx";

interface ChatPageProps {
  authState: AuthState;
}

export default function Chat(props: PageProps<ChatPageProps>) {
  const { authState } = props.data;
  
  return (
    <div class="min-h-screen bg-emerald-50">
      <div class="bg-emerald-700 text-white p-4">
        <div class="max-w-4xl mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold">💬 Chat Room</h1>
          <div class="flex items-center gap-4">
            <span class="text-emerald-200">Welcome, {authState?.user?.username}</span>
            <a href="/" class="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded transition-colors">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
      
      <div class="max-w-4xl mx-auto p-6">
        <ChatRoom />
      </div>
    </div>
  );
}

export const handler: Handlers<ChatPageProps> = {
  async GET(req, ctx) {
    const authState = await getAuthState(req);
    const authResponse = requireAuth(authState);
    
    if (authResponse) {
      return authResponse;
    }
    
    return ctx.render({ authState });
  },
};
