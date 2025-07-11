import React, { useEffect, useState } from "react";
import { fetchLNInsights } from "../../API/api"; // Make sure this file exists

const LNInsights = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLNInsights()
      .then((res) => {
        setData(res.elements || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Failed to fetch LinkedIn analytics.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📈 LinkedIn Insights</h2>
      <p>Total Records: {data.length}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {data.map((el, i) => (
          <div key={i} className="border p-4 shadow rounded bg-white">
            <p><strong>Share URN:</strong> {el.shareStatistic?.shareUrn || "N/A"}</p>
            <p><strong>Share Count:</strong> {el.totalShareStatistics?.shareCount ?? 0}</p>
            <p><strong>Like Count:</strong> {el.totalShareStatistics?.likeCount ?? 0}</p>
            <p><strong>Comment Count:</strong> {el.totalShareStatistics?.commentCount ?? 0}</p>
            <p><strong>Impression Count:</strong> {el.totalShareStatistics?.impressionCount ?? 0}</p>
            <p><strong>Click Count:</strong> {el.totalShareStatistics?.clickCount ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LNInsights;
