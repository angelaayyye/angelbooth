import { useEffect, useRef, useState } from 'react';

interface UseDuoVideoOptions {
  enabled: boolean;
  isHost: boolean;
  playerId: string | null;
  localStream: MediaStream | null;
  sendSignal: (signal: unknown) => void;
  subscribeSignal: (
    fn: (from: string, signal: unknown) => void,
  ) => () => void;
}

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export function useDuoVideo({
  enabled,
  isHost,
  playerId,
  localStream,
  sendSignal,
  subscribeSignal,
}: UseDuoVideoOptions) {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [partnerConnected, setPartnerConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !playerId || !localStream) {
      setPartnerConnected(false);
      return;
    }

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (remoteVideoRef.current && stream) {
        remoteVideoRef.current.srcObject = stream;
        void remoteVideoRef.current.play();
      }
      setPartnerConnected(true);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({ candidate: event.candidate.toJSON() });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setPartnerConnected(true);
      } else if (
        pc.connectionState === 'failed' ||
        pc.connectionState === 'disconnected' ||
        pc.connectionState === 'closed'
      ) {
        setPartnerConnected(false);
      }
    };

    const handleSignal = async (from: string, signal: unknown) => {
      if (from === playerId) return;

      const payload = signal as {
        sdp?: RTCSessionDescriptionInit;
        candidate?: RTCIceCandidateInit;
      };

      try {
        if (payload.sdp) {
          await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
          if (payload.sdp.type === 'offer') {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendSignal({ sdp: answer });
          }
        } else if (payload.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
        }
      } catch {
        // Ignore out-of-order ICE / duplicate offers during setup
      }
    };

    const unsubscribe = subscribeSignal(handleSignal);

    let offerTimer: ReturnType<typeof setTimeout> | undefined;
    if (isHost) {
      offerTimer = setTimeout(async () => {
        if (pc.signalingState !== 'stable') return;
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendSignal({ sdp: offer });
        } catch {
          // Retry on next mount if partner wasn't ready
        }
      }, 1000);
    }

    return () => {
      if (offerTimer) clearTimeout(offerTimer);
      unsubscribe();
      pc.close();
      pcRef.current = null;
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      setPartnerConnected(false);
    };
  }, [
    enabled,
    isHost,
    playerId,
    localStream,
    sendSignal,
    subscribeSignal,
  ]);

  return { remoteVideoRef, partnerConnected };
}
