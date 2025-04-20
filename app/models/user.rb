class User < ApplicationRecord
  has_one :vote
  
  has_secure_password validations: false # Disable password validations

  validates :email, 
    presence: true,
    uniqueness: { case_sensitive: false},
    format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }

  validates :zip_code,
    presence: true,
    format: { with: /\A\d{5}(-\d{4})?\z/, message: "Must be a valid US zip code" }

  def self.verify(email, password, zip_code)
    # Find or create user without password validation
    user = find_or_initialize_by(email: email.downcase.strip)
    
    # Set default password if new user
    if user.new_record?
      user.password = password || 'default_password'
      user.zip_code = zip_code 
      user.save!
    end
    
    user # Always return the user
  end
end