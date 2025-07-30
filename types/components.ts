// types/components.ts

import { ReactNode } from "react";
import { Vote } from "./supabase";

export interface CommentSectionProps {
    link: string;
}

export interface CommentData {
    id: number;
    content: string;
    created_at: string;
    author_id: string;
    votes: number;
    profiles: {
        username: string | null;
    };
}

export interface VoteButtonsProps {
    commentId: number;
    initialVotes: number;
    userVote?: Vote;
    isAuthenticated: boolean;
    onVoteChange: (newVoteCount: number) => void;
}

export interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
}

export interface LayoutProps {
    children: ReactNode;
}

export interface ErrorBoundaryProps {
    children: ReactNode;
}

export interface ErrorBoundaryState {
    hasError: boolean;
}

export interface OGData {
    title: string;
    description: string;
    image: string;
}
