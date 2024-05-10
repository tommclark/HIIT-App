# HIIT up2099431 <-- your student number here
## Key features
REMOVE ME: Introduce the key features, paying special attention to the non-code ones.  Tell us briefly how to find & use them, and describes the reasons behind the design decisions you made in their implementation.  

My HIIT app allows the user to create an exercise, load it into the timer, start the exercise, pause the exercise, save the workout and export their list of saved exercises as a CSV file. This allows the user to perform their desired workout in an interface that is minimal, clean and easy to use.

### Creating an exercise
To create an exercise, use the navigation bar at the top of the screen to select the 'Create' page. From this screen, the user is presented with 2 options. Create an exercise from a preset list in the dropdown menu (Burpees, Push-ups or Plank) or create your own custom exercise. To select a preset exercise, simply click to open the dropdown menu and select one of the options. The selected exercise will be automatically loaded into the database table 'exercises', and displayed on the screen for the user to see.

To create a custom exercise, enter the exercise name, duration in minutes and seconds, rest period in minutes and seconds, number of reps and a description. If not all these fields are filled, the exercise will not be created. To finalise the creation, press the 'Create Exercise' button below, and it will be loaded onto the screen and into the database following the same process as preset events.

### Loading an exercise 
Once an exercise has been created, it is now possible to select it and load it into the timer. Going to the 'Exercise' screen will display the created exercise(s), along with a timer and text that tells the user to select an exercise. By left clicking on one of the exercises, it will turn green to indicate that it has been selected. The duration of the exercise is then fetched and loaded into the timer- for example, after creating a 'Plank' exercise, which by default has a duration of 1 minute and 30 seconds, 1 minute and 30 seconds will apear in the correct fields of the timer. The name of the exercise appears at the top, and the start/pause button is enabled.

### Key Feature Name/Description.
Words words words.  Words words words.

### Key Another Feature Name/Description.
Words words.  Words words words.

Words words words words.  Words words words.

Words words words words words.  Words.

### Final Key Feature Name/Description.
Words.


## AI
REMOVE ME: Detail your use of AI, listing of the prompts you used, and whether the results formed or inspired part of your final submission and where we can see this (and if not, why not?). You may wish to group prompts into headings/sections - use markdown in any way that it helps you communicate your use of AI. 

### Prompts to develop XYZ (exmaple)
A sequence of prompts helped me develop this feature:

>  this is an example prompt given to a chatbot
The response was proved useless because the prompt wasn't specific enough about XYZ, so:

>  this is an example prompt given to a chatbot detailing XYZ
The response was better so I could speifically ask about QRST

>  how can I integrate QRST here?
The suggestion worked with minor modification.

### Prompts to develop GHIJ (exmaple)
For the GHIJ feature I ...

>  this is an example prompt given to a chatbot
words words words etc.
