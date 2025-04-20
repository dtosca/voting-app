class HomeController < ApplicationController

  skip_before_action :verify_authenticity_token
  
  def index
    @message = "Hello, world!"
  end
end
