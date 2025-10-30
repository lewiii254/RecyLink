import React, { useEffect, useState } from "react";
import { rewardsAPI } from "../utils/api";

export default function ActivityFeed() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await rewardsAPI.getHistory();
        if (mounted && res.data.success) {
          setItems(res.data.rewards || []);
        }
      } catch (err) {
        console.error("Failed to fetch activity", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h4 className="font-semibold text-lg mb-3">Recent Activity</h4>
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-500">No recent rewards</div>
      ) : (
        <ul className="space-y-2 text-sm">
          {items.slice(0, 6).map((it) => (
            <li key={it._id} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2" />
              <div>
                <div className="text-gray-800">
                  {it.type} —{" "}
                  <span className="font-medium">+{it.pointsAwarded}</span>
                </div>
                <div className="text-gray-500 text-xs">
                  {it.description || ""} •{" "}
                  {new Date(it.createdAt).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
