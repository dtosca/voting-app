class Vote < ApplicationRecord
  belongs_to :user
  belongs_to :candidate
  validates :user, uniqueness: { message: "has already voted" }
end