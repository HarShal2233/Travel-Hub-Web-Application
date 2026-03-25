import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) return { error: { message: error.message } };
  return { error: null };
}

export async function getUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return {
      id: user.id,
      email: user.email || '',
      fullName: user.user_metadata?.full_name || user.email || '',
    };
  }
  return null;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
