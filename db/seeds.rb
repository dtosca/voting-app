# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Clear existing
User.destroy_all
Candidate.destroy_all

User.create!([
  { email: "hillary@example.com", password: "pokemonGo2Polls", zip_code: "11232" },
  { email: "bernie@example.com", password: "grumpyGr@ndpa", zip_code: "33010" }
])

puts "Created #{User.count} users"

candidates = [
  "Cindy and the Scintillators",
  "BTESS",
]

candidates.each do |name|
  Candidate.create!(name: name)
end

puts "Created #{Candidate.count} candidates"