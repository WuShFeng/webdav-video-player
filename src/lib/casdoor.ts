"use client";
import Sdk from "casdoor-js-sdk";
let instance: Sdk | null = null;
const getCasdoorSDK = (): Sdk => {
  if (instance) return instance;
  return (instance = new Sdk({
    serverUrl: process.env.NEXT_PUBLIC_casdoorUrl || "",
    clientId: process.env.NEXT_PUBLIC_casdoorClientId || "",
    appName: process.env.NEXT_PUBLIC_casdoorAppName || "",
    organizationName: process.env.NEXT_PUBLIC_casdoorOrganizationName || "",
    redirectPath: process.env.NEXT_PUBLIC_casdoorRedirectPath || "",
  }));
};

export default getCasdoorSDK;
