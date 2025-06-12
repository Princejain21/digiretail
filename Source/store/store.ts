import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension'
interface BearState {
  islogin: boolean
  updateIsLogin: (by: boolean) => void
}
export interface userState{
    user:{
        name:string,
        email:string,
        id:any,
        photoUrl:string;
    }|null;
    updateUser:(by:any)=>void
}

export const useLoginStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        islogin: false,
        updateIsLogin: (by) => set((state) => ({ islogin: by })),
      }),
      {
        name: 'bear-storage',
      },
    ),
  ),
)
export const useUserDetails = create<userState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        updateUser: (by) => set((state) => ({ user: by })),
      }),
      {
        name: 'user-storage',
      },
    ),
  ),
)