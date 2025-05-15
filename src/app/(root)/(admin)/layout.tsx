"use client";
import KLoading from "@/components/atoms/KLoading";
import { RoutersStudent, UserType } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("children");
  const { adminProfile, isPending } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isPending && adminProfile?.profile.role !== UserType.admin) {
  //     router.push(RoutersStudent.home);
  //   }
  // }, [adminProfile, router, isPending]);

  // if (isPending) {
  //   return <KLoading />;
  // }

  // if (!adminProfile) {
  //   return <div>Not found</div>;
  // }

  // return <>{adminProfile?.profile.role === UserType.admin ? children : null}</>;
  return <>{children}</>;
}
