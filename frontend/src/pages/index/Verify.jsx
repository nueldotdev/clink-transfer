import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { Loader } from "@mantine/core";

function Verify() {

  const { reqVerification } = useContext(UserContext);

  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      authenticateUser(token);
    }
  }, []);

  const authenticateUser = async (token) => {
    axios
      .post("http://localhost:5500/verify-email-token", { token })
      .then((res) => {
        console.log("User verified:", res.data);
        setResult(true);
      })
      .catch((error) => {
        console.error("Error during verification:", error);
        setResult(false);
      });
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-light bg-cover bg-no-repeat bg-center bg-[url('/bg/entry.jpg')]">
      <div className="p-6 w-1/3 max-md:w-full bg-white rounded-xl">
        <div className="text-center flex flex-col justify-center items-center gap-y-8">
          <Logo />
          {result ? (
            <p className="font-[500] text-xl text-green-500">
              Email verified!🎉
            </p>
          ) : result === null ? (
            <Loader size="xl" color="#1FB2A7" />
          ) : result === false ? (
            <div className="flex flex-col gap-y-4">
              <p className="font-[500] text-base text-gray-600">
                Invalid or expired verification token.
              </p>
              <p className="font-[500] text-base text-gray-600">
                Please click on the button below to request a new verification
                link.
              </p>
              <button
                className="sign-free text-white"
                    onClick={() => {
                      reqVerification().then(() => {
                        navigate('/email-sent')
                      })
                }}
              >
                Request new link
              </button>
            </div>
          ) : null}
          {result === null ?
            <p className="font-[500] text-base text-gray-600">
            Verifying your email, please wait...
            </p> : <div></div>
          }
        </div>
      </div>
    </div>
  );
}

export default Verify;
