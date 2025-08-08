import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AudioRecorder, encodeAudioForAPI, playAudioData } from "@/utils/RealtimeAudio";

interface VoiceInterfaceProps {
  onSpeakingChange?: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange = () => {} }) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioElRef.current = document.createElement("audio");
    audioElRef.current.autoplay = true;
  }, []);

  const init = async () => {
    try {
      // Get ephemeral token
      const { data, error } = await supabase.functions.invoke("realtime-session", {
        body: { voice: "alloy" },
      });
      if (error) throw error;
      const EPHEMERAL_KEY = data?.client_secret?.value;
      if (!EPHEMERAL_KEY) throw new Error("Failed to get ephemeral token");

      // Peer connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      pc.ontrack = (e) => {
        if (audioElRef.current) audioElRef.current.srcObject = e.streams[0];
      };

      // Local audio
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      pc.addTrack(ms.getTracks()[0]);

      // Data channel
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.addEventListener("message", async (e) => {
        const event = JSON.parse(e.data);
        // Debug logs
        console.log("OAI Event:", event);

        if (event.type === "response.audio.delta") {
          setIsSpeaking(true);
          onSpeakingChange(true);
          // base64 to bytes
          const bin = atob(event.delta);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          if (!audioContextRef.current) audioContextRef.current = new AudioContext();
          await playAudioData(audioContextRef.current, bytes);
        } else if (event.type === "response.audio.done") {
          setIsSpeaking(false);
          onSpeakingChange(false);
        }
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      });

      const answer = { type: "answer" as RTCSdpType, sdp: await sdpResponse.text() };
      await pc.setRemoteDescription(answer);

      // Start recorder streaming to data channel
      recorderRef.current = new AudioRecorder((chunk) => {
        if (dc.readyState === "open") {
          dc.send(
            JSON.stringify({ type: "input_audio_buffer.append", audio: encodeAudioForAPI(chunk) })
          );
        }
      });
      await recorderRef.current.start();

      setIsConnected(true);
      toast({ title: "Connected", description: "Voice interface is ready" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to start conversation",
        variant: "destructive",
      });
      cleanup();
    }
  };

  const sendText = async (text: string) => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== "open") return;
    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    };
    dc.send(JSON.stringify(event));
    dc.send(JSON.stringify({ type: "response.create" }));
  };

  const cleanup = () => {
    recorderRef.current?.stop();
    dcRef.current?.close();
    pcRef.current?.close();
    audioContextRef.current?.close();
    setIsConnected(false);
    setIsSpeaking(false);
    onSpeakingChange(false);
  };

  useEffect(() => () => cleanup(), []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
      {!isConnected ? (
        <Button onClick={init}>Start Conversation</Button>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => cleanup()}>
            End Conversation
          </Button>
          <Button variant="outline" onClick={() => sendText("Hello! How can you help with Hempstar today?")}>Send Hello</Button>
          <div className="text-sm text-muted-foreground">{isSpeaking ? "AI speaking…" : "Idle"}</div>
        </div>
      )}
    </div>
  );
};

export default VoiceInterface;
