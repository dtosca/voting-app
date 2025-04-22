import React, { useState, useEffect } from "react";
import UserHeader from "./UserHeader";

const Vote = (props) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [candidateVote, setCandidateVote] = useState(null);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch candidates
    fetch(props.candidates_url)
      .then((res) => res.json())
      .then(setCandidates);
  }, []);

  const handleVote = async (candidateVote) => {
    setIsSubmitting(true);

    if (!candidateVote) {
      setError("Please select a candidate or enter a write-in name");
      return;
    }

    try {
      const response = await fetch(props.vote_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: { candidate_name: candidateVote } }),
      });

      const data = await response.json();

      if (response.ok) {
        setHasVoted(true);
      } else {
        throw new Error(data.errors?.join(", ") || "Vote failed");
      }
    } catch (err) {
      setError(err.message);
    }
    setIsSubmitting(false);
  };

  if (hasVoted) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-success text-center" role="alert">
              <h2 className="mb-3">Thank you for voting!</h2>
              <p className="mb-0">Your vote has been recorded.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger" role="alert">
              <h2 className="h4 mb-3">Error</h2>
              <p className="mb-3">{error}</p>
              <button
                className="btn btn-outline-danger"
                onClick={() => setError(null)}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <UserHeader />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-body">
                <h1 className="card-title text-center mb-4">
                  Cast your vote today!
                </h1>

                <div className="card mb-4">
                  <div className="card-body">
                    <h2 className="h4 mb-3">Vote for a candidate:</h2>
                    <div className="list-group">
                      {candidates.map((candidate) => (
                        <label
                          key={candidate.id}
                          className="list-group-item d-flex align-items-center"
                        >
                          <input
                            type="radio"
                            name="candidate"
                            className="form-check-input me-3"
                            checked={selectedCandidate === candidate.id}
                            onChange={() => {
                              setSelectedCandidate(candidate.id);
                              setCandidateVote(candidate.name);
                              setNewCandidateName("");
                            }}
                            aria-labelledby={`candidate-label-${candidate.id}`}
                          />
                          <span id={`candidate-label-${candidate.id}`}>
                            {candidate.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="d-grid mb-4">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => handleVote(candidateVote)}
                    disabled={
                      (!selectedCandidate && !newCandidateName.trim()) ||
                      isSubmitting
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Voting...
                      </>
                    ) : (
                      "Vote"
                    )}
                  </button>
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="writeInCandidate" className="form-label">
                        <h2 className="h4 mb-3">Or, add a new candidate:</h2>
                      </label>
                      <input
                        type="text"
                        id="writeInCandidate"
                        className="form-control"
                        value={newCandidateName}
                        onChange={(e) => {
                          setNewCandidateName(e.target.value);
                          setCandidateVote(e.target.value);
                          setSelectedCandidate(null);
                        }}
                        aria-describedby="writeInHelp"
                      />
                      {/* Adding a label in favor of a placeholder for better a11y*/}
                      <div id="writeInHelp" className="form-text">
                        Enter name of the candidate you want to add.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => handleVote(candidateVote)}
                    disabled={
                      (!selectedCandidate && !newCandidateName.trim()) ||
                      isSubmitting
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Voting...
                      </>
                    ) : (
                      "Vote"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vote;
