import React, { useEffect, useState } from "react";
import { fetchXInsights } from "../../API/api";

const XInsights = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchXInsights();
        setTweets(data.analytics || []);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("❌ Failed to load analytics from X API.");
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) return <p className="p-4 text-gray-600">Loading X Analytics...</p>;
  if (error) return <p className="text-red-600 p-4">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🐦 X (Twitter) Analytics</h2>
      <div className="grid gap-4">
        {tweets.map((tweet) => (
          <div key={tweet.tweet_id} className="border p-4 rounded-lg shadow bg-white">
            <p className="text-sm text-gray-500 mb-2">🗓 {new Date(tweet.created_at).toLocaleString()}</p>
            <p className="mb-3 text-gray-800">{tweet.text}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>👍 Likes: {tweet.likes}</span>
              <span>🔁 Retweets: {tweet.retweets}</span>
              <span>💬 Replies: {tweet.replies}</span>
              <span>🔖 Quotes: {tweet.quotes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default XInsights;
