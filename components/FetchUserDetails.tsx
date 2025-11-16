import { Contract } from 'ethers';
import { BrowserProvider } from 'ethers';
import { Loader2 } from 'lucide-react';
import { AlertDialog } from 'radix-ui';
import React, { useState } from 'react'
import ABI from "@/ContractUtils/abi.json";
import { toast } from 'react-toastify';


export default function FetchUserDetails() {
   const [dialogOpen, setDialogOpen] = useState(false)
   const [userDetails, setUserDetails] = useState({
      balance: "",
      totalPurchased: "",
      totalSold: "",
      totalBurned: "",
   })
   const [address, setAddress] = useState("")
   const [loading, setLoading] = useState<boolean>(false)

   const fetchUserDetails = async () => {
      try {
         setLoading(true)
         const provider = new BrowserProvider(window.ethereum)
         const signer = await provider.getSigner()
         const contract = new Contract((process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string), ABI, signer)

         const result = await contract.accounts(address)

         const userObject = {
            balance: result[0].toString(),
            totalPurchased: result[1].toString(),
            totalSold: result[2].toString(),
            totalBurned: result[3].toString()
         } 

         setUserDetails(userObject)

         setDialogOpen(true)

      } catch (error) {
         console.log(error)
         toast.error("Something Went Wrong")
      }
      finally {
         setLoading(false)
      }
   }

   return (
      <>
         <div className='w-full'>
            <p className='font-semibold text-3xl mb-6'>Account Details</p>
            <div className="flex gap-6 items-end">

               <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} min={0} placeholder='Account Address' className='text-3xl w-1/2  border-b-3 border-b-gray-300 text-emerald-600 font-bold focus:border-b-emerald-600 duration-300 outline-none' />

               <button className="py-3 px-15 cursor-pointer disabled:bg-emerald-700 disabled:cursor-not-allowed text-lg text-white rounded-xl font-extrabold bg-emerald-600 flex items-center gap-2" disabled={loading || !address}
                  onClick={fetchUserDetails}
               >{loading && <Loader2 className="animate-spin" />}Fetch Details</button>
            </div>
         </div>

         <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialog.Portal>
               <AlertDialog.Overlay className="fixed inset-0 bg-black/60 z-9999" onClick={() => { setDialogOpen(false); }} />
               <AlertDialog.Content className="outline-none fixed left-1/2 top-1/2 md:max-w-[80vw] md:w-[28vw] w-[95vw] md:px-9 px-4 py-5 sm:py-7 -translate-x-1/2 shadow-xl -translate-y-1/2 rounded-2xl bg-white md:py-10 z-9999">
                  <AlertDialog.Title className="text-xl sm:text-4xl text-left mb-4  font-semibold" asChild>
                     <div className='flex justify-between items-center'>
                        <p>Account Details</p>
                     </div>
                  </AlertDialog.Title>

                  <AlertDialog.Description className="text-sm mt-8">
                  </AlertDialog.Description>


                  <div className='text-xl'>
                     <p className='text-emerald-600 font-extrabold'><span className='font-medium text-black'>Balance:</span> {userDetails.balance} Credits</p>
                     <p className='text-emerald-600 font-extrabold'><span className='font-medium text-black'>Total Purchased:</span> {userDetails.totalPurchased} Credits</p>
                     <p className='text-emerald-600 font-extrabold'><span className='font-medium text-black'>Total Sold:</span> {userDetails.totalSold} Credits</p>
                     <p className='text-emerald-600 font-extrabold'><span className='font-medium text-black'>Total Burnt:</span> {userDetails.totalBurned} Credits</p>
                  </div>

               </AlertDialog.Content>
            </AlertDialog.Portal>
         </AlertDialog.Root>
      </>
   )
}
