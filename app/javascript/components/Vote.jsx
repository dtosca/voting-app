import React, { useState, useEffect } from 'react';

const Vote = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch candidates on mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch('/candidates');
        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        setError("Failed to load candidates");
      }
    };

    fetchCandidates();
  }, []);

  const handleVote = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const voteData = selectedCandidate 
        ? { candidate_id: selectedCandidate }
        : { new_candidate: newCandidateName };

      const res = await fetch('/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote: voteData }),
        credentials: 'include'
      });

      if (!res.ok) throw new Error(await res.text());
      
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Vote submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidVote = selectedCandidate || (newCandidateName.trim().length > 0);

  if (success) {
    return (
      <div className="alert alert-success" role="alert">
        <h2>Thank you for voting!</h2>
        <p>Your vote has been recorded.</p>
      </div>
    );
  }

  return (
    <div className="vote-container" role="main">
      <h1 id="vote-heading">Cast Your Vote</h1>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <fieldset className="mb-4">
        <legend className="h2 mb-3">Choose an existing candidate</legend>
        <div className="candidate-list" role="radiogroup" aria-labelledby="vote-heading">
          {candidates.map(candidate => (
            <div key={candidate.id} className="form-check mb-2">
              <input
                type="radio"
                id={`candidate-${candidate.id}`}
                name="candidate"
                className="form-check-input"
                checked={selectedCandidate === candidate.id}
                onChange={() => {
                  setSelectedCandidate(candidate.id);
                  setNewCandidateName(''); // Clear the other input
                }}
                aria-describedby={`candidate-${candidate.id}-name`}
              />
              <label 
                htmlFor={`candidate-${candidate.id}`}
                className="form-check-label"
                id={`candidate-${candidate.id}-name`}
              >
                {candidate.name}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="mb-4">
        <h2 className="h2 mb-3">Or, write in a candidate...</h2>
        <div className="form-group">
          <label htmlFor="new-candidate" className="form-label">
            Write-in Candidate Name
          </label>
          <input
            type="text"
            id="new-candidate"
            className="form-control"
            value={newCandidateName}
            onChange={(e) => {
              setNewCandidateName(e.target.value);
              setSelectedCandidate(null); // Clear radio selection
            }}
            aria-describedby="new-candidate-help"
          />
          <small id="new-candidate-help" className="form-text text-muted">
            Enter the name of your write-in candidate
          </small>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary btn-lg w-100"
        onClick={handleVote}
        disabled={!isValidVote || isSubmitting}
        aria-disabled={!isValidVote || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span className="visually-hidden">Submitting...</span>
          </>
        ) : (
          "Submit Vote"
        )}
      </button>
    </div>
  );
};

export default Vote;