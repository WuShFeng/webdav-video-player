"use client";
import getCasdoorSDK from "@/lib/casdoor";
import { useUserStore } from "@/store/useUserStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
enum Status {
  loading,
  success,
  error,
}
interface UserInfo {
  name?: string;
  picture?: string;
}
export default function Page() {
  const { redirectPath, clearRedirectPath, setUserTokens, setUserProfile } =
    useUserStore();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>(Status.loading);
  useEffect(() => {
    const code = searchParams.get("code");
    const sdk = getCasdoorSDK();
    sdk
      .exchangeForAccessToken({ code })
      .then(({ access_token, refresh_token }) => {
        if (access_token) {
          setUserTokens({
            accessToken: access_token,
            refreshToken: refresh_token,
          });
          setStatus(Status.success);
          return sdk.getUserInfo(access_token);
        } else {
          setStatus(Status.error);
          throw new Error("No access_token");
        }
      })
      .then((res) => {
        const { name, picture } = res as UserInfo;
        setUserProfile({
          userName: name || "",
          userPicture: picture || "",
        });
        const path = redirectPath || "/";
        clearRedirectPath();
        window.location.href = path;
      })
      .catch((err) => {
        console.error(err);
        setStatus(Status.error);
      });
  }, [
    clearRedirectPath,
    redirectPath,
    searchParams,
    setUserProfile,
    setUserTokens,
  ]);

  return (
    <div className="p-4 text-center">
      {status === Status.loading && "登陆中..."}
      {status === Status.success && "登陆成功"}
      {status === Status.error && "登陆失败"}
    </div>
  );
}
