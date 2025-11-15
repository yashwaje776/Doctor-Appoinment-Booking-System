"use client";

import { useEffect, useRef, useState,use } from "react";
import Peer from "peerjs";

// Avatar Placeholder Component
function AvatarPlaceholder({ name }) {
  const firstLetter = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="w-full aspect-video flex items-center justify-center bg-gray-800 text-white text-6xl font-bold rounded-xl border">
      {firstLetter}
    </div>
  );
}

export default function VideoPage({ params }) {
  // IMPORTANT: FIXED — do NOT use "use(params)"
  const { roomId } =use(params);

  const [peerId, setPeerId] = useState("");

  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  const peerInstance = useRef(null);
  const localStreamRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [remoteCameraOff, setRemoteCameraOff] = useState(true);

  // Initialize PeerJS
  useEffect(() => {
    const peer = new Peer();
    peerInstance.current = peer;

    peer.on("open", (id) => {
      console.log("My peer ID:", id);
      setPeerId(id);
    });

    // When someone calls YOU
    peer.on("call", async (call) => {
      console.log("Incoming call from:", call.peer);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      localVideo.current.srcObject = stream;

      call.answer(stream); // send your video

      call.on("stream", (remoteStream) => {
        console.log("Remote stream received");
        remoteVideo.current.srcObject = remoteStream;

        const videoTrack = remoteStream.getVideoTracks()[0];
        setRemoteCameraOff(!videoTrack?.enabled);
      });
    });
  }, []);

  // When YOU start the call
  const startCall = async () => {
    if (!roomId) {
      alert("Room ID is missing");
      return;
    }

    console.log("Calling peer:", roomId);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    localVideo.current.srcObject = stream;

    const call = peerInstance.current.call(roomId, stream);

    call.on("stream", (remoteStream) => {
      console.log("Remote stream received");
      remoteVideo.current.srcObject = remoteStream;

      const videoTrack = remoteStream.getVideoTracks()[0];
      setRemoteCameraOff(!videoTrack?.enabled);
    });
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return;

    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;

    setIsMuted(!audioTrack.enabled);
  };

  const toggleCamera = () => {
    if (!localStreamRef.current) return;

    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;

    setIsCameraOff(!videoTrack.enabled);
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }

    localVideo.current.srcObject = null;
    remoteVideo.current.srcObject = null;
  };

  return (
    <div className="min-h-screen bg-muted/20 flex justify-center items-center p-6">
      <div className="w-full max-w-6xl rounded-2xl p-8 border border-border bg-background/40 backdrop-blur-xl shadow-xl">

        <h1 className="text-3xl font-bold text-center text-foreground">
          Consultation Meeting
        </h1>

        <p className="text-center text-muted-foreground mt-1">
          Room ID: <span className="font-semibold">{roomId}</span>
        </p>

        <p className="text-center text-xs text-muted-foreground">
          Your Peer ID: <strong>{peerId}</strong>
        </p>

        <div className="flex justify-center mt-5">
          <button
            onClick={startCall}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            Join Call
          </button>
        </div>

        {/* VIDEO AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

          {/* Local Video */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              You
            </h3>

            {isCameraOff ? (
              <AvatarPlaceholder name="You" />
            ) : (
              <video
                ref={localVideo}
                autoPlay
                muted
                playsInline
                className="w-full rounded-xl border border-border shadow bg-black"
              />
            )}
          </div>

          {/* Remote Video */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Doctor / Patient
            </h3>

            {remoteCameraOff ? (
              <AvatarPlaceholder name="Guest" />
            ) : (
              <video
                ref={remoteVideo}
                autoPlay
                playsInline
                className="w-full rounded-xl border border-border shadow bg-black"
              />
            )}
          </div>

        </div>

        {/* CONTROL BAR */}
        <div className="flex justify-center gap-4 mt-10">

          <button
            onClick={toggleMute}
            className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-foreground shadow-sm"
          >
            {isMuted ? "Unmute 🔊" : "Mute 🔇"}
          </button>

          <button
            onClick={toggleCamera}
            className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-foreground shadow-sm"
          >
            {isCameraOff ? "Camera On 📷" : "Camera Off 🚫"}
          </button>

          <button
            onClick={endCall}
            className="px-4 py-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
          >
            End Call ❌
          </button>

        </div>
      </div>
    </div>
  );
}
