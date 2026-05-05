# The Pokémon App

Welcome back, Term 1 and Term 2 students!

Let us review the key concepts from COMP 1537, we’ll be building a Pokémon App. We will build a full-stack web application that lets users view and search for Pokémon. This app is built using Vanilla JavaScript, Express.js, and MongoDB, and it retrieves data from the PokeAPI.

## Features of the App:

- **Home Page**: Displays a list of Pokémon along with their images. The list can be searched, filtered, & sorted. The list should be paginated.
- **User Authentication**: Includes login and logout functionality. Registration should also be supported.
- **Timeline Page**: Shows a chronological list of user activities, such as login, logout, adding to favorites, and removing from favorites. Each entry includes a timestamp and can be deleted.
- **Favorites Management**: Allows users to add Pokémon to a favorites list, which is stored in the database. Users can also view and remove favorites from their list.
- **Admin Dashboard**: Admin users can view and manage all users. They can also delete users and edit user details.

Here is the grouping of all the user stories into **epics** for your Pokémon App project:

## **EPIC 1: Home Page Experience**

**Goal:** Allow users to explore Pokémon easily and intuitively from the homepage.

<!-- to be completed in A2 -->

User Stories:

1. As a user, I want to view a list of Pokémons on the home page, so that I can browse through them.
1. As a user, I want to search for Pokémon by name (case-insensitive) so that I can easily find the ones I'm interested in.
1. As a user, I want to filter the list of Pokémon by their type so that I can quickly narrow down the results based on my preference.
1. As a user, I want to sort the list of Pokémon by name or type so that I can organize the results in a way that makes sense to me.
1. As a user, I want to view a limited number of Pokémon per page and navigate between pages so that the list remains manageable and easy to browse.

Constraints:
[**New! Added on April the 26th**]

- The home page must be clean, user-friendly, and responsive across different screen sizes (desktop, tablet, and mobile), providing a polished and intuitive browsing experience.

## **EPIC 2: User Authentication & Account Management**

**Goal:** Enable secure user authentication and account settings.

<!-- to be completed A1 -->

User Stories:

1. As a user, I want the app to redirect me to the home page after I log in successfully, so that I can start using the app immediately.
1. As a user, I want to be redirected to the login page if I try to access protected pages without logging in, so that I understand access is restricted.
1. As a user, I want to stay logged in until I explicitly log out or close the browser (if I didn’t check “Remember Me”), so that my session behaves as expected.
1. As a user, I want to see a friendly error message if I enter the wrong password, so that I know to try again or reset it.
1. As a user, I want to see an error if the username I enter doesn’t exist, so that I know I need to register or correct it.
1. As a user, I want a “Remember Me” option on the login page, so that I don’t have to log in every time I visit the app from the same device.
1. As a user, I want to register for an account so that I can log in and use the app's features.
   <!-- 1. As a user, I want to receive visual confirmation (like a toast or banner) when I log in or log out, so that I know the action was successful. -->
   <!-- 1. As a user, I want to reset my password if I forget it so that I can regain access to my account. -->
   <!-- 1. As a user, I want to change my password so that I can keep my account secure. -->

Constraints:

- The login page should be user-friendly and visually appealing, with clear instructions and error messages.
- The passwords should be securely hashed and stored in the database. Use `bcrypt` for hashing passwords.
- Store session information persistently in the database or a file, so that it can be retrieved even after the server restarts.

## **EPIC 3: Favorites Management**

**Goal:** Let users save and manage their favorite Pokémons.

<!-- to be completed in A1 -->

User Stories:

1. As a user, I want to add Pokémons to my favorites, so that I can easily access the ones I like the most.
1. As a user, I want to view my list of favorite Pokémons, so that I can revisit them anytime.
1. As a user, I want to remove Pokémons from my favorites, so that I can update my list based on my preferences.

Constraints:

- The favorites list should be stored in the database and associated with the user’s account.
- Only logged-in users should be able to add, view, or remove favorites.
- The favorites list should be displayed in a user-friendly format, showing the Pokémon's name and image.
- The favorites list should be displayed on the home page.

## **EPIC 4: User Activity Timeline**

**Goal:** Help users track and manage their interactions within the app.

<!-- to be completed in A1 -->

User Stories:

1. As a user, I want to see a timeline of events (e.g., login, logout, add/delete favorite), so that I can keep track of my recent activity in the app.
1. As a user, I want to delete specific events from my timeline, so that I can manage or clean up my history.

Constraints:

- The timeline should display events in chronological order, with the most recent events at the top.
- Each event should include a timestamp and a brief description of the action taken.
- The timeline should be accessible only to logged-in users.

## **EPIC 5: Admin Dashboard**

**Goal:** Allow admin users to manage app data and maintain system integrity.

<!-- to be completed in A2 -->

User Stories:

1. As an admin, I want to view and manage all users so that I have a complete overview of the app's user base.
1. As an admin, I want to be able to delete users so that I can remove unwanted users.
1. As ad admin, I want to edit the details of a user so that I can update or correct information stored in the database.

Comments:

- There could be more than one admin user.
- Admins uses the same login page as regular users, but they have additional privileges once logged in.
