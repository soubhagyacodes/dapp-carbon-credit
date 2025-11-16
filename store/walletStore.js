import { create } from 'zustand'

export const useWallet = create((set) => ({
   account: null,
   setAccount: (newAccountAddress) => set({ account: newAccountAddress }),

   balance: 0,
   setBalance: (newBalance) => set({ balance: newBalance }),

   platformCredits: 0,
   setPlatformCredits: (credits) => set({ platformCredits: credits }),

   userCredits: 0,
   setUserCredits: (credits) => set({ userCredits: credits }),

   isOwner: false,
   setIsOwner: (status) => set({ isOwner: status }),

   platformBalance: 0,
   setPlatformBalance: (balance) => set({ platformBalance: balance }),

}))

