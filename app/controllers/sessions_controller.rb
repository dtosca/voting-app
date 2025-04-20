class SessionsController < ApplicationController

    skip_before_action :require_login, only: [:create, :show] # Allow these actions without login

    # POST /login
    def create
      user = User.verify(params[:email], params[:password])
      
      if user
        session[:user_id] = user.id
        render json: { 
          success: true, 
          user: { 
            email: user.email,
            zip_code: user.zip_code
          }
        }
      else
        render json: { 
          success: false, 
          error: "Invalid email or password" 
        }, status: :unauthorized
      end
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