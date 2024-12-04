// types/supabase.ts

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: number;
  content: string;
  link: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  votes: number;
  profiles?: Profile;
};

export type Vote = {
  id: number;
  comment_id: number;
  user_id: string;
  value: 1 | -1;
  created_at: string;
};
