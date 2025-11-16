'use client'

import { Contract } from "ethers"
import { BrowserProvider } from "ethers"
import { useEffect, useState } from "react"
import ABI from "@/ContractUtils/abi.json";
import { Loader2, Trash2 } from "lucide-react";
import { AlertDialog } from "radix-ui";
import { useWallet } from "@/store/walletStore";
import React from "react";
import { toast } from "react-toastify";

export default function OwnerSection() {

   const [ownerList, setOwnerList] = useState<{ name: string; address: string }[]>([]);
   const [ownersLoading, setOwnersLoading] = useState(false)
   const { isDeployer } = useWallet()
   const [deleteLoading, setDeleteLoading] = useState(false)
   const [addLoading, setAddLoading] = useState(false)
   const [dialogOpen, setDialogOpen] = useState(false)

   const [owner, setOwner] = useState({
      name: "",
      address: ""
   })

   async function fetchOwners() {
      try {
         setOwnersLoading(true)
         const provider = new BrowserProvider(window.ethereum);
         const signer = await provider.getSigner();

         const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string, ABI, signer);

         const addresses: string[] = await contract.getOwnerList();

         // 2️⃣ For each address, fetch details
         const owners: { name: string; address: string }[] = [];

         for (const addr of addresses) {
            const details = await contract.getOwnerDetails(addr);
            const name = details[0]; // because struct = [name, isOwner, listIndex]

            owners.push({
               name,
               address: addr.toLowerCase(),
            });
         }

         setOwnerList(owners);
      } catch (err) {
         console.error("Error fetching owners:", err);
      }
      finally {
         setOwnersLoading(false)
      }
   }

   useEffect(() => {

      fetchOwners();
   }, []);

   const handleDelete = async (address: string) => {
      try {
         setDeleteLoading(true)
         const provider = new BrowserProvider(window.ethereum);
         const signer = await provider.getSigner();

         const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string, ABI, signer);

         await contract.removeOwner(address);

         await new Promise(res => setTimeout(res, 2000));
         await fetchOwners()
         toast.success("Owner Removed Successfully")

      } catch (err) {
         console.error("Error deleting owner:", err);
         toast.error("Something Went Wrong")
      }
      finally {
         setDeleteLoading(false)
      }

   }

   const handleAdd = async () => {
      try {
         setAddLoading(true)
         const provider = new BrowserProvider(window.ethereum);
         const signer = await provider.getSigner();

         const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string, ABI, signer);

         await contract.addOwner(owner.address, owner.name);
         await new Promise(res => setTimeout(res, 2000));

         await fetchOwners()

         setDialogOpen(false)
         toast.success("Owner Added Successfully")

      } catch (err) {
         console.error("Error adding owner:", err);
         toast.error("Something Went Wrong")
      }
      finally {
         setAddLoading(false)
      }

   }

   return (
      <div>
         <div className="flex justify-between items-end">
            <p className="font-semibold text-3xl">Owners</p>

            {isDeployer && <button onClick={() => {
               setDialogOpen(true)
            }} className="px-4 py-2 border-2 border-emerald-600 text-lg text-emerald-600 rounded-xl font-extrabold cursor-pointer hover:bg-emerald-600/20 duration-300">
               + Add Owner
            </button>}
         </div>

         {ownersLoading ? <div className="flex gap-1 font-semibold justify-center my-10">
            <Loader2 className="animate-spin text-emerald-700" /> Owner Data Loading...
         </div>
            :
            <div className="mt-6">
               <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="font-bold text-xl bg-emerald-600 text-white">
                     <tr>
                        <td className="py-2 px-4">#</td>
                        <td className="py-2 px-4">Name</td>
                        <td className="py-2 px-4">Address</td>
                        {isDeployer && <td className="py-2 px-2">Action</td>}
                     </tr>
                  </thead>

                  <tbody>
                     {ownerList.map(({ name, address }, index) => {
                        return <tr className="text-lg border-b border-b-gray-300" key={index}>
                           <td className="py-2 px-4 font-bold">{index + 1}</td>
                           <td className="py-2 px-4">{name}</td>
                           <td className="py-2 px-4">{address}</td>
                           {isDeployer && <td className=""><button onClick={() => { handleDelete(address) }} className="flex gap-1 items-center text-red-500 disabled:text-red-700 font-semibold hover:bg-red-500/20 duration-300 cursor-pointer rounded-xl px-4 py-1" disabled={deleteLoading}>{deleteLoading ? <Loader2 className="animate-spin" /> : <Trash2 size={16} />}Delete</button></td>}
                        </tr>
                     })}
                  </tbody>
               </table>
            </div>
         }

         <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialog.Portal>
               <AlertDialog.Overlay className="fixed inset-0 bg-black/60 z-9999" onClick={() => { setDialogOpen(false); }} />
               <AlertDialog.Content className="outline-none fixed left-1/2 top-1/2 md:max-w-[80vw] md:w-[28vw] w-[95vw] md:px-9 px-4 py-5 sm:py-7 -translate-x-1/2 shadow-xl -translate-y-1/2 rounded-2xl bg-white md:py-10 z-9999">
                  <AlertDialog.Title className="text-xl sm:text-4xl text-center mb-4  font-semibold" asChild>
                     <div className='flex justify-center items-center'>
                        <p>Add New Owner</p>
                     </div>
                  </AlertDialog.Title>

                  <AlertDialog.Description className="text-sm mt-8">
                  </AlertDialog.Description>

                  <div className="space-y-4 flex flex-col">
                     <div>
                        <p>Name</p>
                        <input type="text" value={owner.name} onChange={(e) => setOwner((prev) => ({ ...prev, name: e.target.value }))} className="outline-emerald-600 w-full py-3 px-4 border rounded-xl border-gray-300" placeholder="Enter the owner's name" />
                     </div>
                     <div className="w-full">
                        <p>Address</p>
                        <input type="text" value={owner.address} onChange={(e) => setOwner((prev) => ({ ...prev, address: e.target.value }))} className="outline-emerald-600 w-full py-3 px-4 border rounded-xl border-gray-300" placeholder="Enter the address of the owner" />
                     </div>

                     <button className="py-3 bg-emerald-600 font-bold cursor-pointer rounded-xl mt-4 text-white disabled:bg-emerald-700 flex gap-2 justify-center disabled:cursor-not-allowed" onClick={handleAdd} disabled={addLoading || !owner.name || !owner.address}>{addLoading && <Loader2 className="animate-spin" />}Submit</button>
                  </div>

               </AlertDialog.Content>
            </AlertDialog.Portal>
         </AlertDialog.Root>
      </div>
   )
}
