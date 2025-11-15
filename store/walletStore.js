import { create } from 'zustand'

export const useWallet = create((set) => ({
   account: null,
   setAccount: (newAccountAddress) => set({ account: newAccountAddress }),
}))

