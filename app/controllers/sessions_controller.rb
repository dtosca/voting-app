class SessionsController < ApplicationController

    skip_before_action :verify_authenticity_token, only: [:create]
    skip_before_action :require_login, only: [:create] # Allow login without being logged in

    # POST /login
    def create
      user = User.verify(params[:email], params[:password])
      
      session[:user_id] = user.id
      render json: { 
        success: true, 
        user: { 
          email: user.email,
          zip_code: user.zip_code
        }
      }
    rescue ActiveRecord::RecordInvalid => e
      render json: { 
        success: false, 
        error: "Account creation failed: #{e.message}" 
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