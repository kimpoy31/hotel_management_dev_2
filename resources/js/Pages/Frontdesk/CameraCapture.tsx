import { useRef, useState } from "react";

interface Props {
    customerIDPicture: File | null;
    setCustomerIDpicture: (value: File | null) => void;
}

const CameraCapture = ({ customerIDPicture, setCustomerIDpicture }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [displayImageBox, setDisplayImageBox] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            setMediaStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            console.error("Error accessing the camera:", error);
        }
    };

    const closeCamera = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => {
                track.stop(); // ✅ Stop all tracks properly
            });
            setMediaStream(null); // ✅ Clear mediaStream reference
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null; // ✅ Remove reference to the stream
        }

        // ✅ Force garbage collection (helps in some browser cases)
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }, 0);

        setDisplayImageBox(false);
    };

    const captureImage = () => {
        if (displayImageBox && videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);

                canvasRef.current.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "captured-image.png", {
                            type: "image/png",
                        });
                        setCustomerIDpicture(file);
                    }
                }, "image/png");
            }
        }
        closeCamera();
    };

    return (
        <div className="flex flex-col gap-4">
            {!customerIDPicture && (
                <>
                    {displayImageBox && (
                        <video
                            ref={videoRef}
                            className="w-full max-w-sm rounded-lg bg-base-200"
                            autoPlay
                            style={{
                                transform: "scaleX(-1)", // 🔥 Flip horizontally
                                WebkitTransform: "scaleX(-1)", // ✅ Ensure compatibility with older browsers
                            }}
                        />
                    )}
                    <div className="flex gap-1">
                        <button
                            onClick={() => {
                                if (displayImageBox) {
                                    closeCamera(); // 🔥 Close if already open
                                } else {
                                    setDisplayImageBox(true);
                                    openCamera();
                                }
                            }}
                            className={`${
                                displayImageBox ? "btn-error" : "btn-accent"
                            } btn px-4 py-2 rounded-lg shadow-md transition`}
                        >
                            {displayImageBox ? "Cancel" : "Open Camera"}
                        </button>
                        {displayImageBox && (
                            <button
                                onClick={captureImage}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                            >
                                Capture
                            </button>
                        )}
                    </div>
                </>
            )}

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

export default CameraCapture;
