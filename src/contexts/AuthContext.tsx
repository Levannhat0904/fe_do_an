"use client";

import {
  Routers,
  TFormLoginParams,
  TLoginResponseData,
  TProfileResponseData,
} from "@/constants";
// import { LOGIN } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import React, { createContext, useContext } from "react";
import {
  DEFAULT_PATH,
  KTX_ADMIN_ACCESS_TOKEN,
  KTX_ADMIN_REFRESH_TOKEN,
} from "@/constants";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
// import { executeRequest, setAuthCookies } from "@/utils";
import useFetchProfile from "@/hooks/profile/useFetchProfile";

const AuthContext = createContext<{
  adminProfile: TProfileResponseData | null;
  loginLoading: boolean;
  onLogin: (params: TFormLoginParams) => void;
  onLogout: () => void;
}>({
  adminProfile: null,
  loginLoading: false,
  onLogin: async () => {},
  onLogout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: profile } = useFetchProfile();
  // const [login, { loading: loginLoading }] = useMutation(LOGIN);

  async function onLogin(params: TFormLoginParams) {
    // const response = await executeRequest(() =>
    //   login({
    //     variables: {
    //       email: params.email,
    //       password: params.password,
    //     },
    //   })
    // );
    // if (response) {
    //   const data: TLoginResponseData = response.data[GraphqlKey.login];
    //   setAuthCookies(data);
    //   router.push(Routers.home);
    //   window.location.reload();
    // }
  }

  async function onLogout() {
    deleteCookie(KTX_ADMIN_ACCESS_TOKEN, { path: DEFAULT_PATH });
    deleteCookie(KTX_ADMIN_REFRESH_TOKEN, { path: DEFAULT_PATH });
    window.location.href = Routers.login;
  }
  const loginLoading = false;

  return (
    <AuthContext.Provider
      value={{
        adminProfile: profile,
        loginLoading,
        onLogin,
        onLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
