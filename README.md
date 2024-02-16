Spaceship Paradigm

This code is for a game that was designed in 2021 by Emanuel et al. for psychological experiments on human motivation. 
This is a revamped version of the original that includes mood scales, which appear every 30 seconds, and different conditions.
It is also a full-stack development, whereas the original was coded in Python.

The aim of the game is to fly a spaceship around the screen and shoot as many asteroids as possible before the timer runs out.
Being an experimental design, the game does have experiment conditions that we coded specifically for our experiment. These can be changed at will.
The short condition involves playing the game for 30 minutes total, in five 6-minute blocks with breaks in between. The long condition involves playing for 30 minutes with no breaks.
There is also a test session which both conditions must complete. This test involves two blocks: 6 minutes with no breaks and 30 minutes with no breaks. 
These two blocks are counterbalanced so that the block the participant plays first is random and they must play both blocks.
The condition a person is chosen to play is entirely random and will be distributed evenly amongst players.

----

This game is a full stack development, which means it utilizes both frontend and backend code. This means that HTML, CSS, JavaScript and many JavaScript libraries and IDEs were used.

----

If you'd like to simply use this code as is, there are two ways. You can use it on a local computer or use the website we have it hosted on.

To host the game on a local computer and have people play locally, you need to download the code and open it in an editor (we used VSCode).
Next, you'll need to install npm, node.js, and nodemon. These is how you will be able to start a localhost server.
Note that if you are using MacOS, it is recommended to install homebrew, as you can install npm and node.js easily from the terminal using brew commands.
Once installed, open a terminal window and type npm install. This installs everything necessary to run the code. 
You'll notice a package.json file in the code you downloaded. Everything in that file are libraries that you will be installing when you write npm install.
With that done, you'll be able to start a localhost server. 
Nodemon starts a server and restarts it any time a change is made to a source file.
To start a server, write nodemon server.js. 
This will start a server that communicates with server.js to save data to MongoDB.

If you'd like to just use the website that already has the game hosted, use this link:
https://js-spaceship-lucy-conditions.fly.dev/

After the last "/", you can add setup to open the setup page (demographic questionnaire).
If you've written "setup", you can then add "/short-1", "/long-1", "/short-16" for the short condition session, long condition session, and test session, respectively.

----

FRONTEND

There are three different webpage types: the setup, the main game, and the break page.

The setup webpage is only used for the setup questionnaire, which participants use to enter their demographic information
There is an HTML file (setup.html), in which the questionnaire was coded, which is used to display the page on the site, and a CSS file (setup.css) which is used to make the questionnaire accessible.
The only thing done in JavaScript (setup.js) was saving the answers to the database and making the button work.
When the users are done filling out the questionnaire, they press a submit button, which only takes them to their respective session if the information gets properly saved. 
You can see the next section to understand how the saving to the database works.

The main game is modeled in essentially the same way as the setup.
There is an HTML file (please.html) that models how the screen should look, and a CSS (styles.css) file that makes the page look proper.
In the JavaScript file, named script2.js, is all the game logic and server communication.
It is impossible to explain all the game logic, however we will do our best to summarize it simply.
First, we create objects for everything in the game (spaceship, asteroids, missiles) and giving them each fields that they require (ex.: speed).
Next, we create all the functions involving those objects. This includes moving the spaceship, shooting missiles, having asteroids spawn and explode, and so on.
We then create event listeners to attach these functions to. For example, when the user presses the up arrow key, we call the function that accelerates the spaceship. 
We'll also need update function, which update the position of objects to reduce clutter and make sure things don't stay on ths creen when they shouldn't (e.g.: when an asteroid explodes, it should disappear).
Finally, you need to create a function that actaully runs the game. We put all the update functions into a function and nested a requestAnimationFrame() function.
This makes the function run as many times as the frame rate of the screen (so for a 60Hz monitor, it will run 60 times per second). 
This is ideal to make the game look fluid. If you didn't want to update the screen this much, you could get away with manually making a setInterval() function that updates 30 times a second. This is likely the least you can get away with.
With that done, the game should work.

We then need to add a timer, progress bar, mood scale and practice stages.
The timer and progress bar are simple setInterval() functions that update text, in the case of the timer, or a color, in the case of the progress bar, every second. 
The mood scale is a 10 point Likert scale ranging from -5 to +5 and was made entirely in JavaScript. Then use a setInterval() function to make the mood scale appear once every 30 seconds.
Lastly, for the practice stages, we have them separated into 7 stages. In order, they are: explanation, turning left, turning right, acceleration, shooting, questionnaire, free practice.
When the user completes a task, they will see a green checkmark and only then will they be able to go to the next stage.
When the player ends free practice, a timer will count down from 3 and then they will be in the main game.

The code itself has comments that should help explain the functions.

The break page is only used in between blocks during the test session and the short condition sessions.
It is comprised of only an HTML file called blockOver.html. 
The CSS file is the same we use for the main game, and we use inline JavaScript to make a functioning button which lets the player go back to the game.
This button is what switches the block in the test condition from 30 minutes to 6 minutes and counts the number of 6-minute sessions the user has played in the short condition. The game ends when the counter reaches 4, as after the counter reaches 4, the participant will click the button and play their last block.

----

BACKEND

When the participant plays the game on the website, all the data gets saved to MongoDB via node.js. Node is a runtime environment that lets people write backend code in JavaScript. First, you set up CORS, which is what allows different sites to send info to the server. In figure 1, I have it set up to receive info from the website that the participant will play the game on, as well as localhost port 8080 (for when I test the game at home). 

<img width="391" alt="image" src="https://github.com/tylerforgione/js_spaceship/assets/145729834/7d461b06-2035-4471-9a41-48490468c1be">

Figure 1. Cross Origin Resource Sharing (CORS)

After that, we use something called mongoose which is a JavaScript library that allows communication between node.js and MongoDB. This is the most important part of the operation. Using mongoose, I connect to the database using a URL and my username and password. Since this is server-side, no one can see it except for me. 

Mongoose’s main use here is to set up schemas, which basically let you frame how your data gets saved to the DB. For example, in figure 2, I’ve created a schema specifically for demographic information (age, gender ,handedness) and the subject’s ID. Next, I create a Participant object, which allows the DB to treat each participant individually

<img width="468" alt="image" src="https://github.com/tylerforgione/js_spaceship/assets/145729834/ddd78bee-8e9a-489d-9c1b-1ae27d412994">

Figure 2. Partcipant schema in mongoose

<img width="468" alt="image" src="https://github.com/tylerforgione/js_spaceship/assets/145729834/043ca566-913a-4da1-bd65-387db8ea15b9">

Figure 3. Saving the participant object to the database with a function called submit-form

Now, whenever the participant presses “submit” on their information form, a function (in the front-end, as in figure 4) will run that calls the function in figure 3. This app.post function is an Express function that tells the application (or website in this case) to route information through node.js. Finally, participant.save() is a mongoose function that saves the information to the database for good.

Everything that gets saved to the database has the same general format. You first create an object with the info you’d like it to have, then you create a function (in the front-end) that calls app.post, which then calls the last function, which saves everything to the database. I am saving this demographic info, each spacebar press (along with its timestamp), each response to the mood scale (along with its timestamp), and the participant’s final score. 

The function in figure 4 is relatively self-explanatory, it creates a formData object and makes a post request when it receives the signal (the participant submitting their form). This formData object is exactly what the Participant object is using in the app.post function.

<img width="446" alt="image" src="https://github.com/tylerforgione/js_spaceship/assets/145729834/47efcc44-6ca3-47a5-8fb4-237646fcf35e">

Figure 4. Front-end submit-form function

<img width="444" alt="image" src="https://github.com/tylerforgione/js_spaceship/assets/145729834/a4973152-4fcd-4f44-b769-2973b40eae40">
 
Figure 5. Changing all the data from JSON to CSV

Last, but not least, we need to save the data in a csv file to it may be easier to work with. In the exportToCSV() function (figure 5), mongoose lists all the data collections (participant, spacebar presses, mood scale answers, final scores) and uses json2csv to convert all the data into CSV. Then , the collections get renamed using fileshare (fs), so that there are no errors in the data collection (e.g.: having a csv file with a filename ending in .json).


EXTRA

<img width="415" alt="image" src="https://github.com/tylerforgione/js_spaceship/assets/145729834/72d540fa-880d-486d-b3aa-e4bed9428739">
 
Figure 6. Directing to proper root


In figure 6, all that’s happening is that Node.js is telling the website which root to go to depending on what the website’s “suffix” is. For example, if the website ends in /setup/short-1, then the site redirects to the setup form and once that has been submitted, it redirects to the short condition’s 1st session. 


