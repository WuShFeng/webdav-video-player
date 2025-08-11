import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WebdavState {
  webdavUrl: string;
  username: string;
  password: string;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  setCredentials: (url: string, user: string, pass: string) => void;
  logout: () => void;
}

export const useWebdavStore = create<WebdavState>()(
  persist(
    (set) => ({
      webdavUrl: "",
      username: "",
      password: "",
      isLoggedIn: false,
      isLoginModalOpen: false,

      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),

      setCredentials: (url, user, pass) =>
        set({
          webdavUrl: url,
          username: user,
          password: pass,
          isLoggedIn: true,
          isLoginModalOpen: false,
        }),

      logout: () =>
        set({
          webdavUrl: "",
          username: "",
          password: "",
          isLoggedIn: false,
        }),
    }),
    {
      name: "webdav-store",
    }
  )
);
