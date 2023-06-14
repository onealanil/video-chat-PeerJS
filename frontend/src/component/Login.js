import React, { useState } from "react";
import Overall from "./Overall";


const Login = () => {
  const [userName, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleFunction = (e) => {
    e.preventDefault();
    if (userName) {
      setIsOpen(true);
    }
  };

  return (
    <>
      {isOpen ? (
        <>
          <Overall username={userName} />
        </>
      ) : (
        <>
          <div className="bg-white fixed inset-0 flex items-center justify-center mt-1 md:mt-5 select-none">
            <div className="flex flex-col w-[90%] md:flex-row xl:w-[85%] 2xl:w-[75%] gap-x-4 p-0 md:p-5 items-center justify-center">
              <div className="w-full flex flex-col md:w-[50%] gap-y-3 p-4">
                <div className="w-full flex items-center justify-center flex-col gap-y-2">
                  <span className="text-[1rem] md:text-[1.5rem] font-black leading-relaxed tracking-wide">
                    Enter your username to start the chat
                  </span>
                  <span className="font-poppins text-xs">
                    Don't worry nothing is being saved in database
                  </span>
                </div>
                <form onSubmit={handleFunction}>
                  <div className="w-full flex flex-col items-center juistify-center mt-5 gap-y-3">
                    <input
                      type="text"
                      placeholder="Enter username.."
                      className="w-full md:w-[90%] xl:w-[80%] 2xl:w-[75%] px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange"
                      required
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="w-full md:w-[90%] xl:w-[80%] 2xl:w-[75%] font-poppins text-sm leading-relaxed px-4 py-2 cursor-pointer bg-orange text-white rounded-md text-center mt-2"
                    >
                      Enter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
