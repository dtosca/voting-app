class VotesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  before_action :require_login, except: [:index]

  # GET /votes - Renders HTML with React component
  def index
  end

  # POST /votes - API endpoint for voting (returns JSON)
  
  def create
    if current_user.vote
      return render json: { 
        success: false, 
        errors: ["You have already voted"] 
      }, status: :unprocessable_entity
    end

    # Simplified to just handle candidate names
    candidate_name = params[:candidate_name]&.strip&.titleize

    if candidate_name.blank?
      return render json: { 
        success: false,
        errors: ["Please select a candidate"] 
      }, status: :unprocessable_entity
    end

    # Find or create candidate (within limit)
    candidate = Candidate.find_or_initialize_by(name: candidate_name)
    
    if Candidate.count >= 10 && candidate.new_record?
      return render json: {
        success: false,
        errors: ["Maximum candidate limit reached"]
      }, status: :unprocessable_entity
    end

    candidate.save! if candidate.new_record?
    @vote = current_user.build_vote(candidate: candidate)

    if @vote.save
      render json: { success: true }
    else
      render json: {
        success: false,
        errors: @vote.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private
  def vote_params
    params.permit(:candidate_name)
  end
end