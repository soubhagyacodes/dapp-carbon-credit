'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { BrowserProvider } from 'ethers';
import { toast } from 'react-toastify';

type ConnectWalletProps = {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ConnectWallet({account, setAccount} : ConnectWalletProps) {
  const [balance, setBalance] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const walletAddress = accounts[0];

      toast.success("Wallet Connected")
      setAccount(walletAddress);
    } catch (err) {
      toast.error("Wallet Connected")
      console.error(err);
    }
  };

  
  const getBalance = async (address: string) => {
    const provider = new BrowserProvider(window.ethereum);
    const balanceBigInt = await provider.getBalance(address);
    setBalance(ethers.formatEther(balanceBigInt));
  };

  useEffect(() => {
    if (account) {
      getBalance(account)
    }
  }, [account])

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      setAccount(accounts[0] || null);
      if (accounts[0]) getBalance(accounts[0]);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Connect MetaMask
        </button>
      ) : (
        <div>
          <p className="font-semibold">Connected Wallet:</p>
          <p className="wrap-break-word">{account}</p>
          <p className="mt-2">Balance: {balance} ETH</p>
        </div>
      )}
    </div>
  );
}
