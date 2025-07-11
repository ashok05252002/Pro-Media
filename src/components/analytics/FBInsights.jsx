import React, { useEffect, useState } from "react";
import { fetchFBInsights, fetchFBPostInsights } from "../../API/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const FBInsights = () => {
  const [pageData, setPageData] = useState([]);
  const [postData, setPostData] = useState([]);
  const [progress, setProgress] = useState("Loading...");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchFBInsights(), fetchFBPostInsights()])
      .then(([pageRes, postRes]) => {
        setPageData(pageRes); // ✅ Assuming pageRes is an array
        setPostData(postRes); // ✅ Assuming postRes is an array
        setProgress("✅ Data loaded");
      })
      .catch((err) => {
        console.error(err);
        setError("❌ Failed to fetch Facebook insights.");
        setProgress("Error");
      });
  }, []);

  const engagementMetric = pageData.find(m => m.name === "page_actions_post_reactions_total");
  const chartLabels = engagementMetric?.values.map(v => new Date(v.end_time).toLocaleDateString()) || [];
  const chartData = engagementMetric?.values.map(v => v.value) || [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
        📘 Facebook Insights Dashboard
      </h1>

      <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 text-blue-800 dark:text-blue-100 rounded-lg px-4 py-2 shadow-sm">
        {progress}
      </div>

      {error && (
        <p className="text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 px-4 py-2 rounded border border-red-300 dark:border-red-600 shadow-sm">
          {error}
        </p>
      )}

      {/* 📈 Reactions Chart */}
      {engagementMetric && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            📈 Post Reactions Over Time
          </h2>
          <Line
            data={{
              labels: chartLabels,
              datasets: [
                {
                  label: "Reactions",
                  data: chartData,
                  borderColor: "#2563eb",
                  backgroundColor: "rgba(37, 99, 235, 0.2)",
                  tension: 0.3,
                  pointRadius: 4
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: true } },
              scales: {
                x: { title: { display: true, text: "Date" } },
                y: { beginAtZero: true, title: { display: true, text: "Reactions" } }
              }
            }}
          />
        </div>
      )}

      {/* 📋 Post Insights Section */}
      {postData.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">📋 Post Insights</h2>
          <div className="space-y-4">
            {postData.map(post => (
              <div
                key={post.id}
                className="flex flex-col md:flex-row gap-4 items-start border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <img
                  src={post.thumbnail_url}
                  alt="Post thumbnail"
                  className="w-32 h-20 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <span className="font-medium text-gray-800 dark:text-gray-100">Posted:</span>{" "}
                    {new Date(post.created_time).toLocaleString()}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <div><span className="font-medium">Clicks:</span> {post.post_clicks}</div>
                    <div><span className="font-medium">Reactions:</span> {post.reactions}</div>
                    <div><span className="font-medium">Impressions:</span> {post.impressions}</div>
                    <div><span className="font-medium">Reach:</span> {post.reach}</div>
                    <div><span className="font-medium">Eng. Rate:</span> {post.engagement_rate}</div>
                    <div><span className="font-medium">Spend:</span> {post.spend}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 💠 Cards for Page Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageData.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              {metric.title || metric.name}
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {metric.values.map((v, i) => (
                <li key={i}>
                  <span className="font-medium">Value:</span>{" "}
                  {typeof v.value === "object" ? JSON.stringify(v.value) : v.value}
                  {v.end_time && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      (as of {new Date(v.end_time).toLocaleString()})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FBInsights;
