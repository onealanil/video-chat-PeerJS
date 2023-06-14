import React, { useEffect, useState } from "react";
import { BiPhoneCall } from "react-icons/bi";

const Left = ({
  onlineUsers,
  username,
  socketRef,
  myPeerId,
  otherUsername,
  isConnected,
}) => {
  const [sendCall, setSendCall] = useState(false);
  const img = "./logo.png";

  useEffect(() => {
    if (isConnected) {
      setSendCall(false);
    }
  }, [isConnected]);

  const callHandler = (otherUsername) => {
    //for socket io
    const messageData = {
      sender: username,
      receiver: otherUsername,
      message: "someone is calling",
      senderPeerId: myPeerId,
    };
    socketRef.current.emit("textMessage", messageData);
    setSendCall(true);
  };

  return (
    <div className="w-[30%] h-full overflow-y-scroll">
      <div className="w-full flex items-center justify-center mb-3">
        <h2 className="text-orange font-bold leading-relaxed">Online Users</h2>
      </div>
      {onlineUsers.map((val, index) => (
        <>
          {/* one person  */}
          <div
            className="flex flex-row gap-x-2 w-full p-3 space-x-2 items-start justify-end select-none"
            key={index}
          >
            <div className="w-[20%]">
              <img
                src={img}
                alt="suggestion"
                className="w-[3rem] h-[3rem] rounded-full"
              />
            </div>
            <div className="w-[80%] flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm font-poppins font-semibold  max-[1067px]:text-xs">
                  {val.username}
                </span>
                <div
                  className="flex items-center justify-center gap-x-3 bg-orange text-white px-3 py-2 rounded-md cursor-pointer"
                  onClick={() => callHandler(val.username)}
                >
                  <BiPhoneCall size={20} />
                  <span>Call</span>
                </div>
              </div>
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>
          {/* one person end  */}
          {sendCall ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none shadow-2xl">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  {/* //notification  */}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none pb-5 z-50">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                      <span className="font-poppins">
                        Ongoing call...... to{" "}
                        <span className="text-orange font-bold">
                          {otherUsername}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : (
            ""
          )}
        </>
      ))}
    </div>
  );
};

export default Left;
