import { useEffect, useRef, useState, useCallback } from "react";
import { FaceDetector as MPFaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

export const WARN_RATIO    = 0.38;
export const CAUTION_RATIO = 0.28;
const FPS = 8;

export function judgeStatus(r) {
  if (r === 0)            return "noface";
  if (r >= WARN_RATIO)    return "danger";
  if (r >= CAUTION_RATIO) return "caution";
  return "ok";
}

export function useEyeGuard() {
  const videoRef    = useRef(null);
  const detectorRef = useRef(null);
  const timerRef    = useRef(null);
  const streamRef   = useRef(null);

  const [status,  setStatus]  = useState("noface");
  const [ratio,   setRatio]   = useState(0);
  const [running, setRunning] = useState(false);

  const detect = useCallback(() => {
    const v = videoRef.current;
    if (!v || !detectorRef.current || v.readyState < 2) return;
    try {
      const { detections } = detectorRef.current.detectForVideo(v, performance.now());
      if (!detections.length) { setRatio(0); setStatus("noface"); return; }
      const big = detections.reduce((a, b) =>
        a.boundingBox.width > b.boundingBox.width ? a : b
      );
      const r = big.boundingBox.width / v.videoWidth;
      setRatio(r);
      setStatus(judgeStatus(r));
    } catch { /* 무시 */ }
  }, []);

  const start = useCallback(async () => {
    setStatus("loading");
    try {
      if (!detectorRef.current) {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        detectorRef.current = await MPFaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
        });
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setRunning(true);
      setStatus("noface");
      timerRef.current = setInterval(detect, 1000 / FPS);
    } catch { setStatus("noface"); }
  }, [detect]);

  const stop = useCallback(() => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setRunning(false); setStatus("noface"); setRatio(0);
  }, []);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  return { videoRef, status, ratio, running, start, stop };
}
