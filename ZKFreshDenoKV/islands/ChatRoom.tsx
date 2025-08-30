/// <reference lib="deno.unstable" />
import { useState, useEffect } from "preact/hooks";

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  createdAt: string;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load messages
  const loadMessages = async () => {
    try {
      const response = await fetch("/api/chat");
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages || []);
      } else {
        setError(data.error || "Failed to load messages");
      }
    } catch (err) {
      setError("Failed to load messages");
      console.error("Error loading messages:", err);
    }
  };

  // Send message
  const sendMessage = async (e: Event) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNewMessage("");
        await loadMessages(); // Reload messages
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch (err) {
      setError("Failed to send message");
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Load messages on mount
  useEffect(() => {
    loadMessages();
    
    // Auto-refresh messages every 10 seconds
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Messages Area */}
      <div class="h-96 overflow-y-auto p-4 bg-gray-50 border-b">
        {messages.length === 0 ? (
          <div class="text-center text-gray-500 mt-20">
            <div class="text-4xl mb-4">💬</div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div class="space-y-4">
            {messages.map((message) => (
              <div key={message.id} class="bg-white rounded-lg p-4 shadow-sm">
                <div class="flex justify-between items-start mb-2">
                  <div class="font-semibold text-emerald-700">
                    {message.username}
                  </div>
                  <div class="text-xs text-gray-500">
                    {formatDate(message.createdAt)}
                  </div>
                </div>
                <div class="text-gray-800 break-words">
                  {message.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div class="p-4 bg-white">
        {error && (
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}
        
        <form onSubmit={sendMessage} class="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onInput={(e) => setNewMessage((e.target as HTMLInputElement).value)}
            placeholder="Type your message..."
            maxLength={500}
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            class="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
        
        <div class="mt-2 text-xs text-gray-500 text-right">
          {newMessage.length}/500 characters
        </div>
        
        <div class="mt-3 text-center">
          <button
            type="button"
            onClick={loadMessages}
            class="text-sm text-emerald-600 hover:text-emerald-700"
          >
            🔄 Refresh Messages
          </button>
        </div>
      </div>
    </div>
  );
}
