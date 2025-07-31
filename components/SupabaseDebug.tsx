"use client";

import { useState } from "react";
import { createClient } from "../utils/supabase/client";

const SupabaseDebug = () => {
  const [results, setResults] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    const testResults: Record<string, unknown> = {};
    const supabase = createClient();

    try {
      // Test 1: Basic connection
      console.log("Testing basic Supabase connection...");
      const { data: authData, error: authError } =
        await supabase.auth.getSession();
      testResults.auth = { data: authData, error: authError };

      // Test 2: Test comments table
      console.log("Testing comments table...");
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .limit(1);
      testResults.comments = { data: commentsData, error: commentsError };

      // Test 3: Test profiles table
      console.log("Testing profiles table...");
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);
      testResults.profiles = { data: profilesData, error: profilesError };

      // Test 4: Test join query
      console.log("Testing join query...");
      const { data: joinData, error: joinError } = await supabase
        .from("comments")
        .select(
          `
          id,
          content,
          created_at,
          author_id,
          votes,
          profiles(username)
        `
        )
        .limit(1);
      testResults.join = { data: joinData, error: joinError };

      setResults(testResults);
      console.log("Test results:", testResults);
    } catch (error) {
      console.error("Test failed:", error);
      testResults.error = error;
      setResults(testResults);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>Supabase Debug Panel</h3>
      <button onClick={testConnection} disabled={loading}>
        {loading ? "Testing..." : "Test Supabase Connection"}
      </button>

      {results && (
        <div style={{ marginTop: "20px" }}>
          <h4>Results:</h4>
          <pre
            style={{ background: "#f5f5f5", padding: "10px", overflow: "auto" }}
          >
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SupabaseDebug;
