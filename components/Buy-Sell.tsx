'use client'

import { useWallet } from "@/store/walletStore"
import { BrowserProvider, formatEther, parseEther } from "ethers"
import { useState } from "react"
import ABI from "@/ContractUtils/abi.json"
import { Contract } from "ethers"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"

export default function BuySellSection() {

   const { platformCredits, balance, userCredits, setBalance, account, setUserCredits, setPlatformCredits } = useWallet()
   const [buyField, setBuyField] = useState<string | number | readonly string[] | undefined>("")
   const [sellField, setSellField] = useState<string | number | readonly string[] | undefined>("")
   const price_per_credit = process.env.NEXT_PUBLIC_PRICE_PER_CREDIT

   const [buyLoading, setBuyLoading] = useState<boolean>(false)
   const [sellLoading, setSellLoading] = useState<boolean>(false)

   const buyCredits = async () => {
      setBuyLoading(true)
      try {
         const provider = new BrowserProvider(window.ethereum)
         const signer = await provider.getSigner()
         const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string, ABI, signer)
         const pricePerCredit = parseEther(price_per_credit?.toString() ?? "");        // to be changed to 1 finney = 0.001 ETH
         const quantity = BigInt(buyField as string | number | bigint | boolean);
         const parsedCost = pricePerCredit * quantity;
         const tx = await contract.buyCarbonCredits(buyField, {
            value: parsedCost,
         });

         await tx.wait()

         const userBalance = await contract.getCreditBalance(account)

         const fetchedBalanceBigInt = await provider.getBalance(account)
         const fetchedPlatformCredits = await contract.getPlatformAvailableCredits()
         setUserCredits(Number(userBalance))
         setBalance(Number(formatEther(fetchedBalanceBigInt)).toFixed(4))
         setPlatformCredits(Number(fetchedPlatformCredits))



         toast.success(`${buyField} Carbon Credits credited to your account`)
      } catch (error) {
         console.log(error)
         toast.error("Something went wrong")
      }
      finally {
         setBuyLoading(false)
      }

   }

   const sellCredits = async () => {
      setSellLoading(true)
      try {
         const provider = new BrowserProvider(window.ethereum)
         const signer = await provider.getSigner()
         const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string, ABI, signer)

         const tx = await contract.sellCarbonCredits(sellField);

         await tx.wait()

         const userBalance = await contract.getCreditBalance(account)

         const fetchedBalanceBigInt = await provider.getBalance(account)
         const fetchedPlatformCredits = await contract.getPlatformAvailableCredits()
         setUserCredits(Number(userBalance))
         setBalance(Number(formatEther(fetchedBalanceBigInt)).toFixed(4))

         setPlatformCredits(Number(fetchedPlatformCredits))

         toast.success(`${Number(sellField) * Number(price_per_credit)} ETH credited to your account`)
      } catch (error) {
         console.log(error)
         toast.error("Something went wrong")
      }
      finally {
         setSellLoading(false)
      }
   }

   return (
      <div id='section-2'>
         <p className='font-bold text-2xl'>Buy/Sell Credits</p>
         <div className='p-7 text-white flex items-center space-x-64 bg-emerald-500 rounded-xl mt-4'>
            <div className='space-y-6'>
               <p className='font-extrabold text-3xl'>Available Platform Credits</p>
               <p className='font-medium'><span className='text-7xl font-extrabold'>{platformCredits}</span> Carbon Credits</p>
            </div>

            <div className='flex-1 space-y-10'>
               <div>
                  <p className='text-xl font-bold'>Buy Credits</p>
                  <div className='flex gap-2 mt-2'>
                     <input type="number" value={buyField} onChange={(e) => setBuyField(e.target.value)} min={0} placeholder='00' className='text-6xl border-b-2 border-b-white/40 font-bold focus:border-b-white duration-300 outline-none w-full text-white' />
                     <button onClick={buyCredits} className='p-3 flex items-center gap-2 disabled:cursor-not-allowed bg-white disabled:bg-gray-300 text-emerald-500 font-extrabold text-xl rounded-xl px-10 cursor-pointer' disabled={((Number(buyField) ?? 0) > platformCredits) || ((Number(buyField) ?? 0) * Number(price_per_credit)) > balance || Number(buyField) <= 0 || buyLoading}>
                        {buyLoading && <Loader2 className="animate-spin" />}Buy
                     </button>
                  </div>
                  {(Number(buyField) > platformCredits) ? <p className="text-red-500 font-extrabold mt-4">{"Expected Credits not available in the platform currently"} </p>
                     :
                     ((Number(buyField) ?? 0) * Number(price_per_credit)) > balance ? <p className="text-red-500 font-extrabold mt-4">{"You don't have enough ETH in your wallet to buy"} </p>
                        :
                        buyField && Number(buyField) <= 0 ? <p className="text-red-500 font-extrabold mt-4">{"Invalid Value"} </p>
                           :
                           <p className='font-bold mt-4'>{buyField ? `${(buyField as number) * Number(price_per_credit)} ETH to be paid` : "Type to see the amount to be paid"}</p>
                  }
               </div>
               <div>
                  <p className='text-xl font-bold'>Sell Credits</p>
                  <div className='flex gap-2 mt-2'>
                     <input type="number" value={sellField} onChange={(e) => setSellField(e.target.value)} min={0} placeholder='00' className='text-6xl font-bold border-b-2 border-b-white/40 focus:border-b-white duration-300 outline-none w-full text-white' />
                     <button onClick={sellCredits} className='p-3 flex gap-2 items-center disabled:cursor-not-allowed disabled:bg-gray-300 bg-white text-emerald-500 font-extrabold text-xl rounded-xl px-10 cursor-pointer' disabled={(Number(sellField) ?? 0) > userCredits || Number(sellField) <= 0 || sellLoading}>
                        {sellLoading && <Loader2 className="animate-spin" />}Sell
                     </button>
                  </div>

                  {(Number(sellField) > userCredits) ? <p className="text-red-500 font-extrabold mt-4">{"You don't have enough carbon credits in your account"} </p>
                     :
                     sellField && Number(sellField) <= 0 ? <p className="text-red-500 font-extrabold mt-4">{"Invalid Value"} </p>

                        :
                        <p className='font-bold mt-4'>{sellField ? `${(sellField as number) * Number(price_per_credit)} ETH to be received` : "Type to see the amount to be received"}</p>
                  }

               </div>
            </div>
         </div>
      </div>
   )
}
