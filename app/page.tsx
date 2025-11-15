'use client';

import ConnectWallet from '@/components/ConnectWallet';
import Landing from '@/components/Landing';
import {useWallet} from '@/store/walletStore';
import { useState } from 'react';

export default function Home() {
  //   contract.on("Transferred", (from, to, amount, event) => {
  //   console.log(`Credits transferred from ${from} to ${to}: ${amount}`);
  //   console.log("Event details:", event);
  // });
  const {account, setAccount} = useWallet()

  if (!account) {
    return <Landing />
  }

  else {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        Ye le lund ke
      </main>
    );
  }
}
