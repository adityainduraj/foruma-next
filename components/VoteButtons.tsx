import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Vote } from "../types/supabase";
import styles from "../styles/VoteButtons.module.css";
import toast from "react-hot-toast";

interface VoteButtonsProps {
  commentId: number;
  initialVotes: number;
  userVote?: Vote;
  isAuthenticated: boolean;
  onVoteChange: (newVoteCount: number) => void;
}

const VoteButtons = ({
  commentId,
  initialVotes,
  userVote,
  isAuthenticated,
  onVoteChange,
}: VoteButtonsProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [loading, setLoading] = useState(false);

  const handleVote = async (value: 1 | -1) => {
    if (!isAuthenticated) {
      toast.error("Please login to vote");
      return;
    }

    setLoading(true);
    try {
      if (userVote?.value === value) {
        // Remove vote
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("comment_id", commentId);

        if (error) throw error;
        setVotes(votes - value);
        onVoteChange(votes - value);
      } else {
        if (userVote) {
          // Update vote
          const { error } = await supabase
            .from("votes")
            .update({ value })
            .eq("comment_id", commentId);

          if (error) throw error;
          setVotes(votes - userVote.value + value);
          onVoteChange(votes - userVote.value + value);
        } else {
          // Insert new vote
          const { error } = await supabase
            .from("votes")
            .insert({ comment_id: commentId, value });

          if (error) throw error;
          setVotes(votes + value);
          onVoteChange(votes + value);
        }
      }
    } catch (error) {
      toast.error("Error updating vote");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.voteContainer}>
      <button
        className={`${styles.voteButton} ${
          userVote?.value === 1 ? styles.voted : ""
        }`}
        onClick={() => handleVote(1)}
        disabled={loading}
      >
        ↑
      </button>
      <span className={styles.voteCount}>{votes}</span>
      <button
        className={`${styles.voteButton} ${
          userVote?.value === -1 ? styles.voted : ""
        }`}
        onClick={() => handleVote(-1)}
        disabled={loading}
      >
        ↓
      </button>
    </div>
  );
};

export default VoteButtons;
