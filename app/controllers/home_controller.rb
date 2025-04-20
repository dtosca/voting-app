class HomeController < ApplicationController
  skip_before_action :require_login

  def index
    @message = "Hello, world!"
  end
end
