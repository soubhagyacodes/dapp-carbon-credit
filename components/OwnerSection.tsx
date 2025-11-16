'use client'

import { Contract } from "ethers"
import { BrowserProvider } from "ethers"
import { useEffect, useState } from "react"
import ABI from "@/ContractUtils/abi.json";
import { Loader2 } from "lucide-react";
import { AlertDialog } from "radix-ui";

export default function OwnerSection() {

   const [ownerList, setOwnerList] = useState<{ name: string; address: string }[]>([]);
   const [ownersLoading, setOwnersLoading] = useState(false)

   useEffect(() => {
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
                  address: addr,
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

      fetchOwners();
   }, []);

   return (
      <div>
         <p className="font-semibold text-3xl">Owners</p>
         {ownersLoading ? <div className="flex gap-1 font-semibold justify-center my-10">
            <Loader2 className="animate-spin text-emerald-700" /> Owner Data Loading...
         </div>
            :
            <div className="mt-6">
               <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="font-bold text-xl bg-emerald-600 text-white">
                     <td className="py-2 px-2">#</td>
                     <td className="py-2 px-2">Name</td>
                     <td className="py-2 px-2">Address</td>
                     {/* <td className="py-2 px-2">Action</td> */}
                  </thead>

                  {ownerList.map(({ name, address }, index) => {
                     return <tr className="text-lg border-b border-b-gray-300" key={index}>
                        <td className="py-2 px-2 font-bold">{index + 1}</td>
                        <td className="py-2 px-2">{name}</td>
                        <td className="py-2 px-2">{address}</td>
                        {/* <td className="py-2 px-2">Delete</td> */}
                     </tr>
                  })}
               </table>
            </div>
         }
      </div>
   )
}
