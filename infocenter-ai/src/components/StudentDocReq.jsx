import React, { useState } from "react";
import "../css/StudentDocReq.css";

export default function StudentDocReq({ userEmail }) {
  const [form, setForm] = useState({
    type: "",
    details: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userEmail) {
      setError("You must be logged in to submit a request.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/student/requests?email=${encodeURIComponent(
          userEmail
        )}&documentType=${encodeURIComponent(form.type)}&details=${encodeURIComponent(form.details)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ details: form.details })

        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      setSubmitted(true);
      setForm({ type: "", details: "" });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="student-page">
      <div className="request-card">
        <h2>Request a Document</h2>
        <p className="subtitle">
          Submit a request for official university documents
        </p>

        {error && <div className="error-box">{error}</div>}

        {submitted ? (
          <div className="success-box">
            ✅ Your request has been submitted successfully.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="request-form">
            <label>Document Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Select document</option>
              <option value="Transcript">Transcript</option>
              <option value="Enrollment Certificate">
                Enrollment Certificate
              </option>
              <option value="Graduation Certificate">
                Graduation Certificate
              </option>
              <option value="Transportation Refund">Transportation Refund</option>
              <option value="Other">Other</option>
            </select>

            <label>
              {form.type === "Other" ? "Specify Document & Details" : "Additional Details"}
            </label>
            <textarea
              name="details"
              placeholder={form.type === "Other" ? "Please specify exactly what document you need..." : "Provide any additional information..."}
              value={form.details}
              onChange={handleChange}
              required={form.type === "Other"}
            />

            <button type="submit">Submit Request</button>
          </form>
        )}
      </div>
    </div>
  );
}