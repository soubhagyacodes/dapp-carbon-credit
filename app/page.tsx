'use client';

import BuySellSection from '@/components/Buy-Sell';
import ConnectWallet from '@/components/ConnectWallet';
import Landing from '@/components/Landing';
import { useWallet } from '@/store/walletStore';
import { BrowserProvider, Contract, formatEther } from 'ethers';
import { Loader2, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ABI from "@/ContractUtils/abi.json";

declare global {
  interface Window {
    ethereum?: any;
  }
}


export default function Home() {
  //   contract.on("Transferred", (from, to, amount, event) => {
  //   console.log(`Credits transferred from ${from} to ${to}: ${amount}`);
  //   console.log("Event details:", event);
  // });

  const { account, setAccount, setPlatformCredits, setUserCredits, userCredits, setBalance, balance, platformCredits } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new Contract((process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string), ABI, signer)

        const fetchedBalanceBigInt = await provider.getBalance(account)
        setBalance(Number(formatEther(fetchedBalanceBigInt)).toFixed(4))

        const fetchedPlatformCredits = await contract.totalCarbonCredits()
        setPlatformCredits(Number(fetchedPlatformCredits))

        const userBalance = await contract.getCreditBalance(account)
        setUserCredits(Number(userBalance))
      } catch (error) {
        console.error(error)
      }
      finally {
        setLoading(false)
      }
    }

    if (account) {
      fetchData()
    }
  }, [account])

  if (loading) {
    return <div className='flex gap-1 font-medium text-2xl mt-48 justify-center'>
      <Loader2 className='animate-spin text-emerald-700' size={30} /> Loading...
    </div>
  }


  if (!account) {
    return <Landing />
  }

  else {
    return (
      <main className="px-8 py-8 space-y-15">
        <div className='flex gap-5'>
          <div className='w-fit p-5 border border-gray-300 space-y-2 rounded-xl'>
            <p className='font-bold text-xl'>Your Balance</p>
            <div className='flex space-x-10'>
              <div className='flex items-end gap-1'>
                <Image src={"/greenoutline-leaf.png"} className='mb-4' width={25} alt='leaf' height={30} />
                <span className='text-8xl font-extrabold text-emerald-600'>{userCredits}</span> <span className='mb-1 font-medium'>Carbon Credits</span>
              </div>
              <span className='text-5xl self-end text-gray-300'> = </span>
              <span className='self-end text-gray-500 font-medium'> <span className='text-4xl font-bold'>{userCredits * 0.001}</span> ETH </span>
            </div>
            <p className='text-gray-500 font-medium'>1 Carbon Credit = 0.001 ETH</p>
          </div>

          <div className='w-fit p-5 border border-gray-300 space-y-1 rounded-xl'>
            <p className='text-2xl font-bold'>Wallet Details</p>
            <p className='text-gray-400'><span className='font-bold '>Wallet ID: </span> {account}</p>
            <div className='mt-4 flex justify-between items-end'>
              <div>
                <p className='font-bold'>Balance</p>
                <p className='font-medium flex gap-2 text-lg items-end'><span className='text-6xl font-extrabold'>{balance}</span> ETH</p>
              </div>

              <Wallet size={50} className='text-gray-500' />
            </div>
          </div>

        </div>

        {/* Buy sell section */}
        <BuySellSection />

      </main>
    );
  }
}
