import { useWallet } from "@/store/walletStore"
import { Contract } from "ethers"
import { BrowserProvider } from "ethers"
import { ArrowBigRight, ArrowBigRightDash, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import ABI from "@/ContractUtils/abi.json";
import { toast } from "react-toastify"


export default function MintCredits() {

   const [mintValue, setMintValue] = useState<string | number | readonly string[] | undefined>("")
   const [toAddress, setToAddress] = useState<string>("")
   const [mintLoading, setMintLoading] = useState<boolean>(false)

   const { platformBalance } = useWallet()
   const price_per_credit = process.env.NEXT_PUBLIC_PRICE_PER_CREDIT


   const handleMint = async () => {
      try {
         setMintLoading(true)
         const provider = new BrowserProvider(window.ethereum)
         const signer = await provider.getSigner()
         const contract = new Contract((process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string), ABI, signer)

         await contract.mint(toAddress, mintValue)

         toast.success(`${mintValue} Carbon Credits Minted Successfully`)
      } catch (error) {
         console.log(error)
         toast.error(`Something went wrong.`)
      }
      finally {
         setMintLoading(false)
      }
   }

   return (
      <div>
         <p className="text-3xl font-semibold">Mint Credits</p>
         <div className="mt-4 flex items-end">
            <div className="flex gap-32 items-center">
               <div className="flex gap-2 items-end">
                  <input type="number" value={mintValue} onChange={(e) => setMintValue(e.target.value)} min={0} placeholder='00' className='text-7xl border-b-3 w-72 border-b-gray-300 text-emerald-600 font-bold focus:border-b-emerald-600 duration-300 outline-none' />
                  <p className="font-bold text-emerald-600 text-xl"><Image src={"/greencolor-leaf.png"} className='mb-1' width={15} alt='leaf' height={40} />Carbon Credits</p>
               </div>
               <ArrowBigRight size={80} className="text-gray-200 fill-gray-200" />
               <div className="flex gap-6">
                  <div>
                     <p className="text-lg font-bold">To: </p>
                     <input type="text" value={toAddress} onChange={(e) => setToAddress(e.target.value)} min={0} placeholder='User Address' className='text-3xl border-b-3 border-b-gray-300 text-emerald-600 font-bold focus:border-b-emerald-600 duration-300 outline-none' />
                  </div>

                  <button className="py-3 px-15 cursor-pointer disabled:bg-emerald-700 disabled:cursor-not-allowed text-lg text-white rounded-xl font-extrabold bg-emerald-600 flex items-center gap-2" disabled={mintLoading || !toAddress}
                     onClick={handleMint}
                  >{mintLoading && <Loader2 className="animate-spin" />}Mint</button>
               </div>
            </div>
         </div>
      </div>
   )
}
