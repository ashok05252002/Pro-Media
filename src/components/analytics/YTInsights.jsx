import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchYTAnalytics } from "../../API/api";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Title, Tooltip);

const YTInsights = () => {
  const [filter, setFilter] = useState("7");
  const [authenticated, setAuthenticated] = useState(false);
  const [progress, setProgress] = useState("Ready");
  const [dailyData, setDailyData] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/check-auth", { withCredentials: true })
      .then((res) => {
        setAuthenticated(res.data.authenticated);
        if (res.data.authenticated) {
          fetchData();
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchData = async () => {
    setProgress("Fetching...");
    setError("");
    setDailyData([]);
    setVideoData([]);
    setChartData(null);

    try {
      const daily = await fetchYTAnalytics("day", filter);
      const video = await fetchYTAnalytics("video", filter);
      setDailyData(daily);
      setVideoData(video);
      setProgress("✅ Done!");

      const labels = daily.map((d) => d.data?.day || "N/A");
      const views = daily.map((d) => +d.data?.views || 0);
      const likes = daily.map((d) => +d.data?.likes || 0);
      const comments = daily.map((d) => +d.data?.comments || 0);
      const shares = daily.map((d) => +d.data?.shares || 0);

      setChartData({
        labels,
        datasets: [
          { label: "Views", data: views, borderColor: "#4285F4", fill: false },
          { label: "Likes", data: likes, borderColor: "#0F9D58", fill: false },
          { label: "Comments", data: comments, borderColor: "#F4B400", fill: false },
          { label: "Shares", data: shares, borderColor: "#DB4437", fill: false },
        ],
      });
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load analytics. Check your session or server.");
      setProgress("Error");
    }
  };

  if (!authenticated) {
    return (
      <div className="p-4 text-center text-gray-800 dark:text-gray-100">
        <h2 className="text-xl font-bold mb-4">📺 YouTube Analytics</h2>
        <a
          href="http://localhost:5000/login"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Login with Google
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📊 YouTube Analytics Dashboard</h1>

      <div className="flex gap-4 items-center mb-4">
        <label className="text-gray-700 dark:text-gray-300">Filter by Date:</label>
        <select
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-2 py-1 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="7">Last 7 days</option>
          <option value="28">Last 28 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last 365 days</option>
        </select>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={fetchData}>
          Get Analytics
        </button>
      </div>

      <div className="mb-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded">
        {progress}
      </div>
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {chartData && (
        <>
          <h3 className="text-lg font-semibold mb-2">📈 Daily Performance Chart</h3>
          <Line data={chartData} />
        </>
      )}

      <h2 className="text-xl font-bold mt-6 mb-2">📅 Daily Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dailyData.map((d, i) => (
          <div
            key={i}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded shadow"
          >
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{d.title}</h4>
            <p>Channel: {d.channel}</p>
            <p>Date: {d.data.day}</p>
            <p>Views: {+d.data.views || 0}</p>
            <p>Likes: {+d.data.likes || 0}</p>
            <p>Comments: {+d.data.comments || 0}</p>
            <p>Shares: {+d.data.shares || 0}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-6 mb-2">📹 Per-Video Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videoData.map((v, i) => (
          <div
            key={i}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded shadow"
          >
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{v.title}</h4>
            <img
              src={`https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`}
              alt="Thumbnail"
              className="w-full my-2 rounded"
            />
            <p>Channel: {v.channel}</p>
            <p>Views: {+v.views || 0}</p>
            <p>Likes: {+v.likes || 0}</p>
            <p>Comments: {+v.comments || 0}</p>
            <p>Shares: {+v.shares || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YTInsights;
