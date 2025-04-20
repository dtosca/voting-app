import React, { useState } from 'react';

const Vote = ({  }) => {

  const [newCandidate, setNewCandidate] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  //client-side validations
  const validateForm = () => {
    const newErrors = {};
    if (!newCandidate) newErrors.newCandidate = 'Your vote can`t be blank!';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Handle form submission
      console.log({ newCandidate });
      // Reset form after submission
      setIsSubmitting(false);
    }
  };

  return (
    <>
      
      <h1 id="vote-heading">Cast your vote today!</h1>
      
      <form onSubmit={handleSubmit} noValidate aria-labelledby="vote-heading">
        <div className="form-group">
          <label htmlFor="new-candidate">Add a new candidate...</label>
          <input
            type="new-candidate"
            id="new-candidate"
            name="new-candidate"
            value={newCandidate}
            onChange={(e) => setNewCandidate(e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.newCandidate}
            aria-describedby={errors.newCandidate ? "new-candidate-error" : undefined}
          />
          {errors.newCandidate && (
            <span id="new-candidate-error" className="error-message" role="alert">
              {errors.newCandidate}
            </span>
          )}
        </div>


        <button
          type="submit"
          disabled={isSubmitting}
          className="vote-button"
        >
          {isSubmitting ? 'Voting...' : 'Vote'}
        </button>
      </form>

      
    </> 
  );
};

export default Vote;
