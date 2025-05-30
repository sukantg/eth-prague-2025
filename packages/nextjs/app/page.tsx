"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex items-center flex-col min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-4xl px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Trust Bazaar
            </h1>
            <p className="text-xl text-base-content/80">Your Decentralized Marketplace</p>
          </div>

          {connectedAddress && (
            <div className="flex flex-col items-center space-y-4 p-6 bg-base-100 rounded-2xl shadow-lg">
              <p className="text-lg font-medium text-base-content/70">Connected Wallet</p>
              <div className="flex items-center space-x-2">
                <Address address={connectedAddress} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
