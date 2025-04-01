import React from "react";
import { Button } from "antd";
import { useAuth } from "@/contexts/AuthContext";

export default function UserActionMenu() {
  const { onLogout } = useAuth();

  return (
    <div className="w-40">
      <Button onClick={onLogout} type="link">
        Logout
      </Button>
    </div>
  );
}
