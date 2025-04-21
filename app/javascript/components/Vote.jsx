import React, { useState, useEffect } from 'react';

const Vote = (props) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [newCandidateName, setNewCandidateName] = useState('');

  useEffect(() => {
    fetch(props.candidates_url)
      .then(res => res.json())
      .then(setCandidates);
  }, []);

  const handleVote = (candidateVote) => {

    fetch(props.vote_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote: { candidate_id: candidateVot } })
    });
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Cast your vote today!</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Vote for a candidate:</h2>
          <div className="list-group">
            {candidates.map(candidate => (
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
                    setSelectedCandidate(candidate.name);
                    setNewCandidateName('');
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
        <button
            className="btn btn-primary btn-lg w-100"
            onClick={handleVote(selectedCandidate)}
            disabled={!selectedCandidate && !newCandidateName.trim()}
        >
          Vote
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
        className="btn btn-primary btn-lg w-100"
        onClick={handleVote(newCandidateName)}
        disabled={!selectedCandidate && !newCandidateName.trim()}
      >
        Vote
      </button>
    </div>
  );
};

export default Vote;