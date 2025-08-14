import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import WebcamCapture from "./WebcamCapture";
import { useRef } from "react";
import "./ProctorApp.css";

import {
  setAlertMessage,
  setIsTestCompleted,
  incrementMalpractice,
  setVerificationComplete,
} from "../../../redux/slices/proctorSlice";

import { type RootState } from "../../../redux/store";
import MalpracticeTerminated from "./MalpracticeTerminated";

type MyComponentProps = {
  handleFinalSubmit: () => Promise<void>;
};

const ProctorApp: React.FC<MyComponentProps> = ({ handleFinalSubmit }) => {
  const dispatch = useDispatch();
  const handlingViolation = useRef(false);

  const {
    isTestStarted,
    isTestCompleted,
    malpracticeCount,
    verificationComplete,
  } = useSelector((state: RootState) => state.proctor);

  const applicantId = localStorage.getItem("applicantId") || "";

  const handleVerificationComplete = (): void => {
    dispatch(setVerificationComplete(true));
    dispatch(setAlertMessage("✅ Verification complete - Test started!"));
  };

  const handleMalpracticeDetected = (message: string): void => {
    if (handlingViolation.current || malpracticeCount >= 7) return;

    handlingViolation.current = true;

    if (verificationComplete && malpracticeCount < 7) {
      dispatch(incrementMalpractice());
    }

    setTimeout(() => {
      handlingViolation.current = false;

      const updatedCount = malpracticeCount - 1;
      if (updatedCount >= 7) {
        dispatch(
          setAlertMessage("❌ Test terminated due to multiple malpractices.")
        );
        dispatch(setIsTestCompleted(true));
        handleFinalSubmit();
      }
    }, 1000); // Short timeout to prevent rapid repeats
  };

  useEffect(() => {
    if (malpracticeCount === 7) {
      dispatch(setIsTestCompleted(true));
      dispatch(
        setAlertMessage("❌ Test terminated due to multiple malpractices.")
      );
      handleFinalSubmit();
    }
  }, [malpracticeCount]);

  return (
    <div>
      <div className="main-content">
        {isTestStarted && !isTestCompleted && (
          <div className="violation-count">
            Violations: {malpracticeCount}/7
          </div>
        )}
        <WebcamCapture
          onMalpracticeDetected={handleMalpracticeDetected}
          isTestStarted={isTestStarted}
          isTestCompleted={isTestCompleted}
          onVerificationComplete={handleVerificationComplete}
          applicantId={applicantId}
        />
      </div>
    </div>
  );
};

export default ProctorApp;
