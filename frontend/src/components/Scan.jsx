import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera } from "@mediapipe/camera_utils";
import { POSE_CONNECTIONS, Pose } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import "../GetStarted.css";

function Scan() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const { exerciseType, model } = location.state || {};
    const [poseFeedback, setPoseFeedback] = useState("Pose not detected.");
    const [isPoseDetected, setIsPoseDetected] = useState(false);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [webcamActive, setWebcamActive] = useState(false);

    // Symmetry map for pose landmarks
    const symmetryMap = {
        11: 12, 12: 11,  // Shoulders
        13: 14, 14: 13,  // Elbows
        15: 16, 16: 15,  // Wrists
        17: 18, 18: 17,  // Pinkies
        19: 20, 20: 19,  // Index Fingers
        21: 22, 22: 21,  // Thumbs
        23: 24, 24: 23,  // Hips
        25: 26, 26: 25,  // Knees
        27: 28, 28: 27,  // Ankles
        29: 30, 30: 29,  // Heels
        31: 32, 32: 31   // Foot Indexes
    };

    const orderedLandmarkIndices = [
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32
    ];

    const approximateWithSymmetry = (index, landmarks) => {
        const symmetricIndex = symmetryMap[index];
        if (symmetricIndex !== undefined && landmarks[symmetricIndex]) {
            return landmarks[symmetricIndex]; // Mirror the symmetric landmark
        }
        return { x: 0.5, y: 0.5, z: 0.0, visibility: 0.0 }; // Neutral default
    };

    const handleBackClick = () => {
        if (webcamRef.current?.video) {
            const stream = webcamRef.current.video.srcObject;
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        }
        navigate("/get-started");
    };

    let isRequestInProgress = false;

    const onResults = async (results) => {
        if (!webcamRef.current?.video || !canvasRef.current) return;

        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");

        canvasElement.width = videoWidth;
        canvasElement.height = videoHeight;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, videoWidth, videoHeight);

        setIsPoseDetected(true);

        if (results.poseLandmarks) {
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 4 });
            drawLandmarks(canvasCtx, results.poseLandmarks, { color: "#FF0000", lineWidth: 2 });

            const orderedLandmarks = orderedLandmarkIndices.map((index) => {
                const landmark = results.poseLandmarks[index];
                if (landmark) {
                    return [landmark.x, landmark.y, landmark.z, landmark.visibility];
                } else {
                    const symmetricLandmark = approximateWithSymmetry(index, results.poseLandmarks);
                    return [symmetricLandmark.x, symmetricLandmark.y, symmetricLandmark.z, symmetricLandmark.visibility];
                }
            });

            const flattenedKeypoints = orderedLandmarks.flat();

            // Ensure the length is exactly 88
            while (flattenedKeypoints.length < 88) {
                flattenedKeypoints.push(0.0);
            }

            if (!isRequestInProgress) {
                isRequestInProgress = true;

                console.log("Sending Keypoints:", flattenedKeypoints);
                await sendFeedbackRequest(flattenedKeypoints);

                setTimeout(() => {
                    isRequestInProgress = false;
                }, 1000);
            }
        } else {
            console.log("No keypoints detected.");
        }

        canvasCtx.restore();
    };

    const sendFeedbackRequest = async (keypoints) => {
        try {
            const formData = new URLSearchParams();
            formData.append("model", model);
            formData.append("keypoints", JSON.stringify(keypoints));

            const endpoint = `http://127.0.0.1:5000/exercise/${exerciseType}`;
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString(),
            });

            const data = await response.json();
            setPoseFeedback(data.feedback ? `Feedback: ${data.feedback}` : "Error: No feedback received.");
        } catch (error) {
            console.error("Error sending feedback:", error);
        }
    };

    const getCameraDevices = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
            setSelectedDeviceId(videoDevices[0].deviceId);
        }
    };

    useEffect(() => {
        const pose = new Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });
        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });
        pose.onResults(onResults);

        const startCamera = () => {
            if (webcamRef.current && webcamRef.current.video) {
                const camera = new Camera(webcamRef.current.video, {
                    onFrame: async () => {
                        await pose.send({ image: webcamRef.current.video });
                    },
                    width: 1280,
                    height: 720,
                });
                camera.start();
                setWebcamActive(true);
            }
        };

        if (selectedDeviceId) {
            startCamera();
        }
    }, [selectedDeviceId]);

    useEffect(() => {
        getCameraDevices();
    }, []);

    return (
        <div className="scan-container">
            <div className="close-arrow" onClick={handleBackClick}>
                <IoMdClose size={30} color="black" />
            </div>
            <div className="scan-content">
                <h1>Stand Sideways for Better Scan</h1>
                {poseFeedback && (
                    <p className={`feedback ${poseFeedback.includes("Good") ? "correct" : "incorrect"}`}>
                        {poseFeedback}
                    </p>
                )}
                <div className="camera-selection">
                    <label htmlFor="camera">Select Camera:</label>
                    <select
                        id="camera"
                        value={selectedDeviceId}
                        onChange={(e) => setSelectedDeviceId(e.target.value)}
                    >
                        {devices.map((device) => (
                            <option key={device.deviceId} value={device.deviceId}>
                                {device.label || `Camera ${device.deviceId}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="camera-container">
                    <Webcam
                        ref={webcamRef}
                        videoConstraints={{ deviceId: selectedDeviceId, width: 1280, height: 720 }}
                        className="react-webcam"
                    />
                    <canvas ref={canvasRef} className="overlay-canvas" />
                </div>
                <p className="camera-tip">Tip: Ensure your surroundings are well lit and your body is fully visible.</p>
                {isPoseDetected && <p>Pose Detected!</p>}
            </div>
        </div>
    );
}

export default Scan;
