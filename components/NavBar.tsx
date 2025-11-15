'use client'

import { useWallet } from '@/store/walletStore'
import { BrowserProvider } from 'ethers'
import { Check } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-toastify'

export default function NavBar() {
   const { account, setAccount } = useWallet()

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

   return (
      <div className='flex items-center py-6 px-6 border border-gray-100 shadow-xs justify-between'>
         <div className='flex items-center font-extrabold text-emerald-700 text-2xl gap-1'>
            <Image
               src="/Greenbg-leaf.png"
               width={20}
               height={40}
               alt=""
               className='size-8'
            />
            CarbonX
         </div>

         {!account ? <button className='px-4 py-2 text-white font-extrabold rounded-xl bg-primary cursor-pointer hover:bg-primary-hover duration-300'
            onClick={connectWallet}
         >Connect Wallet</button>
            :
            <div className='flex items-center'>
               <div>
                  <div className='flex gap-1 items-center'>
                     <Check className='text-primary' size={18}/>
                     <p className='text-xs font-medium'>Connected Wallet Address: </p>
                  </div>
                  <p className='font-semibold text-sm'>{account}</p>
               </div>
            </div>
         }
      </div>
   )
}
