class Candidate < ApplicationRecord
    has_many :votes, dependent: :restrict_with_error
    validates :name, 
      presence: true,
      uniqueness: { case_sensitive: false },
      length: { maximum: 50 }
    
    # Prevent exceeding 10 candidates
    validate :candidate_limit, on: :create
  
    private
    def candidate_limit
      if Candidate.count >= 10
        errors.add(:base, "Maximum of 10 candidates allowed")
      end
    end

    def vote_count
      votes.count
    end
  end
