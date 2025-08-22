import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile {
  userName: string;
  userPicture: string;
}
interface UserToken {
  accessToken: string;
  refreshToken: string;
}
interface UserState extends UserProfile, UserToken {
  redirectPath: string;
  setUserProfile: (info: UserProfile) => void;
  setRedirectPath: (path: string) => void;
  clearRedirectPath: () => void;
  setUserTokens: (token: UserToken) => void;
}
export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      userName: "",
      userPicture: "",
      accessToken: "",
      refreshToken: "",
      redirectPath: "/",
      setUserProfile: (info) => set(info),
      setRedirectPath: (path) => set({ redirectPath: path }),
      clearRedirectPath: () => set({ redirectPath: "/" }),
      setUserTokens: (token) => set(token),
    }),
    {
      name: "user-storage",
    }
  )
);
