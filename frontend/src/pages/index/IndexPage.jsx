import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import api from "../../utils/axios";
import { testAuthToken } from "../../utils/functions";

const IndexPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const auth = testAuthToken();
    console.log(auth)
    if (auth === true) {
      navigate('/app');
    }
  }, [navigate]);

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-sky-200">
      <div className="flex flex-col h-full">
        <header className="w-full flex justify-between items-center p-4">
          <div className="w-full max-md:hidden"></div>
          <div className="flex w-full items-center justify-center max-md:justify-start">
            <Logo />
          </div>
          <div className="w-full flex items-center justify-end gap-x-2">
            <button className="login-btn" onClick={() => navigate('/login')}>
              <p className="max-md:mx-2">Login</p>
            </button>
            <button className="sign-btn" onClick={() => navigate('/signup')}>
              <p className="max-md:mx-2">Sign up</p>
            </button>
          </div>
        </header>
        <main className="w-full h-full flex justify-center items-center">
          <div className="text-center w-[60%] flex flex-col justify-between items-center px-4 gap-y-2 max-md:w-full max-md:py-2 max-md:justify-between max-md:gap-4">
            <h1 className="font-semibold text-6xl max-md:text-3xl">
              Get your files anytime, anywhere.
            </h1>
            <p className="text-lg text-gray-600 font-medium w-[70%] max-md:w-full max-md:px-2 max-md:text-base">
              No more hassle with accessing your files from your multiple
              devices. Clink allows you to share the needed files with all your
              devices from one place.
            </p>
            <button className="sign-free" onClick={() => navigate('/signup')}>
              <p>Sign up free</p>
            </button>
          </div>
        </main>
      </div>
      <div className="p-4 h-full flex flex-col max-md:h-fit max-md:gap-8">
        <div className="text-center">
          <h1 className="font-semibold text-4xl max-md:text-xl">
            How it works<span className="text-brand">.</span>
          </h1>
          <p className="text-lg text-gray-600 font-medium max-md:px-2 max-md:text-base">
            Sharing with Clink is simply a click.
          </p>
        </div>
        <div className="w-full h-full items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-x-9 max-md:gap-y-8 max-md:h-fit">
          <div className="w-full h-[80%] bg-slate-100 flex items-center justify-center shadow-box max-md:h-full max-md:sm-screen max-md:bg-rose-500 hover:bg-rose-500">
            <div className="flex flex-col items-center justify-center gap-y-8 max-md:gap-y-4 max-md:my-4">
              <div className="flex flex-col items-center gap-x-2">
                <img src="/numbers/1.png" alt="Number 1" />
                <h1 className="font-semibold">Sign Up</h1>
              </div>
              <div className="w-[70%] text-center">
                <p>Create a Clink account on your device by signing up, your account will be given a connection code.</p>
              </div>
            </div>
          </div>
          <div className="w-full h-[80%] bg-slate-100 flex items-center justify-center shadow-box max-md:h-full max-md:sm-screen max-md:rotate-[-5deg] max-md:hover:rotate-[-5deg] max-md:bg-emerald-400 hover:bg-emerald-400">
            <div className="flex flex-col items-center justify-center gap-y-8 max-md:gap-y-4 max-md:my-4">
              <div className="flex flex-col items-center gap-x-2">
                <img src="/numbers/2.png" alt="Number 1" />
                <h1 className="font-semibold">Clink your devices with Connect</h1>
              </div>
              <div className="w-[70%] text-center">
                <p>On your other devices, you can either login or click the <span className="italic text-gray-500">Connect</span> button. This will prompt you to input your connection code</p>
              </div>
            </div>
          </div>
          <div className="w-full h-[80%] bg-slate-100 flex items-center justify-center shadow-box max-md:h-full max-md:sm-screen max-md:bg-yellow-500 hover:bg-yellow-500 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col items-center justify-center gap-y-8 max-md:gap-y-4 max-md:my-4">
              <div className="flex flex-col items-center gap-x-2">
                <img src="/numbers/3.png" alt="Number 1" />
                <h1 className="font-semibold">Share your files.</h1>
              </div>
              <div className="w-[70%] text-center">
                <p>Click on the needed device and select the file you want to share.That's it, now you can share your files to all your connected devices</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="sign-free hover:bg-cyan-300" onClick={() => navigate('/signup')}>
            <p>Start Clinking</p>
          </button>
        </div>
      </div>
      <footer className="py-10 text-center">
      © 2024 <span className="italic text-sky-500"><a href="#">Clink</a></span> by <span className="italic font-semibold"><a href="https://nueldotdev.github.io/" target="_blank">nueldotdev<span className="text-red-600">.</span></a></span>
      </footer>
    </div>
  );
};

export default IndexPage;
