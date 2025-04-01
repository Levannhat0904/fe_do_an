import React from "react";
import styles from "./styles.module.scss";

export default function KLoading() {
  return (
    <div className="flex justify-center">
      <div className={styles.loading} />
    </div>
  );
}
