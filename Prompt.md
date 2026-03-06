# Democracy ELO

This website is for comparing the democracies of different countries. The idea is that the user is continously presented with two countries and they have to decide which country is more democratic out of the two. Then, we calculate their democracy index based on the ELO algorithm.

## Goal

The goal is to create a simple website in React where the users can cast their votes.

## Pages

The website should consist of only two pages:
* Index page - this will be the main page where the users can cast their votes.
* Statistics - this page will show the scores of all the countries.

The SVG flags of the countries can be found in the `flags` folder.

The `API.md` file contains the description of the backend API and its corresponding endoints.

### Index Page

Path: `/`

The `random_pair` function should be called to get a random pair of countries. The user should be presented with the flags of those two countries side by side. The flags can be found in the `flags` directory, with each of them named after the lower-case `id` of the given country. When the user hovers their mouse over any of the flags, the flags should expand a bit. The flags can be clicked, to cast their vote, whichever flag is clicked will be selected as the winner and the result will be sent to `select_winner`. Aside from these two options, there should be a third option with the label "Skip" in the bottom right corner.

The top of the page should contain a header with the text `Democracy ELO` that redirects you to the home page and a nav bar, with a `Statistics` button. Upon clicking that button, the `Statistics` page should be loaded.

### Statistics Page

Path: `/stats`

This page should list the countries and their corresponding ELO score. The data should be retrieved from the `countries` endpoint and it shuold be aggregated in a table. The table should contain the following columns: `flag` (this will contain an image of the country's flag which can be found in the `flags` directory based on the country's lower-case `id`), `name`, `elo`. These fields should be sortable. There should be a search bar on the top of the table where the users can search for a country based on its `name` field.