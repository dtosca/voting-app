class ApplicationController < ActionController::Base
    before_action :require_login

    private
    def require_login
      head :unauthorized unless current_user
    end
end
