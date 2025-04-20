import React, { useState, useEffect } from 'react';

const Vote = () => {
  const [candidates, setCandidates] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Fetch candidates and voting status on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user already voted
        const voteCheck = await fetch('/votes', {
          headers: {
            'Accept': 'application/json' // Explicitly request JSON
          },
        });
        
        if (!voteCheck.ok) {
          const errorText = await voteCheck.text();
          throw new Error(errorText || 'Failed to check voting status');
        }

        const voteData = await voteCheck.json();
        if (voteData.voted) {
          setHasVoted(true);
          return;
        }

        // Fetch candidates if user hasn't voted
        const candidatesResponse = await fetch('/candidates', {
          headers: {
            'Accept': 'application/json'
          },
        });
        
        if (!candidatesResponse.ok) {
          const errorText = await candidatesResponse.text();
          throw new Error(errorText || 'Failed to load candidates');
        }
        
        const candidatesData = await candidatesResponse.json();
        setCandidates(candidatesData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVote = async () => {
    if (!selectedCandidate && !newCandidateName.trim()) {
      setError("Please select a candidate or enter a write-in name");
      return;
    }

    try {
      const response = await fetch('/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          vote: {
            candidate_id: selectedCandidate,
            new_candidate: newCandidateName.trim()
          }
        })
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(
          responseData.errors?.join(', ') || 
          responseData.error || 
          'Vote failed'
        );
      }

      setHasVoted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (hasVoted) {
    return (
      <div className="alert alert-success" role="alert">
        <h2>Thank you for voting!</h2>
        <p>Your vote has been recorded.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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

  return (
    <div className="container mt-4" >
      <h1 className="mb-4">Cast Your Vote</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Select a Candidate</h2>
          <div className="list-group" role="radiogroup">
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
                    setSelectedCandidate(candidate.id);
                    setNewCandidateName('');
                    setError(null);
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

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Or Write-In Candidate</h2>
          <div className="mb-3">
            <label htmlFor="writeInCandidate" className="form-label">
              Candidate Name
            </label>
            <input
              type="text"
              id="writeInCandidate"
              className="form-control"
              value={newCandidateName}
              onChange={(e) => {
                setNewCandidateName(e.target.value);
                setSelectedCandidate(null);
                setError(null);
              }}
              aria-describedby="writeInHelp"
              pattern="^[a-zA-Z\s]{3,50}$"
              title="3-50 letters only"
            />
            <div id="writeInHelp" className="form-text">
              Enter name if your candidate isn't listed (3-50 characters)
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary btn-lg w-100"
        onClick={handleVote}
        disabled={!selectedCandidate && !newCandidateName.trim()}
        aria-disabled={!selectedCandidate && !newCandidateName.trim()}
      >
        Submit Vote
      </button>
    </div>
  );
};

export default Vote;