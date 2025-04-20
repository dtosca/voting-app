
class ApplicationController < ActionController::Base
    include ActionController::Cookies
    protect_from_forgery with: :exception
    before_action :basic_cors
    before_action :require_login

    skip_before_action :verify_authenticity_token, 
    if: -> { request.content_type == 'application/json' }

    private

    def current_user
        @current_user ||= User.find_by(id: session[:user_id])
    end

    def require_login
        unless current_user || auth_exempt?
        render json: { error: "Please log in" }, status: :unauthorized
        end
    end

    def auth_exempt?
        # List of controllers/actions that don't require auth
        controller_name == 'home' || 
        (controller_name == 'sessions' && action_name.in?(%w[create show]))
    end

   def basic_cors
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
  end
end