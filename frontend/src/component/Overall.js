import React, { useRef, useState, useEffect } from "react";
import Left from "./Left";
import Right from "./Right";
import io from "socket.io-client";
import Peer from "peerjs";
import { BsFillTelephoneFill } from "react-icons/bs";

const Overall = ({ username }) => {
  const socketRef = useRef();
  const peerRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  const [onlineUsers, setOnlineUsers] = useState([]);
  // my peer ID
  const [myPeerId, setMyPeerId] = useState(null);

  //other peer ID
  const [otherPeerId, setOtherPeerId] = useState(null);
  const [otherUsername, setOtherUsername] = useState(null);
  const [onGoingCalling, setOnGoingCalling] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [isVideoMuted, setIsVideoMuted] = useState(false);

  //socket
  // For socket connection
  useEffect(() => {
    socketRef.current = io("http://localhost:3001");
  }, []);

  useEffect(() => {
    socketRef.current?.emit("addUser", username);
    socketRef.current?.on("getUsers", (data) => {
      const filteredUsers = data.filter((user) => user.username !== username);
      setOnlineUsers(filteredUsers);
    });
  }, []);

  //socket io get message from back to the specific client
  useEffect(() => {
    socketRef.current?.on(
      "textMessageFromBack",
      ({ sender, message, senderPeerId, receiver }) => {
        console.log(sender, message, senderPeerId, receiver);
        setOtherPeerId(senderPeerId);
        if (sender === username) {
          setOtherUsername(receiver);
        } else {
          setOtherUsername(sender);
          setOnGoingCalling(true);
        }
      }
    );
  }, []);

  useEffect(() => {
    let peer = new Peer();

    peer.on("open", (id) => {
      console.log("My Peer ID: ", id);
      setMyPeerId(id);
    });

    peer.on("connection", (conn) => {
      conn.on("open", () => {
        console.log("Connected to another peer 1st !");
        setIsConnected(true);
        setOnGoingCalling(false);
      });
    });

    // handle incoming call from other users
    // get an call  and providing the stream
    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.style.transform = "scaleX(-1)";

          call.answer(stream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.style.transform = "scaleX(-1)";
          });
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    });

    peerRef.current = peer;

    return () => {
      peer.disconnect();
      peer.destroy();
    };
  }, []);

  const connectToPeer = () => {
    const conn = peerRef.current.connect(otherPeerId);
    conn.on("open", () => {
      console.log("Connected to another peer seconde!");
      setIsConnected(true);
      setOnGoingCalling(false);
      console.log(conn.peer);
      socketRef.current?.emit("twoConnectedPeer", {
        peer1: myPeerId,
        peer2: conn.peer,
      });
    });

    // for local video
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.style.transform = "scaleX(-1)";

        // call the other user peer or start the call
        const call = peerRef.current.call(otherPeerId, stream);

        // accept the stream of the remote user
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.style.transform = "scaleX(-1)";
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };

  console.log("vido muted:", isVideoMuted);

  return (
    <>
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center justify-center w-[90%] md:flex-row xl:w-[80%] 2xl:w-[75%] gap-x-4 p-0 md:p-5">
          <span className="font-poppins">
            I am <span className="font-bold text-orange">{username}</span>
          </span>
        </div>
      </div>

      <div className="w-full flex items-center justify-center">
        <div className="flex items-center justify-between w-[90%] md:flex-row xl:w-[80%] 2xl:w-[75%] gap-x-4 p-0 md:p-5">
          <div className="flex w-[100%] h-screen gap-x-5">
            {isConnected ? (
              ""
            ) : (
              <>
                <Left
                  onlineUsers={onlineUsers}
                  socketRef={socketRef}
                  username={username}
                  peerRef={peerRef}
                  myPeerId={myPeerId}
                  otherUsername={otherUsername}
                  isConnected={isConnected}
                />
              </>
            )}

            {isConnected ? (
              <>
                <Right
                  username={username}
                  localVideoRef={localVideoRef}
                  remoteVideoRef={remoteVideoRef}
                  otherUsername={otherUsername}
                  socketRef={socketRef}
                  peerRef={peerRef}
                  isConnected={isConnected}
                  setIsVideoMuted={setIsVideoMuted}
                />
              </>
            ) : (
              ""
            )}
          </div>
          {onGoingCalling ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none shadow-2xl">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  {/* //notification  */}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none pb-5 z-50">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                      <span className="font-poppins">
                        <button
                          onClick={connectToPeer}
                          className="flex items-center justify-center gap-x-2"
                        >
                          Accept the call.. from{" "}
                          <span className="font-bold text-orange">
                            {otherUsername}
                          </span>
                          <BsFillTelephoneFill color="green" size={20} />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Overall;
