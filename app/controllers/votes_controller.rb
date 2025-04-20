class VotesController < ApplicationController

  skip_before_action :verify_authenticity_token

  # GET /vote
  def index
    # @candidates = Candidate.all
  end

  # POST /vote
  def create
    @vote = Vote.new(vote_params)
    
    if @vote.save
      render json: { success: true, vote: @vote }
    else
      render json: { success: false, errors: @vote.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def vote_params
    params.require(:vote).permit(:user_id, :candidate_id, :zip_code)
  end
end