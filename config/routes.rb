Rails.application.routes.draw do
  root "home#index" # This will render your React app
  
  # API routes
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/check_session', to: 'sessions#show'
  
  resources :votes, only: [:index, :create]
  resources :candidates, only: [:index]
end