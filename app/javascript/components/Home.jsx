import React, { useState, useEffect } from "react";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  //client-side validations
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    //regex for email validation
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";

    if (!zipCode) newErrors.zipCode = "Zip code is required";
    //regex for zip code formation validation
    else if (!/^\d{5}(-\d{4})?$/.test(zipCode))
      newErrors.zipCode = "Invalid zip code format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          zip_code: zipCode,
        }),
      });

      // First check response status
      if (response.status === 204 || response.statusText === "No Content") {
        // Handle empty response
        window.location.href = "/votes";
        return;
      }

      // Then try to parse JSON
      try {
        const data = await response.json();
        if (response.ok) {
          window.location.href = "/votes";
        } else {
          alert(data.error || "Login failed");
        }
      } catch (err) {
        // If JSON parsing fails, read as text
        const text = await response.text();
        alert("Login error: " + text);
      }
      // Reset form after submission
      setIsSubmitting(false);
    }
  };

  // Redirect to home if not logged in
  useEffect(() => {
    fetch("/check_session").then((response) => {
      if (!response.ok) window.location.href = "/";
    });
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Sign in to vote</h1>

              <form
                onSubmit={handleSubmit}
                noValidate
                aria-labelledby="signin-heading"
              >
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <div id="email-error" className="invalid-feedback">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-required="true"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                  {errors.password && (
                    <div id="password-error" className="invalid-feedback">
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="zipCode" className="form-label">
                    Zip code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    className={`form-control ${
                      errors.zipCode ? "is-invalid" : ""
                    }`}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    pattern="^\d{5}(-\d{4})?$"
                    aria-required="true"
                    aria-invalid={!!errors.zipCode}
                    aria-describedby={
                      errors.zipCode ? "zipCode-error" : undefined
                    }
                  />
                  {errors.zipCode && (
                    <div id="zipCode-error" className="invalid-feedback">
                      {errors.zipCode}
                    </div>
                  )}
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
