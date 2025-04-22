require 'rails_helper'

RSpec.feature "Login and Vote happy path", type: :feature do
  scenario 'User can log in and vote on a band' do
    user = User.create!(email: 'test@example.com', password: 'password', zip_code: '12345')

    visit root_path
    expect(page).to have_content('Sign in to vote')

    fill_in 'email', with: 'test@example.com', id: 'email'
    fill_in 'password', with: 'password', id: 'password'
    fill_in 'zipCode', with: '12345', id: 'zipCode'
    click_button 'Sign in'

    expect(page).to have_content('Vote for a candidate')

    fill_in 'witeInCandidate', with: 'Example Band', id: 'witeInCandidate'
    click_button 'Vote'

    expect(page).to have_content('Thank you for voting')
  end

  # scenario 'Debug test', js: true do
  #   visit root_path
  #   puts "Current URL: #{current_url}"
  #   puts "Page status: #{status_code}"
  #   puts "HTML: #{page.html}"
  #   save_and_open_page
  # end

end
