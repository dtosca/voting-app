class SessionsController < ApplicationController

    skip_before_action :verify_authenticity_token, only: [:create]
    skip_before_action :require_login, only: [:create] # Allow login without being logged in

    # POST /login
    def create
      # Extract parameters with fallback for zip code
      email = params[:email] || params.dig(:session, :email)
      password = params[:password] || params.dig(:session, :password)
      zip_code = params[:zip_code] || params.dig(:user, :zip_code) || '00000' # Default fallback

      user = User.verify(email, password, zip_code)
      session[:user_id] = user.id
      render json: { success: true, user: user }

      rescue ActiveRecord::RecordInvalid => e
        render json: { 
          success: false, 
          error: e.record.errors.full_messages.join(', ') 
        }, status: :unprocessable_entity
    end
  
    # DELETE /logout
    def destroy
      reset_session
      render json: { success: true }
    end
  
    # GET /check_session
    def show
      if current_user
        render json: { 
          logged_in: true,
          user: {
            email: current_user.email,
            zip_code: current_user.zip_code
          }
        }
      else
        render json: { logged_in: false }
      end
    end
  
    private
  
    def current_user
      @current_user ||= User.find_by(id: session[:user_id])
    end
  end