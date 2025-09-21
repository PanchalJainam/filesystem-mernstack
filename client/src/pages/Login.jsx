import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserDetails, loginUser, verifyOtp } from "../Api/authApi";
import { setUser } from "../redux/slice/authSlice";
import { toast } from "react-hot-toast";

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputsRef = useRef([]);

  // Step 1: Login with email+password → backend sends OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      toast.success(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const otpString = otp.join("");
      const res = await verifyOtp({ email, otp: otpString });

      localStorage.setItem("token", res.data.token);
      const userRes = await getUserDetails();
      dispatch(setUser({ ...userRes.data.user, token: res.data.token }));

      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return; // allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move focus to next input if typing
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData
      .split("")
      .concat(new Array(6).fill(""))
      .slice(0, 6);
    setOtp(newOtp);

    // Focus the last pasted digit or the last input
    const lastIndex = Math.min(pasteData.length, 5);
    inputsRef.current[lastIndex].focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {/* Step 1: Email + Password */}
        {step === 1 && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg transition ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gray-700 text-white hover:bg-gray-800"
              }`}
            >
              {loading ? "Please wait..." : "Continue"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div className="space-y-5 text-center">
            <p className="text-gray-700 font-medium mb-4">
              Enter the 6-digit OTP sent to your email
            </p>
            <form onSubmit={handleVerifyOtp}>
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    ref={(el) => (inputsRef.current[index] = el)}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-12 sm:w-12 text-center border rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-gray-700"
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`mt-6 w-full py-2 rounded-lg transition ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-800"
                }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
