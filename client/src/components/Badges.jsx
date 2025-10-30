import React from "react";

const BADGE_TIERS = [
  {
    key: "platinum",
    label: "Platinum",
    threshold: 5000,
    color: "bg-indigo-600",
  },
  { key: "gold", label: "Gold", threshold: 1000, color: "bg-yellow-500" },
  { key: "silver", label: "Silver", threshold: 500, color: "bg-gray-400" },
  { key: "bronze", label: "Bronze", threshold: 100, color: "bg-orange-500" },
];

export default function Badges({ points = 0 }) {
  return (
    <div>
      <h4 className="font-semibold text-lg mb-3">Badges</h4>
      <div className="flex space-x-3">
        {BADGE_TIERS.map((b) => {
          const earned = points >= b.threshold;
          return (
            <div
              key={b.key}
              className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center p-2 ${
                earned ? "shadow-md" : "opacity-40"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  earned ? b.color : "bg-gray-300"
                }`}
              >
                {b.label[0]}
              </div>
              <div className="text-xs text-center mt-2">{b.label}</div>
              <div className="text-[10px] text-gray-500">{b.threshold} pts</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
