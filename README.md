# 🎣 STOP CLICKBAIT

## Overview
“Stop Clickbait” is web app that reveals the content behind clickbait news titles. The goal is never to spoil content or maliciously strip away ad revenue but rather to illustrate that headlines and titles that respect a reader’s digital autonomy are a better way to generate clicks. Readers who have a high enough interest in headlines written with integrity are more likely to click on advertisers featured on the click through pages.   

![Home](https://github.com/Ivaylo-Georgiev/stop-clickbait/blob/update-readme/screenshots/1.PNG)

The idea is inspired by the Facebook page [Stop Clickait](https://www.facebook.com/StopClickBaitOfficial) 

## Technologies
**Back-end:** Node.js, Express.js, MongoDB, JWT  
**Front-end:** HTML, CSS, JavaScript  

## Features
### Detect Clickbait
To detect a clickbait, a user need not to be logged in or have an account. They should only enter a title of an article and then, based on artificial intelligence the system determines, whether it is a clickbait or not. This happens via a Naive Bayes classifier. The datasets, used for the classification contain of 16 000 clickbait and non-clickbait article titles. The source of the datasets can be found [here](https://github.com/bhargaviparanjape/clickbait/tree/master/dataset). To improve the accuracy of the algorithm, stopwords (e.g. 'a', 'the', etc.) need to be ignored for the classification. Since the precise definition of a stopword can be ambiguous, a list of stopwords in English is taken from the website [ranks.nl](https://www.ranks.nl/stopwords)  

A title, classified as clickbait:
![Clickbait-classified title](https://github.com/Ivaylo-Georgiev/stop-clickbait/blob/update-readme/screenshots/5.PNG)

A title, not classified as clickbait
![Non-clickbait-classified title](https://github.com/Ivaylo-Georgiev/stop-clickbait/blob/update-readme/screenshots/6.PNG)

### View Revealed Clickbait
All users can view revealed clickbait. The information, included for each article consists of a title, an image, a source (link to original article), number of votes and a short reveal, provided by a registered user of the system  
<img src="https://github.com/Ivaylo-Georgiev/stop-clickbait/blob/update-readme/screenshots/10.PNG" alt="Revealed clickbait" width="300px"/>  
![Feed](https://github.com/Ivaylo-Georgiev/stop-clickbait/blob/update-readme/screenshots/9.PNG)  

### Sort Revealed Clickbait 
Clickbait can be sorted by 2 criteria: 'Most Recent' and 'Votes'  
<img src="https://github.com/Ivaylo-Georgiev/stop-clickbait/blob/update-readme/screenshots/14.PNG" alt="Revealed clickbait" width="150px"/>

### Sign Up
To sign up, a user has to specify a unique username and a password for their account

### Log In
To log in, a user has to provide a valid combination of a username and a password for their account

### Reveal Clickbait
A logged user can reveal a clickbait, by providing a valid URL to the source and a short (70 characters or less) reveal in free text. The system automatically extracts the information it requires from the link - title, image, etc. Before publishing the newly revealed clickbait, a check against the internal clickbait detector is performed. If the detector classifies the input as a clickbait, the reveal is successful. If the input is classified as a non-clickbait, the user is prompted to verify manually that the truly is a clickbait
<img src="https://github.com/Ivaylo-Georgiev/stop-clickbait/blob/update-readme/screenshots/12.PNG" alt="User prompt" width="500px"/>

### Vote for a Clickbait
A logged user can vote for a revealed clickbait 

### Remove Revealed Clickbait
A logged user can delete a revealed clickbait, only if it is revealed by them. This happens in the profile section of the system
<img src="https://github.com/Ivaylo-Georgiev/stop-clickbait/blob/update-readme/screenshots/13.PNG" alt="Remove clickbait" width="300px"/>



