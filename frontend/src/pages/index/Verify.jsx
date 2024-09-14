import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { UserContext } from "../../context/UserContext";
import { Loader } from "@mantine/core";
import api from "../../utils/axios";

function Verify() {
  const { reqVerification } = useContext(UserContext);

  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      authenticateUser(token);
    } else {
      setEmpty(true);
    }
  }, []);
  const authenticateUser = async (token) => {
    try {
      const res = await api.post("/verify-email-token", { token });
      setResult(true);
      setTimeout(() => {
        navigate("/app");
      }, 5000);
    } catch (error) {
      setResult(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-light bg-cover bg-no-repeat bg-center bg-[url('/bg/entry.jpg')]">
      <div className="p-6 w-1/3 max-md:w-full max-md:border-0 border border-brand bg-white rounded-xl">
        <div className="text-center flex flex-col justify-center items-center gap-y-8">
          <Logo />
          {!empty ? (
            <>
              {result === null ? (
                <>
                  <Loader size="xl" color="#1FB2A7" />
                  <p className="font-[500] text-base text-gray-600">
                    Verifying your email, please wait...
                  </p>
                </>
              ) : result ? (
                <p className="font-[500] text-xl">
                  Email verified!🎉 <br />
                  Redirecting you to the home page...
                </p>
              ) : (
                <div className="flex flex-col gap-y-4">
                  <p className="font-[500] text-base text-gray-600">
                    Invalid or expired verification token.
                  </p>
                  <p className="font-[500] text-base text-gray-600">
                    Please click on the button below to request a new
                    verification link.
                  </p>
                  <button
                    className="sign-free text-white"
                    onClick={() => {
                      reqVerification().then(() => {
                        navigate("/email-sent");
                      });
                    }}
                  >
                    Request new link
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="font-[500] text-base text-gray-600">
              No verification token found. Please check your email for the
              verification link.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Verify;
