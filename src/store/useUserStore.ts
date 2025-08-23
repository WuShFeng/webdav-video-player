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
  isLoggedIn: boolean;
  redirectPath: string;
  setUserProfile: (info: UserProfile) => void;
  setRedirectPath: (path: string) => void;
  clearRedirectPath: () => void;
  setUserTokens: (token: UserToken) => void;
  login: () => void;
  logout: () => void;
}
export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      isLoggedIn: false,
      userName: "",
      userPicture: "",
      accessToken: "",
      refreshToken: "",
      redirectPath: "/",
      login: () => set({ isLoggedIn: true }),
      logout: () => {
        set({ isLoggedIn: false, accessToken: "", refreshToken: "" });
      },
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
