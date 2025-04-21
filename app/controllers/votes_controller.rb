class VotesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  before_action :require_login, except: [:index]

  # GET /votes - Renders HTML with React component
  def index
  end

  # POST /votes - API endpoint for voting (returns JSON)
  def create
    # Keep your existing create action unchanged
    if current_user.vote
      return render json: { 
        success: false, 
        errors: ["You have already voted"] 
      }, status: :unprocessable_entity
    end

    if vote_params[:candidate_id].present?
      @vote = current_user.build_vote(candidate_id: vote_params[:candidate_id])
    elsif vote_params[:new_candidate].present?
      if Candidate.count >= 10
        return render json: { 
          success: false, 
          errors: ["Maximum candidate limit reached"] 
        }, status: :unproceAssable_entity
      end
      
      candidate = Candidate.find_or_create_by!(name: vote_params[:new_candidate].strip.titleize)
      @vote = current_user.build_vote(candidate: candidate)
    else
      return render json: { 
        
        success: false, 
        errors: ["No voting method selected"] 
      }, status: :unprocessable_entity
    end

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
    params.require(:vote).permit(:candidate_id, :new_candidate)
  end
end