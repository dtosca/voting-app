class User < ApplicationRecord
    has_secure_password  # Adds password encryption
    
    has_one :vote
    validates :email, 
      presence: true,
      uniqueness: { case_sensitive: false },
      format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }
      
    validates :zip_code,
      format: { with: /\A\d{5}(-\d{4})?\z/, message: "Must be a valid US zip code" }
      
    # Lightweight authentication
    def self.verify(email, password)
      user = find_by(email: email.downcase.strip)
      user if user&.authenticate(password)
    end
  end