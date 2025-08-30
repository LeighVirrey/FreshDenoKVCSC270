/// <reference lib="deno.unstable" />
import * as bcrypt from "bcryptjs";

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  username: string;
  email: string;
  createdAt: string;
  expiresAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  createdAt: string;
}

const kv = await Deno.openKv();

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password using bcrypt
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Create a new user
export async function createUser(username: string, email: string, password: string): Promise<User | null> {
  // Check if username or email already exists
  const [existingUsername, existingEmail] = await kv.getMany([
    ["users_by_username", username],
    ["users_by_email", email]
  ]);

  if (existingUsername.value || existingEmail.value) {
    return null; // User already exists
  }

  const user: User = {
    id: crypto.randomUUID(),
    username,
    email,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Store user with atomic operation to ensure uniqueness
  const result = await kv.atomic()
    .check({ key: ["users", user.id], versionstamp: null })
    .check({ key: ["users_by_username", username], versionstamp: null })
    .check({ key: ["users_by_email", email], versionstamp: null })
    .set(["users", user.id], user)
    .set(["users_by_username", username], user.id)
    .set(["users_by_email", email], user.id)
    .commit();

  return result.ok ? user : null;
}

// Authenticate user
export async function authenticateUser(usernameOrEmail: string, password: string): Promise<User | null> {
  // Try to find user by username first, then by email
  let userId: string | null = null;
  
  const usernameResult = await kv.get(["users_by_username", usernameOrEmail]);
  if (usernameResult.value) {
    userId = usernameResult.value as string;
  } else {
    const emailResult = await kv.get(["users_by_email", usernameOrEmail]);
    if (emailResult.value) {
      userId = emailResult.value as string;
    }
  }

  if (!userId) {
    return null; // User not found
  }

  const userResult = await kv.get(["users", userId]);
  if (!userResult.value) {
    return null; // User not found
  }

  const user = userResult.value as User;
  const isValidPassword = await verifyPassword(password, user.passwordHash);
  
  return isValidPassword ? user : null;
}

// Create a session
export async function createSession(user: User): Promise<Session> {
  const session: Session = {
    id: crypto.randomUUID(),
    userId: user.id,
    username: user.username,
    email: user.email,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  };

  await kv.set(["sessions", session.id], session, {
    expireIn: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  });

  return session;
}

// Get session
export async function getSession(sessionId: string): Promise<Session | null> {
  const result = await kv.get(["sessions", sessionId]);
  if (!result.value) {
    return null;
  }

  const session = result.value as Session;
  
  // Check if session has expired
  if (new Date(session.expiresAt) < new Date()) {
    await deleteSession(sessionId);
    return null;
  }

  return session;
}

// Delete session
export async function deleteSession(sessionId: string): Promise<void> {
  await kv.delete(["sessions", sessionId]);
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  const result = await kv.get(["users", userId]);
  return result.value ? result.value as User : null;
}

// Chat functions
export async function createChatMessage(userId: string, username: string, message: string): Promise<ChatMessage> {
  const messageId = crypto.randomUUID();
  const chatMessage: ChatMessage = {
    id: messageId,
    userId,
    username,
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  
  await kv.set(["chat_messages", messageId], chatMessage);
  return chatMessage;
}

export async function getChatMessages(limit: number = 50): Promise<ChatMessage[]> {
  const messages: ChatMessage[] = [];
  const iter = kv.list({ prefix: ["chat_messages"] });
  
  for await (const entry of iter) {
    if (entry.value) {
      messages.push(entry.value as ChatMessage);
    }
  }
  
  // Sort by creation date (newest first) and limit
  return messages
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
