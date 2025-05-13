"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Routers, userRole } from "@/constants";
import { notFound } from "next/navigation";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("children");
  // const { adminProfile, isPending } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   // Kiểm tra nếu không có profile hoặc không phải ADMIN
  //   if (isPending) {
  //   } else if (adminProfile?.profile.role === userRole.student) {
  //     console.log(
  //       "không có profile hoặc không phải ADMIN",
  //       adminProfile?.profile.role
  //     );
  //     notFound();
  //     // router.push(Routers.home);
  //   }
  // }, [adminProfile, router, isPending]);

  // // Không render gì nếu chưa có profile hoặc không phải ADMIN
  // if (!adminProfile || adminProfile.profile.role === userRole.student) {
  //   return null;
  // }

  return <div>{children}</div>;
}
