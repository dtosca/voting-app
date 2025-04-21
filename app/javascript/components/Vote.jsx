import React, { useState, useEffect } from "react";

const Vote = (props) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [candidateVote, setCandidateVote] = useState(null);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // Fetch candidates
    fetch(props.candidates_url)
      .then((res) => res.json())
      .then(setCandidates);
  }, []);

  const handleVote = async (candidateVote) => {
    console.log(candidateVote);

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

      if (!response.ok)
        throw new Error(data.errors?.join(", ") || "Vote failed");

      setHasVoted(true);
    } catch (err) {
      setError(err.message);
    }

    if (hasVoted) {
      return (
        <div className="alert alert-success" role="alert">
          <h2>Thank you for voting!</h2>
          <p>Your vote has been recorded.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          <h2>Error</h2>
          <p>{error}</p>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => setError(null)}
          >
            Try Again
          </button>
        </div>
      );
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Cast your vote today!</h1>

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

      <button
        className="btn btn-primary btn-lg"
        onClick={() => handleVote(candidateVote)}
        disabled={!selectedCandidate && !newCandidateName.trim()}
      >
        Vote
      </button>

      <hr />
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
            {/* Adding a label in favor of a placehodler for better a11y*/}
            <div id="writeInHelp" className="form-text">
              Enter name of the candidate you want to add.
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary btn-lg"
        onClick={() => handleVote(candidateVote)}
        disabled={!selectedCandidate && !newCandidateName.trim()}
      >
        Vote
      </button>
    </div>
  );
};

export default Vote;
