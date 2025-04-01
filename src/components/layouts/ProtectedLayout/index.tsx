"use client";
import useFetchProfile from "@/hooks/profile/useFetchProfile";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const { data, loading } = useFetchProfile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (loading) {
    return <></>;
  }
  if (!data) {
    notFound();
  }

  return <>{children}</>;
};

export default ProtectedLayout;
