class VotesController < ApplicationController
  before_action :require_login
  before_action :validate_candidate_limit, only: [:create]

  # POST /votes
  def create
    begin
      if vote_params[:candidate_id].present?
        # Existing candidate vote
        @vote = current_user.build_vote(candidate_id: vote_params[:candidate_id])
      elsif vote_params[:new_candidate].present?
        # Write-in candidate
        candidate = Candidate.find_or_initialize_by(name: vote_params[:new_candidate].strip.titleize)
        
        # Only save new candidate if under limit
        if Candidate.count >= 10
          render json: { 
            success: false, 
            errors: ["Maximum candidate limit (10) reached"] 
          }, status: :unprocessable_entity
          return
        end
        
        candidate.save! if candidate.new_record?
        @vote = current_user.build_vote(candidate: candidate)
      else
        raise ArgumentError, "No voting method selected"
      end

      if @vote.save
        render json: { success: true, vote: @vote }
      else
        render json: { 
          success: false, 
          errors: @vote.errors.full_messages 
        }, status: :unprocessable_entity
      end

    rescue ArgumentError => e
      render json: { 
        success: false, 
        errors: [e.message] 
      }, status: :unprocessable_entity
    rescue ActiveRecord::RecordInvalid => e
      render json: { 
        success: false, 
        errors: ["Invalid candidate: #{e.message}"] 
      }, status: :unprocessable_entity
    end
  end

  private

  def vote_params
    params.require(:vote).permit(:candidate_id, :new_candidate)
  end

  def validate_candidate_limit
    if current_user.vote
      render json: { 
        success: false, 
        errors: ["You have already voted"] 
      }, status: :unprocessable_entity
    end
  end
end

