import React, { useEffect, useState } from "react";
import { AiOutlineAudioMuted } from "react-icons/ai";
import { BsFillCameraVideoOffFill, BsEmojiSmile } from "react-icons/bs";
import { ImPhoneHangUp } from "react-icons/im";
import { IoSend } from "react-icons/io5";

const Right = ({
  username,
  localVideoRef,
  remoteVideoRef,
  otherUsername,
  peerRef,
  socketRef,
  setIsVideoMuted,
}) => {
  const [userMessageText, setUserMessageText] = useState("");
  const [messageCombo, setMessageCombo] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  // hangupFunction
  const hangupFunction = (e) => {
    e.preventDefault();
    // Stop the local stream
    const localStream = localVideoRef.current.srcObject;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    // Clear the local video source
    localVideoRef.current.srcObject = null;

    // Close the PeerJS connection and notify the remote peer
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;

      // Clear the remote video source
      remoteVideoRef.current.srcObject = null;
    }

    window.location.reload();
  };

  //video mute function
  const videoMuteFunction = (e) => {
    e.preventDefault();
    console.log("hello")
    setIsVideoMuted(true);
  };

  const messageSubmitHandler = (e) => {
    e.preventDefault();
    //for socket io
    const messageData = {
      sender: username,
      receiver: otherUsername,
      message: userMessageText,
    };
    socketRef.current.emit("message", messageData);

    setMessageCombo((messageCombo) => [
      ...messageCombo,
      {
        sender: username,
        msg: userMessageText,
      },
    ]);

    setUserMessageText("");
  };

  //socket io get message from back to the specific client
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("messageFromBack", ({ sender, message }) => {
        console.log(sender, message);
        setArrivalMessage({
          sender: sender,
          msg: message,
        });
      });
    }
  }, [socketRef.current]);

  // //socket io to get the message and update it after getting from the server
  useEffect(() => {
    if (
      arrivalMessage &&
      otherUsername &&
      otherUsername === arrivalMessage.sender
    ) {
      setMessageCombo((messageCombo) => [...messageCombo, arrivalMessage]);
    }
  }, [arrivalMessage, otherUsername]);

  return (
    <div className="w-[100%] flex justify-center">
      <div className="w-[70%]">
        <div className="flex flex-col gap-y-10 items-center justify-center">
          <div className="flex items-center justify-center gap-x-4 mt-4">
            <div className="w-[50%] flex flex-col items-center justify-center">
              <video ref={localVideoRef} autoPlay playsInline></video>
              <span className="font-poppins mt-3">
                {username && <>{username}</>} "Your camera" 
              </span>
            </div>
            <div className="w-[50%] items-center justify-center flex flex-col">
              <video ref={remoteVideoRef} autoPlay playsInline></video>
              <span className="font-poppins mt-3">{otherUsername} camera</span>
            </div>
          </div>
          <div className="flex gap-x-6">
            <AiOutlineAudioMuted size={30} onClick={videoMuteFunction} />
            <BsFillCameraVideoOffFill size={30} />
            <ImPhoneHangUp
              size={30}
              color="red"
              className="cursor-pointer"
              onClick={hangupFunction}
            />
          </div>
          {/* chat start */}
          <div>
            {/* message body end  */}
            {/* chat input start  */}
            <div>
              <div class="flex items-center">
                <div class="relative w-full">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <BsEmojiSmile />
                  </div>
                  <input
                    type="text"
                    id="message"
                    className="border border-gray-300 w-[100%] text-gray-900 text-sm rounded-lg focus:outline-none  block md:w-96 pl-10 p-2.5"
                    placeholder="Message..."
                    autoComplete="off"
                    required
                    onChange={(e) => setUserMessageText(e.target.value)}
                    value={userMessageText}
                  />
                </div>
                <button
                  type="submit"
                  className="p-2.5 ml-2 text-sm font-medium text-orange bg-green rounded-lg focus:ring-0"
                  onClick={messageSubmitHandler}
                >
                  <IoSend size={25} />
                </button>
              </div>
            </div>
            {/* chat input end  */}
            <div className="">
              {/* message body start  */}
              <div className="w-[100%] h-[70%] bg-[#f9fafb] p-5 overflow-y-scroll">
                {messageCombo.map((val) => (
                  <>
                    {username === val.sender ? (
                      <>
                        <div className="w-[50%] mt-4">
                          <div className="bg-gray-700  rounded-2xl p-4">
                            <span className="text-white font-medium text-sm">
                              {val.msg}
                            </span>
                            <div className="mt-2">
                              <span className="text-white text-xs"></span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div class="flex flex-col items-end justify-end w-full mt-2">
                          <div class="bg-gray-300 rounded-lg w-[50%] p-4 break-words">
                            <span class="font-medium text-black text-sm">
                              {val?.msg}
                            </span>
                            <div class="mt-2">
                              <span class="text-xs text-black"></span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ))}
              </div>

              {/* message body end  */}
            </div>
          </div>
          {/* chat end  */}
        </div>
      </div>
    </div>
  );
};

export default Right;
