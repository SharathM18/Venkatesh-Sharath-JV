import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios, { type AxiosResponse } from "axios";
import "./WebcamCapture.css";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../../redux/store";

import {
  setAlertMessage,
  setCapturedImage,
  setIsTestCompleted,
} from "../../../redux/slices/proctorSlice";
import MalpracticeTerminated from "./MalpracticeTerminated";

interface WebcamCaptureProps {
  onMalpracticeDetected: (message: string) => void;
  isTestStarted: boolean;
  isTestCompleted: boolean;
  onVerificationComplete: () => void;
  applicantId: string;
}

interface VerificationResponse {
  status:
    | "verified"
    | "identity_registered"
    | "face_not_detected"
    | "multiple_faces"
    | "mismatch"
    | "no_reference_face";
  message?: string;
}

interface MalpracticeResponse {
  malpracticeImageUrl: string;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onMalpracticeDetected,
  isTestStarted,
  isTestCompleted,
  onVerificationComplete,
  applicantId,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [canCapture, setCanCapture] = useState<boolean>(false);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [verificationComplete, setVerificationComplete] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [multipleFacesDetected, setMultipleFacesDetected] =
    useState<boolean>(false);
  const [isDetectionPaused, setIsDetectionPaused] = useState<boolean>(false);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [lastAlertTime, setLastAlertTime] = useState<number>(0);
  const [faceDetectionStatus, setFaceDetectionStatus] = useState<
    "idle" | "detecting" | "verified"
  >("idle");
  const [faceVerifiedAlertShown, setFaceVerifiedAlertShown] =
    useState<boolean>(false);
  const [lastDetectionTime, setLastDetectionTime] = useState<number>(0);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [malpracticeCooldown, setMalpracticeCooldown] = useState(false);

  const dispatch = useDispatch();
  const malpracticeCount = useSelector(
    (state: RootState) => state.proctor.malpracticeCount
  );

  const handleUserMedia = (): void => {
    setCameraReady(true);
    dispatch(
      setAlertMessage(
        "✅ Camera ready - Please position your face in the circle"
      )
    );
  };

  const handleUserMediaError = (): void => {
    setCameraReady(false);
    dispatch(setAlertMessage("🚫 Camera access denied or not available"));
  };

  const setRateLimitedAlert = (
    message: string,
    minInterval: number = 2000
  ): void => {
    const now = Date.now();
    if (now - lastAlertTime >= minInterval) {
      dispatch(setAlertMessage(message));
      setLastAlertTime(now);
    }
  };

  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (
      verificationComplete ||
      !webcamRef.current ||
      !applicantId ||
      !cameraReady
    )
      return;

    let animationFrameId: number;
    let lastCheckTime = 0;
    const CHECK_INTERVAL = 500;

    const checkFaceInstant = async (): Promise<void> => {
      const now = Date.now();
      if (now - lastCheckTime < CHECK_INTERVAL) {
        animationFrameId = requestAnimationFrame(checkFaceInstant);
        return;
      }
      lastCheckTime = now;

      try {
        if (!webcamRef.current || !webcamRef.current.video?.readyState) {
          animationFrameId = requestAnimationFrame(checkFaceInstant);
          return;
        }

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
          animationFrameId = requestAnimationFrame(checkFaceInstant);
          return;
        }

        const blob = await (await fetch(imageSrc)).blob();
        const file = new File([blob], "face_check.jpg", { type: blob.type });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("applicant_id", applicantId);

        setFaceDetectionStatus("detecting");
        const res = await axios.post<VerificationResponse>(
          "http://localhost:8000/verify/", // ✅ Use embedding for passive feedback
          formData
        );

        if (res.data.status === "multiple_faces") {
          setMultipleFacesDetected(true);
          setFaceDetected(false);
          setCanCapture(false);
          setRateLimitedAlert(
            "⚠️ Multiple faces detected - only one person allowed"
          );
        } else if (res.data.status === "face_not_detected") {
          setMultipleFacesDetected(false);
          setFaceDetected(false);
          setCanCapture(false);
          setRateLimitedAlert(
            "🚫 Face not detected - please position your face in the circle"
          );
        } else if (
          (res.data.status === "verified" ||
            res.data.status === "identity_registered") &&
          !verificationComplete
        ) {
          setMultipleFacesDetected(false);
          setFaceDetected(true);
          setCanCapture(true);
          setRateLimitedAlert("✅ Face detected - ready for verification");
        }
        setFaceDetectionStatus("idle");
      } catch (error) {
        console.error("Instant face check error:", error);
        setFaceDetectionStatus("idle");
      }

      animationFrameId = requestAnimationFrame(checkFaceInstant);
    };

    checkFaceInstant();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [applicantId, verificationComplete, cameraReady]);

  useEffect(() => {
    if (!isTestStarted || isTestCompleted || !verificationComplete) {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      return;
    }

    const DETECTION_INTERVAL = 3000;

    if (malpracticeCount >= 5) {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      return;
    }

    const performDetection = async (): Promise<void> => {
      if (
        isDetectionPaused ||
        !webcamRef.current ||
        !webcamRef.current.video?.readyState
      )
        return;

      try {
        const now = Date.now();
        if (now - lastDetectionTime < DETECTION_INTERVAL) return;
        setLastDetectionTime(now);

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        const blob = await (await fetch(imageSrc)).blob();
        const file = new File([blob], "live.jpg", { type: blob.type });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("applicant_id", applicantId);

        const res = await axios.post<VerificationResponse>(
          "http://localhost:8000/verify/embedding",
          formData
        );
        const status = res.data.status;

        switch (status) {
          case "verified":
            if (!faceVerifiedAlertShown) {
              setRateLimitedAlert("✅ Face Verified");
              setFaceVerifiedAlertShown(true);
            }
            break;
          case "multiple_faces":
            await handleMalpractice("Multiple faces detected");
            break;
          case "mismatch":
          case "face_not_detected":
            setRateLimitedAlert(
              `⚠️ ${
                status === "mismatch" ? "Face mismatch" : "Face not detected"
              }`
            );
            break;
          case "no_reference_face":
            setRateLimitedAlert("ℹ️ Please register your face first.");
            break;
        }
      } catch (err) {
        console.error("Live detection error:", err);
      }
    };

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    detectionIntervalRef.current = setInterval(
      performDetection,
      DETECTION_INTERVAL
    );

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [
    isTestStarted,
    isTestCompleted,
    verificationComplete,
    applicantId,
    isDetectionPaused,
    lastDetectionTime,
    faceVerifiedAlertShown,
  ]);

  const handleMalpractice = async (message: string): Promise<void> => {
    if (malpracticeCooldown || malpracticeCount >= 50) return; // 🛑 Cooldown active

    setMalpracticeCooldown(true);
    setIsDetectionPaused(true); // Pause further detection
    setFaceVerifiedAlertShown(false);
    setRateLimitedAlert(`⚠️ ${message}`);

    // Let ProctorApp handle Redux count increase
    onMalpracticeDetected(message);

    setTimeout(() => {
      setIsDetectionPaused(false);
      setMalpracticeCooldown(false);
    }, 5000); // Set this cooldown to match your DETECTION_INTERVAL + safety buffer
  };

  const captureAndReportMalpractice = async (
    message: string
  ): Promise<void> => {
    try {
      if (!webcamRef.current) return;

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], "malpractice.jpg", { type: blob.type });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("alertMessage", message);
      formData.append("applicantId", applicantId);

      await axios.post<MalpracticeResponse>(
        "http://localhost:3000/malpractice/alert",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error(
        "Error reporting malpractice:",
        axios.isAxiosError(error)
          ? error.response?.data || error.message
          : error
      );
      setRateLimitedAlert("⚠️ Failed to report malpractice");
      throw error;
    }
  };

  const registerCandidate = async (imageSrc: string): Promise<any> => {
    try {
      if (!imageSrc) throw new Error("No image captured");

      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], "profile.jpg", { type: blob.type });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("applicantId", applicantId);

      const response = await axios.post(
        "http://localhost:3000/malpractice/register-candidate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const verifyIdentity = async (
    imageSrc: string
  ): Promise<AxiosResponse<VerificationResponse>> => {
    try {
      if (!imageSrc) throw new Error("No image captured");

      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], "verify.jpg", { type: blob.type });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("applicant_id", applicantId);

      return await axios.post<VerificationResponse>(
        "http://localhost:8000/verify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Verification error:", error);
      throw error;
    }
  };

  const capture = async (): Promise<void> => {
    if (!canCapture || !applicantId || !webcamRef.current) {
      setRateLimitedAlert(
        "🚫 Cannot capture – No valid face detected or missing user ID"
      );
      return;
    }

    setIsLoading(true);
    setRateLimitedAlert("⏳ Verifying your identity...");

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("Failed to capture image");

      await registerCandidate(imageSrc);
      const verifyResponse = await verifyIdentity(imageSrc);
      const status = verifyResponse.data.status;

      let message = "";
      switch (status) {
        case "face_not_detected":
          message = "🚫 Face not detected – please look at the camera.";
          break;
        case "multiple_faces":
          message = "⚠️ Multiple faces detected – only one person allowed.";
          break;
        case "mismatch":
          message = "❌ Face mismatch – identity verification failed.";
          break;
        case "identity_registered":
        case "verified":
          message = "✅ Identity verified successfully.";
          setVerificationComplete(true);
          dispatch(setCapturedImage(imageSrc));
          onVerificationComplete();
          setFaceVerifiedAlertShown(false);
          break;
        default:
          message = "❗ Unknown verification response.";
      }

      setRateLimitedAlert(message);
    } catch (error) {
      console.error("Error during verification:", error);
      setRateLimitedAlert(
        `❌ Error: ${
          axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : error
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getBorderColor = (): string => {
    if (!cameraReady) return "#9E9E9E";
    if (multipleFacesDetected) return "#FF5722";
    if (faceDetected) return "#4CAF50";
    return "#F44336";
  };

  const getButtonText = (): string => {
    if (isLoading) return "Processing...";
    if (!cameraReady) return "Camera Not Available";
    if (faceDetected) return "Capture & Verify Identity";
    return "Face Not Detected";
  };

  return (
    <div className="webcam-container">
      <div
        className={`webcam-wrapper ${cameraReady ? "ready" : ""}`}
        style={{
          borderColor: getBorderColor(),
          boxShadow: `0 0 20px ${getBorderColor()}80`,
        }}
      >
        {!cameraReady && (
          <div className="loading-overlay">Loading camera...</div>
        )}
        <Webcam
          ref={webcamRef}
          className={`webcam ${cameraReady ? "show" : "hide"}`}
          screenshotFormat="image/jpeg"
          width={300}
          height={300}
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user",
          }}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
        />
      </div>

      {!verificationComplete && (
        <button
          className={`capture-button ${
            canCapture && !isLoading ? "active" : "disabled"
          }`}
          style={{
            opacity: isLoading ? 0.7 : 1,
            transform: canCapture && !isLoading ? "scale(1)" : "scale(0.98)",
          }}
          onClick={capture}
          disabled={!canCapture || isLoading || !cameraReady}
        >
          {getButtonText()}
        </button>
      )}
    </div>
  );
};

export default WebcamCapture;
