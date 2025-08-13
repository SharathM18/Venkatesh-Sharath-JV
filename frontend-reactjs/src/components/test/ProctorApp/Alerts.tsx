import React, { useEffect, useState } from "react";
import "./Alerts.css"; // ✅ Import external CSS
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";


const Alerts: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const message = useSelector((state: RootState) => state.proctor.alertMessage);
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!isVisible) return null;

  const typeClass = message.startsWith("✅")
    ? "alert-success"
    : message.startsWith("⚠️")
    ? "alert-warning"
    : "alert-error";

  return (
    <div className={`alert-box ${typeClass}`}>
      <p>{message}</p>
    </div>
  );
};

export default Alerts;
