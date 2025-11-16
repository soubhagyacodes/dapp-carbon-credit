'use client';

import BuySellSection from '@/components/Buy-Sell';
import Landing from '@/components/Landing';
import { useWallet } from '@/store/walletStore';
import { BrowserProvider, Contract, formatEther } from 'ethers';
import { Globe, Loader2, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ABI from "@/ContractUtils/abi.json";
import MintCredits from '@/components/MintCredits';
import OwnerSection from '@/components/OwnerSection';
import FetchUserDetails from '@/components/FetchUserDetails';

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

  const { account, setAccount,setPlatformBalance, isOwner, setPlatformCredits,platformBalance, setIsOwner, setUserCredits, userCredits, setBalance, balance, platformCredits } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new Contract((process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string), ABI, signer)

        const fetchedBalanceBigInt = await provider.getBalance(account)
        
        const fetchedPlatformCredits = await contract.getPlatformAvailableCredits()
        
        const userBalance = await contract.getCreditBalance(account)

        const fetchedPlatformBalance = await contract.getContractBalance()

        setPlatformBalance(Number(formatEther(fetchedPlatformBalance)).toFixed(4))
        setBalance(Number(formatEther(fetchedBalanceBigInt)).toFixed(4))
        setPlatformCredits(Number(fetchedPlatformCredits))
        setUserCredits(Number(userBalance))

        const ownerStatus = await contract.isOwner(account)
        setIsOwner(ownerStatus)
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

  else if(isOwner){
    return (
      <main className="px-8 py-8 space-y-15">
        <div className='flex gap-5'>


          <div className='w-fit p-5 text-white bg-emerald-600 space-y-6 rounded-xl'>
            <p className='font-bold text-xl'>Available Platform Carbon Credits</p>
            <div className='flex space-x-10'>
              <div className='flex items-end gap-1'>
                <Image src={"/greenoutline-leaf-white.png"} className='mb-4' width={25} alt='leaf' height={30} />
                <span className='text-8xl font-extrabold text-white'>{platformCredits}</span> <span className='mb-1 font-medium'>Carbon Credits</span>
              </div>
              <span className='text-5xl self-end '> = </span>
              <span className='self-end font-medium'> <span className='text-4xl font-bold'>{platformCredits * 0.001}</span> ETH </span>
            </div>
            <p className='font-medium'>1 Carbon Credit = 0.001 ETH</p>
          </div>

          <div className='flex-1 flex flex-col p-5 border-3 border-emerald-500 space-y-1 rounded-xl'>
            <p className='text-4xl font-semibold'>Platform Balance</p>
            <p className='font-medium'>The Amount till which you can mint</p>
            <div className='mt-4 flex-1 flex justify-between items-end'>
              <div>
                <p className='font-bold'>Balance</p>
                <p className='font-medium flex gap-2 text-lg items-end'><span className='text-7xl font-bold'>{platformBalance}</span> ETH</p>
              </div>

              <Globe size={50} className='text-emerald-600' />
            </div>
          </div>

          <div className='w-fit flex flex-col p-5 border-3 border-emerald-500 space-y-1 rounded-xl'>
            <p className='text-4xl font-semibold'>Wallet Details</p>
            <p className='text-gray-400'><span className='font-bold '>Wallet ID: </span> {account}</p>
            <div className='mt-4 flex-1 flex justify-between items-end'>
              <div>
                <p className='font-bold'>Balance</p>
                <p className='font-medium flex gap-2 text-lg items-end'><span className='text-7xl font-bold'>{balance}</span> ETH</p>
              </div>

              <Wallet size={50} className='text-emerald-600' />
            </div>
          </div>

        </div>


        <MintCredits />

        <FetchUserDetails />

        <OwnerSection />
      </main>
    )
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
