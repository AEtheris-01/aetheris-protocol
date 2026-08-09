"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="space-y-4">
        <p className="text-green-400">
          Connected
        </p>

        <p className="text-sm break-all">
          {address}
        </p>

        <button
          onClick={() => disconnect()}
          className="rounded-lg bg-red-500 px-4 py-2"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold"
    >
      Connect MetaMask
    </button>
  );
}