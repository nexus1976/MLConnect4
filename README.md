# Connect4Client
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Development server
Run `ng serve` in a command prompt in the directory of this repo. You will have to install the latest version of node (`https://nodejs.org/en/download/`). You will need the latest version from the LTS side (NOT the "current" version).

You will need to install Angular CLI. After installing Node, go to a command prompt and run `npm install -g @angular.cli`. Once this is complete, you can run the `ng serve` command to spin up the front end app.

## Running the AI Engine
Download and install Anaconda at `https://www.anaconda.com/distribution/`, the appropriate one for your os.
Once installed, run the Anaconda prompt and CD to the location of this repo.
Install Keras by running `conda install -c anaconda keras` in the terminal.
NOTE: I had to upgrade my matplotlib again after the installation `pip install --upgrade matplotlib`
Once everything has been installed, run `jupyter notebook` from the anaconda prompt.
Open the notebook named `Daniel's API-KJ.ipynb` and run each section in succession until the final section that runs the Flask API server has run successfull. When running each section, don't run the next one until the `*` changes to a number for that section.

## Playing the game
After running everying from above, navigate a browser to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
