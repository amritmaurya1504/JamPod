import { useStateWithCallback } from "./useStateWithCallback";
import { IState } from "../types";
import { useCallback, useEffect, useRef } from "react";
import socketInit from "../socket";
import { ACTIONS } from "../actions";
import freeice from "freeice";

interface AudioElements {
  [key: string]: HTMLAudioElement; // Replace 'any' with the actual type of audio element
}

export const useWebRTC = (
  roomId: string | undefined,
  user: IState
): {
  clients: IState[] | ((prev: IState[]) => IState[]);
  provideRef: (instance: any, userId: string) => void;
  handleMute: (isMute: boolean, userId: string) => void;
} => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef<AudioElements>({});
  const connections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const localMediaStream = useRef<any>(null);
  const socket = useRef<any>(null);
  const clientRef = useRef<IState[]>([])

  useEffect(() => {
    console.log("1. Initializing socket...");
    socket.current = socketInit();
  }, []);

  const addNewClient = useCallback(
    (newClient: IState, cb: () => void) => {
      const lookingFor = clients.find((client) => client._id === newClient._id);
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [setClients]
  );

  // Capture media
  useEffect(() => {
    const startCapture = async (): Promise<void> => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };
    startCapture().then(() => {
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user._id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }

        // socket emit JOIN
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });

    return () => {
      // leaving the room
      localMediaStream.current
        .getTracks()
        .forEach((track: any) => track.stop());
      socket.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, []);

  useEffect(() => {
    const handleNewPeer = async ({
      peerId,
      createOffer,
      user: remoteUser,
    }: any) => {
      // if already connected then give warning
      if (peerId in connections.current) {
        /*connections : {
            socketId : connection
          }*/
        return console.log(
          `You are already connected with ${peerId} (${user.name})`
        );
      }

      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      // handle new ice candidate
      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: event.candidate,
        });
      };

      // handle on track on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          if (audioElements.current[remoteUser._id]) {
            audioElements.current[remoteUser._id].srcObject = remoteStream;
          } else {
            let settled = false;

            const interval = setInterval(() => {
              if (audioElements.current[remoteUser._id]) {
                audioElements.current[remoteUser._id].srcObject = remoteStream;
                settled = true;
              }

              if (settled) {
                clearInterval(interval);
              }
            }, 300);
          }
        });
      };

      // add local track to remote connections
      localMediaStream.current.getTracks().forEach((track: any) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });

      // create offer
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();

        await connections.current[peerId].setLocalDescription(offer);
        // send offer to another client
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, []);

  // handle ice candidate
  useEffect(() => {
    socket.current.on(
      ACTIONS.ICE_CANDIDATE,
      ({ peerId, icecandidate }: any) => {
        if (icecandidate) {
          connections.current[peerId].addIceCandidate(icecandidate);
        }
      }
    );

    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  // handle ice sdp
  useEffect(() => {
    const handleRemoteSdp = async ({
      peerId,
      sessionDescription: remoteSessionDesc,
    }: any) => {
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDesc)
      );

      // if session description is type of offer then create an answer
      if (remoteSessionDesc.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();

        connection.setLocalDescription(answer);

        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };

    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  // handle remove peer
  useEffect(() => {
    const handleRemovePeer = async ({ peerId, userId }: any) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }

      delete connections.current[peerId];
      delete audioElements.current[peerId];

      setClients(
        (list) => list.filter((client) => client._id !== userId),
        () => {}
      );
    };

    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);


  useEffect(() => {
    clientRef.current = clients;
  },[clients])


  // Listen for mute/unmute

  useEffect(() => {
    socket.current.on(ACTIONS.MUTE, ({peerId, userId}:any) => {
      setMute(true, userId);
    })

    socket.current.on(ACTIONS.UN_MUTE, ({peerId, userId}:any) => {
      setMute(false, userId);
    })


    const setMute = (mute:boolean, userId:string) => {
      const clientIdx = clientRef.current.map((client) => client._id).indexOf(userId);

      const connectedClients = JSON.parse(
        JSON.stringify(clientRef.current)
      );
      if(clientIdx > -1) {
        connectedClients[clientIdx].muted = mute;
        setClients(connectedClients, () => {})
      }

    }

  }, [])

  const provideRef = (instance: HTMLAudioElement, userId: string): void => {
    audioElements.current[userId] = instance;
  };

  // handling mute
  const handleMute = (isMute: boolean, userId: string): void => {
    console.log("Mute " + isMute);

    let settled = false;
    const interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = !isMute;
        if (isMute) {
          socket.current.emit(ACTIONS.MUTE, {
            roomId,
            userId,
          });
        }else{
          socket.current.emit(ACTIONS.UN_MUTE, {
            roomId, userId
          })
        }

        settled = true;
      }
      
      if(settled) {
        clearInterval(interval);
      }

    }, 300);
  };

  return { clients, provideRef, handleMute };
};
