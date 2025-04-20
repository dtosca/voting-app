
class ApplicationController < ActionController::Base
    include ActionController::Cookies

    before_action :require_login

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
end