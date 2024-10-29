import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { UserContext } from "../../context/UserContext";

import { Loader } from "@mantine/core";
import { PinInput, Modal } from "@mantine/core";
import api from "../../utils/axios";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

function Verify() {
  const { reqVerification } = useContext(UserContext);
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [empty, setEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const authenticateUser = async (code) => {
    const email = localStorage.getItem("email");

    try {
      const res = await api.post("/verify-entry-code", { code, email });
      setResult(true);
      setTimeout(() => {
        navigate("/app");
      }, 5000);
    } catch (error) {
      setResult(false);
    }
  };

  return (
    <>
      <div className="h-screen w-full flex justify-center items-center bg-light bg-cover bg-no-repeat bg-center bg-[url('/bg/entry.jpg')]">
        <div className="action-box">
          <div className="text-center flex flex-col justify-center items-center gap-y-8">
            <Logo />
            <div className="flex flex-col items-center gap-y-6">
              <p className="font-[500] text-base text-gray-600">
                Please enter the verification code sent to your email
              </p>
              <PinInput
                value={code}
                onChange={setCode}
                type="alphanumeric"
                length={6}
                size="lg"
                autoFocus
                onComplete={(value) => {
                  setCode(value);
                  console.log("code: ", code);
                }}
              />
            </div>
            <div className="w-full flex justify-center">
              <button
                className="login-btn mx-2"
                onClick={() => {
                  setModal(true);
                  authenticateUser(code);
                }}
              >
                <p className="max-md:mx-2">Submit</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        opened={modal}
        onClose={() => setModal(true)}
        withCloseButton={false}
        radius={"md"}
        centered
      >
        <div className="py-6">
          {result === true ? (
            <div className="flex flex-col gap-y-6 items-center justify-center">
              <FaCircleCheck
                size={50}
                color="#1cc11c"
                className="success-anim"
              />
              <p className="text-xl font-bold text-center">
                Verification Successful
              </p>
              <p className="text-base text-center">
                You will be redirected to your dashboard in 5 seconds
              </p>
            </div>
          ) : result === false ? (
            <div className="flex flex-col gap-y-6 items-center justify-center">
              <FaCircleExclamation
                size={50}
                color="red"
                className="error-anim"
              />
              <p className="text-xl font-bold text-center">
                Verification Failed
              </p>
              <p className="text-base text-center">
                Please ensure the code is valid, or request a new one below
              </p>
              <button
                className="login-btn mx-2 w-[50%]"
                onClick={() => {
                  setModal(true);
                  reqVerification();
                }}
              >
                {" "}
                <p className="max-md:mx-2">Re-send Mail</p>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-y-6 items-center justify-center">
              <Loader />
              <p className="text-xl font-bold text-center">Verifying...</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default Verify;
