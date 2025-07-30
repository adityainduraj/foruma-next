"use client";

// components/CommentSection.tsx
import { useState, useEffect, useContext, FormEvent } from "react";
import { supabase } from "../utils/supabaseClient";
import { AuthContext } from "../contexts/AuthContext";
import { Vote, CommentSectionProps, CommentData } from "../types";
import styles from "../styles/Discussion.module.css";
import LoadingSpinner from "./LoadingSpinner";
import VoteButtons from "./VoteButtons";
import toast from "react-hot-toast";

const CommentSection = ({ link }: CommentSectionProps) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [comment, setComment] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [userVotes, setUserVotes] = useState<Record<number, Vote>>({});

  useEffect(() => {
    fetchComments();
  }, [link]);

  useEffect(() => {
    if (user) {
      fetchUserVotes();
    }
  }, [user, comments]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      console.log("Fetching comments for link:", link);

      // Get comments first
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("link", link)
        .order("created_at", { ascending: false });

      if (commentsError) {
        console.error("Comments error details:", commentsError);
        throw new Error(`Comments query failed: ${commentsError.message}`);
      }

      if (!commentsData || commentsData.length === 0) {
        console.log("No comments found");
        setComments([]);
        return;
      }

      // Get profiles for these comments separately
      const authorIds = [...new Set(commentsData.map((c) => c.author_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", authorIds);

      if (profilesError) {
        console.warn("Profiles query failed:", profilesError);
      }

      // Combine manually
      const typedComments: CommentData[] = commentsData.map((comment) => {
        const profile = profilesData?.find((p) => p.id === comment.author_id);
        return {
          ...comment,
          profiles: {
            username: profile?.username || "Anonymous",
          },
        };
      });

      console.log("Setting comments:", typedComments);
      setComments(typedComments);
    } catch (error) {
      console.error("Detailed error fetching comments:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`Error loading comments: ${errorMessage}`);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    if (!user || comments.length === 0) return;

    try {
      const { data: votes, error } = await supabase
        .from("votes")
        .select("*")
        .eq("user_id", user.id)
        .in(
          "comment_id",
          comments.map((c) => c.id)
        );

      if (error) throw error;

      if (votes) {
        const votesMap = votes.reduce<Record<number, Vote>>((acc, vote) => {
          acc[vote.comment_id] = vote;
          return acc;
        }, {});
        setUserVotes(votesMap);
      }
    } catch (error) {
      console.error("Error fetching user votes:", error);
    }
  };

  const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (!user) {
      toast.error("You must be logged in to post a comment.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const { error } = await supabase.from("comments").insert({
        content: comment.trim(),
        link,
        author_id: user.id,
        votes: 0,
      });

      if (error) throw error;

      toast.success("Comment posted successfully!");
      setComment("");
      await fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Error posting comment. Please try again.");
    }
  };

  return (
    <div className={styles.commentSection}>
      <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
        <textarea
          placeholder={
            user ? "Join the conversation..." : "Please log in to comment."
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!user}
          required
        />
        {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
        <button type="submit" disabled={!user}>
          Post Comment
        </button>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : comments.length > 0 ? (
        <div className={styles.commentsList}>
          {comments.map((cmt) => (
            <div key={cmt.id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>
                  {cmt.profiles?.username || "Anonymous"}
                </span>
                <span className={styles.commentDate}>
                  {new Date(cmt.created_at).toLocaleString()}
                </span>
              </div>
              <p className={styles.commentText}>{cmt.content}</p>
              <VoteButtons
                commentId={cmt.id}
                initialVotes={cmt.votes}
                userVote={userVotes[cmt.id]}
                isAuthenticated={!!user}
                onVoteChange={(newCount) => {
                  setComments(
                    comments.map((c) =>
                      c.id === cmt.id ? { ...c, votes: newCount } : c
                    )
                  );
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentSection;
