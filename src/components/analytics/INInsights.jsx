import React, { useEffect, useState } from "react";
import { fetchINInsights } from "../../API/api";

const INInsights = () => {
  const [data, setData] = useState([]);
  const [raw, setRaw] = useState(null);

  useEffect(() => {
    fetchINInsights()
      .then((res) => {
        setRaw(res);
        if (res && res.data) setData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📸 Instagram Insights</h2>
      {data.length > 0 ? (
        <ul className="list-disc ml-6">
          {data.map((metric) => (
            <li key={metric.name} className="mb-2">
              <strong>{metric.title || metric.name}</strong>:
              <ul className="ml-4 list-disc">
                {metric.values.map((v, i) => (
                  <li key={i}>
                    {typeof v.value === "object"
                      ? JSON.stringify(v.value)
                      : v.value}{" "}
                    {v.end_time ? `(as of ${v.end_time})` : ""}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading or no data...</p>
      )}

      <details className="mt-6">
        <summary className="cursor-pointer text-blue-600">Raw JSON</summary>
        <pre className="bg-gray-100 p-2 mt-2 rounded">
          {JSON.stringify(raw, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default INInsights;
