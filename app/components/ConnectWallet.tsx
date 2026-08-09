"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-green-400 font-semibold">
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

  const metaMaskConnector = connectors[0];

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={() => {
          if (metaMaskConnector) {
            connect({
              connector: metaMaskConnector,
            });
          }
        }}
        disabled={isPending || !metaMaskConnector}
        className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold disabled:opacity-50"
      >
        {isPending ? "Connecting..." : "Connect MetaMask"}
      </button>

      {error && (
        <p className="max-w-md text-sm text-red-400 text-center">
          {error.message}
        </p>
      )}
    </div>
  );
}
