# HIIT up2099431
## Key features
REMOVE ME: Introduce the key features, paying special attention to the non-code ones.  Tell us briefly how to find & use them, and describes the reasons behind the design decisions you made in their implementation.  

My HIIT app allows the user to create an exercise, load it into the timer, start the exercise, pause the exercise, save the workout and export their list of saved exercises as a CSV file. This allows the user to perform their desired workout in an interface that is minimal, clean and easy to use. I wanted to make the timer and its functionality simple, but also filling all needed functionality. Separating the pages into html files and having their own js file made the structure of my code clearer and helped with debugging. I used an SQLite database to store my exercise data, as it allos for easy storage and retrieval of data- in this case I create an Exercise object which I used to add properties to each individual exercise, and save the properties to their corresponding columns in the database table.

The SQLite database is initialised in svr.js. When the program is run for the first time, it checks if there is already a database called 'exercises.db'. If this is the case, then it will not create a duplicate database. Otherwise, a new database is created. This is done using db.serialize. 

To run this app use the terminal to input 
```npm start```
This will start the server, allowing you to visit the app page on your localhost at port 8080. This is 127.0.0.1:8080, or localhost:8080.

### Creating an exercise
To create an exercise, use the navigation bar at the top of the screen to select the 'Create' page. From this screen, the user is presented with 2 options. Create an exercise from a preset list in the dropdown menu (Burpees, Push-ups or Plank) or create your own custom exercise. To select a preset exercise, simply click to open the dropdown menu and select one of the options. The selected exercise will be automatically loaded into the database table 'exercises', and displayed on the screen for the user to see.

To create a custom exercise, enter the exercise name, duration in minutes and seconds, rest period in minutes and seconds, number of reps and a description. If not all these fields are filled, the exercise will not be created. To finalise the creation, press the 'Create Exercise' button below, and it will be loaded onto the screen and into the database following the same process as preset events. I chose to have some preset exercise in case users do not want to create their own exercise from scratch for reasons such as being in a rush or simply just convenience. The properties of the preser exercises could be displayed better, which is a change that could be made in the future.

### Loading an exercise 
Once an exercise has been created, it is now possible to select it and load it into the timer. Going to the 'Exercise' screen will display the created exercise(s), along with a timer and text that tells the user to select an exercise. By left clicking on one of the exercises, it will turn green to indicate that it has been selected. The duration of the exercise is then fetched and loaded into the timer- for example, after creating a 'Plank' exercise, which by default has a duration of 1 minute and 30 seconds, 1 minute and 30 seconds will apear in the correct fields of the timer. The name of the exercise appears at the top along with the number of reps completed and the total reps, and the start/pause button is enabled. These features meet all the requirements and allow a user to perform a HIIT workout with ease.

The clear button will clear all created exercise from the database and remove them from displaying on screen. Each exercise also has a delete button, where the user can click the button to delete the individual exercise. I felt it was important to have a clear button to quickly remove all of the exercises to make the app more efficient and user friendly.

### Performing an exercise
Once an exercise has been created, simply click/press the green start button that has now been enabled. The timer will start counting down to 0, and a progress bar will gradually fill up. The user can pause the exercise at any time, except during rest periods. Pressing the reset button at any time when there is a loaded exercise will clear any exercises from being loaded. The selected exercise will no longer be highlighted, indicating to the user that they now have no exercise selected.

Once the timer reaches 0, if the exercise has no more remaining reps (repsDone === currentlySelectedEercise.reps), then the exercise is completed. The start button will disable itself, the selected exercise will be highlighted a different colour to indicate it has been completed, and the text on the screen will update to inform the user that they have finished, and can now select another exercise. If there are more reps remaining, the timer will now enter rest mode. The rest duration will be loaded into the timer, progress bar will empty, text will display that says 'Resting...' and the timer will count back down to 0. Then, when it reaches 0, it goes back into exercise mode and behaves as before, until all reps have been completed.

Another thing the user can do at any point is to save their currently loaded exercise by pressing the 'save' button. This will save the exercise into a different database table (pastExercises), which is displayed in the 'Saved' page. The data stored in this table is slightly different to in the exercises table- it includes a timeRemaining value which, if the user is unable to complete an exercise but still saves it, will save the amount of time of the current rep is left to complete. The user can save as many exercises as they want, and cannot save when there is no loaded exercise.

### Saving exercises
When a user saves an exercise, it is saved to the pastExercises table as previously mentioned. To see these exercise, navigate to the 'Saved' page. Here, all of the user's saved exercise will be displayed. Here, there are 2 options- clear workouts does as expected and clears all saved workouts from the database and the page, and export workouts saves the list of exercises as a CSV file, which is then downloaded automatically to the browser. This can be used to share exercises or simply save them externally. Currently, there is no ability to load exercises back into the app from this CSV file due to time constraints, but this is something that could be implemented in the future. Additionally, a good feature for the future would be to load one of these saved in-progress exercises back into the timer to resume.

### Navigation bar
The navigation bar is always present at the top of the screen. When the user clicks on one of the options, it is highlighted to provide feedback that this is the currently selected page. It is essential to have this navigation bar as without it, it is impossible to go to the different pages and use the app. With the navigation bar, the different pages come together seamlessly to create a functional app.


## AI

### Prompt to develop save button logic
A sequence of prompts helped me develop this feature:

>  disable the save button when there is no loaded exercise
This prompt was helpful, but didnt give the solutions in the right place. I knew I needed to do startBtn.disabled = true/false, but was unsure where to put it. After a bit of playing around with it in different functions I eventually found that it should go in the clear and reset buttons and showExercises function.


### Prompt to debug rep counter
I was encountering issues with my rep counter. It worked for all exercises apart from those with only 1 rep. Here are the prompts I used to help debug this feature:

>  when i select an exercise that has 1 rep, it does it twice:. for example, i have an exercise called b which has 1 rep and c which has 2. when b is finished, the reps suddenly go from 1 to 2 and it carries on as if i selected c, when i didnt.
This prompt was helpful because it told me exactly where the logical errors came from: ```when you click on an exercise to start the timer, you're assigning the currentlySelectedExercise variable inside the loop that iterates over the exercises. As a result, the currentlySelectedExercise variable always gets assigned the last exercise in the list.```. It provided me with corrected code that just moved a few variables and statements around, changing their order and putting some inside if statements. This fixed the bug and made the rep counter function as intended.


### Prompt to fetch exercise data from database and display on screen
At the start of the project, after I had initialised the database and created the tables, I needed to fetch data from them to use in the app. This was the list of created exercises. There was an error in my code that meant the exercise and rest durations were not being displayed correctly. I tried different things, which led to them being displayed as either NaN or undefined.
> here is my code that fetches from an express server, which retrieves from a database. why are all the fields undefined?

The response I got was that I had simply mismatched property names between client side and database. I was selecting columns client side as 'exerciseDuration' and 'restDuration', but in the database and server side they were defined as 'durationSecs' and 'restPeriodSecs'. This prompt was a good starting point, however I had to code the conversions so that the numbers were foramtted correctly. After renaming fields and doing the conversions, the data was fetched properly.


### Prompt to develop saved exercise page
I wanted to display the amount of time remaining when a workout is saved, but in my original Exercise object, I did not create a timeRemaining property because it would only be used in one page. I was unsure how to calculate this, so turned to AI.

>my getpastexercises gets all the fields from the table. since timeremaining is not in the original object constructor, how do i display it in myworkouts?
The solution was relatively simple but the response from the prompt was not particularly useful. It created entire new functions for simple 1 line calculations I needed to do, which I didn't use. However, I used the logic in my code- I just needed to use the current time in the timer to get the amount of time remaining. I added this into my script.js file, which added it to the database and was able to be retrieved in myWorkouts.js


### Prompt to develop saving to pastExercises table
I needed to save the exercises to another table, as having initially created and in progress exercises in the same table would not be efficient and would get very messy if there were too many exercises.

> i have created a second table in the exercise database, but have only 1 post function for the server. I need to be able to add past events to the new table, is there a way to filter

The response I received from that was helpful, as I would say that working with servers was my weakest point in developing this app. It told me I needed to create a new endpoint, so i created /pastExercises, and added some new app.post, app.delete methods. 

Next, I had to change and add some methods in my code to save the exercise to the correct database:

> How would I alter the saveExercise function in create.js to save the exercise to the pastExercises table, with the correct fields

This prompt was useful as it changed the saveExercise function to use the /pastExercises endpoint, and created fields that matched the columns.

Also, whenever I used AI to help with sending/retrieving from the database, they used .then instead of await. I prefer to use await as this is what I learnt in class and was more familliar with it- as stated before, coding and implementing servers was not my strong point, so I asked AI for help when I needed it. This meant that I had to go through the response and change it to a try/catch block, which uses await to fetch data.


## Other notes

Initially, I planned to develop my app as a SPA (Single Page Application). I was going to use the example Matt demo'd in class to help me structure my code with inc files, etc. However, I found it to be too confusing so instead I used multiple html files to create all my pages. I had to create a separate nav bar and implement it in each file which may not be the most efficient way of doing this.

It also took me a while to understand how to configure the database, I spent time looking at the SQLite documentation and websites. Eventually, I figured out how to initialise it using serialise and db.run. I installed some extensions for VSCode which allowed me to view the contents of these databases, which made debugging much easier, particularly when I was receiving NaN and undefined errors as above.

Since the prototype, this app has been greatly improved. At the prototype submission, the only functionality was a simple timer, and the ability to create an exercise with a name and the time currently displayed on the timer. Almost all functionality has been added since then, with the timer and exercises no longer dependent on each other. The ability to save exercises to an exertal SQLite database was added, along with data retrieval and formatting. CSS was also added to make the web app look nicer. Buttons are kept separate from text to make sure people can tell the difference between them.