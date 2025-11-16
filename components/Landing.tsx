'use client'

import { useWallet } from "@/store/walletStore"
import Image from "next/image"
import { BrowserProvider } from "ethers";
import { toast } from "react-toastify";
import { useState } from "react";
import { Loader2 } from "lucide-react";


export default function Landing() {

  const { account, setAccount } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      setLoading(true)
      const accounts = await provider.send("eth_requestAccounts", []);
      const walletAddress = accounts[0];

      toast.success("Wallet Connected")
      setAccount(walletAddress);
    } catch (err) {
      toast.error("Wallet Connected")
      console.error(err);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className="px-15 flex items-center justify-between mt-30">
      <div>
        <Image alt={""} src="/greencolor-leaf.png" width={50} height={50} />
        <p className="text-7xl font-semibold mt-3">Clean Earth.</p>
        <p className="text-7xl font-semibold">Clean Markets.</p>
        <p className="text-xl font-medium mt-2">Buy, Sell and Mint Carbon Credits On-Chain.</p>
        <button className='px-6 flex items-center gap-1 mt-8 py-3 text-xl disabled:bg-emerald-800 text-white font-extrabold rounded-xl bg-emerald-600 cursor-pointer hover:bg-emerald-700 duration-300'
          onClick={connectWallet} disabled={loading}
        >{loading && <Loader2 className="animate-spin" size={20}/>}Connect Wallet</button>
      </div>

      <Image alt={""} src="/illustration.png" width={730} height={800} className="absolute right-10 bottom-0"/>


    </div>
  )
}
