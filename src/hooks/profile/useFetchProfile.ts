import { KTX_ADMIN_ACCESS_TOKEN } from "@/constants";
import { useQuery } from "@apollo/client";
import { getCookie } from "cookies-next";

const useFetchProfile = () => {
  const accessToken = getCookie(KTX_ADMIN_ACCESS_TOKEN);
  // const { loading, error, data, refetch } = useQuery(ADMIN_SESSION_CURRENT, {
  //   skip: !accessToken,
  // });

  // return {
  //   loading,
  //   error,
  //   data: data && data[GraphqlKey.current],
  //   refetch,
  // };
  return {
    loading: false,
    error: null,
    data: null,
    refetch: () => { },
  };
};

export default useFetchProfile;
