import { useCurrentSession } from "@/api/auth";
const useFetchProfile = () => {
  const { isPending, error, data, refetch } = useCurrentSession();
  return {
    loading: isPending,
    error,
    data: data && data.data,
    refetch,
  };
};

export default useFetchProfile;
