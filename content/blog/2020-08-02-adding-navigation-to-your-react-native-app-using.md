---
title: "Integrating Firebase to your React Native App"
slug: "adding-navigation-to-your-react-native-app-using"
date_published: 2020-08-02T00:00:00.000Z
date_updated: 2020-08-02T07:47:29.000Z
draft: true
---

**Firebase** is a package of backend services provided by google, that helps you get started with your app, be it a web app or a native app, fairly quickly. Firebase even provides a host of authentication features from simple email/password signup/logins to social logins, like facebook, twitter, etc. Firebase also provides services to handle forgot password and email notifications on signup. And I haven't even scratched the surface with the services mentioned so far. All in all Firebase is brilliant. You can read more about it on the [Firebase official website](https://firebase.google.com/).

### What to Expect in this article?

This article is a tutorial that will (hopefully) help you learn how to integrate Firebase into your existing React Native App. We'll cover topics such as user signup & authentication plus how to store and retrieve data from Firebase's Realtime Database. This tutorial will use the todo app created in this [article](https://techunderthesun.in/making-a-simple-todo-mobile-app-react-native/) as the base to start. If you don't want to read that long article, but yet would love to follow this one, simple grab the code from GitHub by running the following commands on your bash command line tool:

```bash
$ git clone https://github.com/shalomsam/RN-Todo-App.git
$ cd RN-Todo-App
$ git checkout version 1.0
```

## Let's Get Started

### 1. Setting up a Firebase Project.

First of you need to signup on firebase if you don't already have an account. Signup process is pretty simple especially if you have a google/gmail account. Once you are signed up you need create a new project. Navigate to your [Firebase Console](https://console.firebase.google.com/) and create a new project.
![](/content/images/2019/05/firebase-new-project-screenshot-2.png)Create a new Project on Firebase.
I have named my project as **React Native Todo App**, but feel free to name it as you'd like.

Next we will add the **babel-plugin-inline-dotenv** and **firebase** npm packages. Why do we need babel-plugin-inline-dotenv you ask? Good question, well thing is we are going to have to keep are API keys safe. We don't want to accidentally commit them to source control like git, nor do we want these api keys to be visible to anyone trying to decompile the apk or at the very least we shouldn't be making it easy. I'll show you in a bit how we can achieve this. First we'll run the follow commands on the command line:

```bash
$ npm i firebase --save
$ npm i babel-plugin-inline-dotenv --save-dev
```

Once the installation is done, we need to add "inline-dotenv" to the babel config in the `babel.config.js`, or which ever is your babel config file. `babel.config.js` for instance should look like this:

```js file=babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ["inline-dotenv"]
  };
};
```

Then we can grab our configuration details for firebase from the [Firebase console](https://console.firebase.google.com), by navigating to the homepage of the project, and clicking on the web `</>` button under the title "Get started by adding Firebase to your app":

![](/content/images/2019/05/test-1_-_Firebase_-_Firebase_console.png)

Click on the Web icon to Register your app.
Clicking on that button should show a screen that asks you to enter an app name to register. Enter a name of your choice and hit submit. Next you should see a bunch on configuration information like below:

![](/content/images/2019/05/test-1_-_Firebase_-_Firebase_console-1.png)

Firebase Configuration Details.
Notice the `firebaseConfig` in the above image? Grab all those Key/Value pair and copy paste them into a newly created file in root of the project called `.env` like so:

```env file=.env

FIREBASE_API_KEY="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
FIREBASE_AUTH_DOMAIN="something.firebaseapp.com"
FIREBASE_DB_URL="https://something.firebaseio.com"
FIREBASE_PROJECT_ID="some-project-id-for-app"
FIREBASE_STORAGE_BUCKET="something-project.someapp.com"
FIREBASE_MESSAGING_SENDER_ID="99999999999"
FIREBASE_APP_ID="XXXXXXXXXXXXXXXXXXXXXX"
```

### 2. Setting up Firebase in our React Native App.

Then we shall create some database files to handle the setting and retrieving of data from the database. These files will reside in a new directory `database` under the `src` directory. In the `src/database` directory let us add 3 new files, namely, `index.js`, `Database.js` and `Todos.js`. The `index.js` file will just export the contents of the `Todos.js` file: 

```jsx file=src/database/index.js    
export * from './Todos';
```
    

The `Database.js` file will act as the base file for every collection. Currently our app has only one collection, i.e. `Todos` list. The `Database.js` will be imported and extend by the collection classes. Thus this is where we will initialize our firebase app:

```jsx src/database/Database.js

import firebase from 'firebase';

export default class Database {
  constructor() {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DB_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    };

    this.app = firebase.initializeApp(firebaseConfig);
    this.database = this.app.database();
  }
}
```
    

Notice that we are fetching our **firebase config** values from `process.env`, this is the magic provided by **babel-plugin-inline-dotenv** that we installed earlier.

Now we can add code for `src/database/Todos.js`. Here we will simply import the previously created `Database.js` file and extend the `Todos` class with our `Database` class. Then we'll add methods to set and retrieve our Todos:

```jsx file=src/database/Todos.js

import Database from './Database';

class Todos extends Database {
  refKey = 'todos/';
  
  setTodos = (todos) => {
    this.database.ref(this.refKey).set(todos);
  }

  getTodos = async () => {
    const snapshot = await this.database.ref(this.refKey).once('value');

    if (snapshot.val() && snapshot.val().todos) {
      return snapshot.val().todos;
    }

    return null;
  }
}

export const todos = new Todos();
```

Now let's quickly spin it up on our device using expo, simply run the following command on your command line tool:

```bash
$ expo start
```

This will spin up the Metro bundler server on a port. You can simply scan the bar-code on your devices' Expo client app. This will open the app on your device. You can play around with the app and you'll also be able to see your **Firebase Real-time Database** update in real time :)
![](/content/images/2019/05/React_Native_Todo_App_-_Firebase_console.png)Watch the Firebase Magic!
Here if you notice we have only one list to maintain the todos being added by the user. This is not at all ideal this would mean all users see and edit the same Todo List. That's not what we want now, is it? Ideally this should be under a separate list per user. Also I'd like to make it such that the user could make multiple such todo lists, i.e. one for groceries, one for work, etc.

To achieve this we need be able to identify the user so we can identify his list. Thus, we need to add user authentication. Luckily for us Firebase enables us to integrate authentication with relative ease.

### 2. Integrating Authentication.

We will integrate a simple email/password based signup and login feature. For this we will first need to enable this service on the [Firebase Console](https://console.firebase.google.com/). Open the console and navigate to the "Authentication" link on the sidebar. On the resulting page, click on the "Sign-in Method" tab. Now you'll see a list of authentication methods supported by Firebase. Here we will enable email/password based authentication.
![](/content/images/2019/05/React_Native_Todo_App_-_Authentication_-_Firebase_console.png)Enable Email/Password based authentication on Firebase.
Now we need to add signup and login screens to our app. To manage these screens and the flow we will be using **React Navigation**.
