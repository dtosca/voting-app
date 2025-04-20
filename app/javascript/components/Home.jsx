import React, { useState, useEffect } from 'react';

const Home = ({ message }) => {

  {/* <h1>Message: {message}</h1> */}
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  //client-side validations
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    //regex for email validation
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    
    if (!zipCode) newErrors.zipCode = 'Zip code is required';
    //regex for zip code formation validation
    else if (!/^\d{5}(-\d{4})?$/.test(zipCode)) newErrors.zipCode = 'Invalid zip code format';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
        zip_code: zipCode 
      }),
    });

    console.log("Raw response:", response); // Inspect the full response

      // First check response status
      if (response.status === 204 || response.statusText === 'No Content') {
        // Handle empty response
        window.location.href = '/votes';
        return;
      }

      // Then try to parse JSON
      try {
        const data = await response.json();
        if (response.ok) {
          window.location.href = '/votes';
        } else {
          alert(data.error || "Login failed");
        }
      } catch (err) {
        // If JSON parsing fails, read as text
        const text = await response.text();
        console.error("Failed to parse JSON:", text);
        alert("Login error: " + text);
      }
        // Reset form after submission
        setIsSubmitting(false);
      } else {
    }
  }

    // Redirect to home if not logged in
    useEffect(() => {
      fetch('/check_session')
        .then(response => {
          if (!response.ok) window.location.href = "/"; 
        });
    }, []);

  return (
    <>    
    <h1 id="signin-heading">Sign In to Voting App</h1>
      
      <form onSubmit={handleSubmit} noValidate aria-labelledby="signin-heading">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <span id="password-error" className="error-message" role="alert">
              {errors.password}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">Zip Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            pattern="^\d{5}(-\d{4})?$"
            aria-required="true"
            aria-invalid={!!errors.zipCode}
            aria-describedby={errors.zipCode ? "zipCode-error" : undefined}
          />
          {errors.zipCode && (
            <span id="zipCode-error" className="error-message" role="alert">
              {errors.zipCode}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      
    </> 
  );
};

export default Home;
