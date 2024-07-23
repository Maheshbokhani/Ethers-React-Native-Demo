import {Signer, Wallet} from 'ethers';
import {create, StoreApi, UseBoundStore} from 'zustand';

interface Props {
  ethereumPrice: number;
  txHistory: [] | any[];
  signer: Signer | null;
  wallet: Wallet | null;
  tokenBalance: number;
  setEthereumPrice: (price: number) => void;
  setTxHistory: (value: any[] | any) => void;
  setSigner: (signer: Signer | null) => void;
  setWallet: (wallet: Wallet | null) => void;
  setTokenBalance: (balance: number) => void;
  reset: () => void;
}

const useStore: UseBoundStore<StoreApi<Props>> = create(set => ({
  ethereumPrice: 0,
  txHistory: [],
  signer: null,
  wallet: null,
  tokenBalance: 0,
  setEthereumPrice: (price: number) => set(() => ({ethereumPrice: price})),
  setTxHistory: (value: any[]) => set(() => ({txHistory: value})),
  setSigner: (signer: any) => set(() => ({signer})),
  setWallet: (wallet: any) => set(() => ({wallet})),
  setTokenBalance: (balance: number) => set(() => ({tokenBalance: balance})),
  reset: () =>
    set({
      txHistory: [],
      signer: null,
      wallet: null,
    }),
}));

export default useStore;
