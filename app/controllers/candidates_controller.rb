class CandidatesController < ApplicationController
    skip_before_action :verify_authenticity_token # Add this

   
    # GET /candidates
    def index
      render json: Candidate.all.as_json(only: [:id, :name]) # Explicit format
    end

    # POST /candidates (for admin use later)
    def create
      if Candidate.count >= 10
        render json: { error: "Maximum candidate limit reached" }, status: :unprocessable_entity
        return
      end
      
      @candidate = Candidate.new(candidate_params)
      if @candidate.save
        render json: @candidate, status: :created
      else
        render json: { errors: @candidate.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    private
  
    def candidate_params
      params.require(:candidate).permit(:name)
    end
  end