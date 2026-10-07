import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(
    localStorage.getItem("verification-email") || "",
  );
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/verify-email/", {
        email,
        otp,
      });

      localStorage.removeItem("verification-email");
      setMessage("Email verified successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      if (error.response?.data) {
        setError(JSON.stringify(error.response.data));
      } else {
        setError("something went wrong, Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/resend-otp/", {
        email,
      });

      setMessage(response.data.message);
    } catch (error) {
      if (error.response?.data) {
        setError(JSON.stringify(error.response.data));
      } else {
        setError("Unable to resend otp.");
      }
    }
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card p-4">
            <h3 className="text-secondary py-3 text-center">Verify Email</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            {message && <div className="alert alert-success">{message}</div>}
            <form onSubmit={handleVerify}>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="form-label text-secondary fs-5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="yourmail@shopnow.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="otp" className="form-label text-secondary fs-5">
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="form-control"
                  placeholder="Enter your OTP"
                  required
                />
              </div>

              <div className="my-3 text-center">
                <button className="btn btn-outline-dark" type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </form>

            <button className="btn btn-link mt-3" onClick={handleResend}>
                Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
