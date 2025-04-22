class SessionsController < ApplicationController

    skip_before_action :verify_authenticity_token, only: [:create]
    skip_before_action :require_login, only: [:create] # Allow login without being logged in

    # POST /login
    def create
      # Parameter extraction with clear structure
      login_params = params.permit(:email, :password, :zip_code)
      email = login_params[:email]
      password = login_params[:password]
      zip_code = login_params[:zip_code] || '00000' # Default fallback

      # Business logic
      user = User.verify(email, password, zip_code)
      session[:user_id] = user.id

      # Secure response - don't expose full user object
      render json: { 
        success: true,
        user: {
          email: user.email
        }
      }

    rescue ActiveRecord::RecordInvalid => e
      # Validation errors
      render json: { 
        success: false, 
        error: e.record.errors.full_messages.join(', ')
      }, status: :unprocessable_entity

    rescue => e
      # General errors (network, auth, etc)
      render json: { 
        success: false,
        error: e.message 
      }, status: :unauthorized
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
            email: current_user.email
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