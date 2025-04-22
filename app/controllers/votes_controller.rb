class VotesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  before_action :require_login, except: [:index]

  # GET /votes - Renders HTML with React component
  def index
  end

  # POST /votes - API endpoint for voting (returns JSON)
  def create

    Rails.logger.info "========== PARAMS RECEIVED =========="
    Rails.logger.info params.inspect
    Rails.logger.info "====================================="

    if current_user.vote
      return render json: { 
        success: false, 
        errors: ["You have already voted"] 
      }, status: :unprocessable_entity
    end
    
    candidate_name = vote_params[:candidate_name]&.strip&.titleize

    if candidate_name.blank?
      return render json: { 
        success: false,
        errors: ["Please select or write-in a candidate"] 
      }, status: :unprocessable_entity
    end


    # FIRST try to find existing candidate
    candidate = Candidate.where("LOWER(name) = ?", candidate_name.downcase).first

    # If not found, create new candidate (if under limit)
    unless candidate
      if Candidate.count >= 10
        return render json: {
          success: false,
          errors: ["Maximum candidate limit reached"]
        }, status: :unprocessable_entity
      end
      
      candidate = Candidate.create!(name: candidate_name)
    end

    # Create vote association
    @vote = current_user.create_vote(candidate: candidate)

    render json: { success: true }
    
    rescue ActiveRecord::RecordInvalid => e
      render json: {
        success: false,
        errors: [e.message]
      }, status: :unprocessable_entity
  
  end

  private
  def vote_params
    params.permit(vote: [:candidate_name]).require(:vote)
  end
end