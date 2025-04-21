Rails.application.routes.draw do
  root "home#index"
  
  # renders React component
  get '/votes', to: 'votes#index'
  
  post '/login', to: 'sessions#create'
  post '/votes', to: 'votes#create'
  get '/check_session', to: 'sessions#show'
  resources :candidates, only: [:index]
end