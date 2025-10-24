import React, { useState } from "react";
import toast from "react-hot-toast";

// Reusable SuiConnect component (safe demo scaffold)
export default function SuiConnect() {
  const [addr, setAddr] = useState(() => {
    try {
      return localStorage.getItem("suiAddress") || null;
    } catch {
      return null;
    }
  });
  const [busy, setBusy] = useState(false);

  const detectProvider = () => {
    if (typeof window === "undefined") return null;
    return window.sui || window.suiWallet || window.suiwallet || null;
  };

  const handleConnect = async () => {
    const provider = detectProvider();
    setBusy(true);
    try {
      if (!provider) {
        toast.error(
          "No Sui wallet extension detected. Install a Sui wallet or use the demo connect."
        );
        const demo = `0xDEMO${Math.random()
          .toString(16)
          .slice(2, 10)
          .toUpperCase()}`;
        setAddr(demo);
        localStorage.setItem("suiAddress", demo);
        toast.success("Connected (demo address)");
        return;
      }

      // Placeholder behavior: inform user and set demo address.
      toast(
        "Sui wallet detected — adapter integration is available. Using demo connect for now.",
        { icon: "🔌" }
      );
      const demoAddr = `0xSUI${Math.random()
        .toString(16)
        .slice(2, 10)
        .toUpperCase()}`;
      setAddr(demoAddr);
      localStorage.setItem("suiAddress", demoAddr);
    } catch (err) {
      console.error("Sui connect error", err);
      toast.error("Failed to connect to Sui wallet");
    } finally {
      setBusy(false);
    }
  };

  const handleDisconnect = () => {
    setAddr(null);
    try {
      localStorage.removeItem("suiAddress");
    } catch {}
    toast("Disconnected", { icon: "🔌" });
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-700">
        {addr ? `Connected: ${addr}` : "No wallet connected"}
      </div>
      <div className="flex items-center space-x-3">
        {!addr ? (
          <button
            onClick={handleConnect}
            disabled={busy}
            className="btn btn-primary"
          >
            {busy ? "Connecting..." : "Connect Sui Wallet (demo)"}
          </button>
        ) : (
          <>
            <button onClick={handleDisconnect} className="btn btn-outline">
              Disconnect
            </button>
            <a
              href="https://docs.sui.io/"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary-600 underline"
            >
              Sui docs
            </a>
          </>
        )}
      </div>
      <div className="text-xs text-gray-500">
        This is a safe demo scaffold. To enable real wallet interactions we'll
        wire the official Sui Wallet Adapter and @mysten/sui.js — I can add that
        next.
      </div>
    </div>
  );
}
