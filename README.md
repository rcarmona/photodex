# Photódex

This guide takes you through the steps necessary to create your own Photódex of AR snaps from Pokémon GO.

An example can be seen here: [http://jtatomico.photodex.io](http://jtatomico.photodex.io)

## Set up

### Step 1: Fork this repository and clone it locally

To create your own Photódex, you will need to have a a working knowledge of [Git](https://git-scm.com/) and a [GitHub](https://github.com/) account.

Fork the repository at [https://github.com/jamiehumphries/photodex](https://github.com/jamiehumphries/photodex) to your own account
(click **Fork** in the top right).

There should only be one branch, which is called `master`.

Clone the repository locally, to allow you to add your snaps.

### Step 2: Add and optimise your snaps

Photódex requires two different sizes of each of your AR snaps - a thumbnail and a gallery image.

For an example, see: [https://github.com/jamiehumphries/jtatomico.photodex.io/tree/gh-pages/snaps](https://github.com/jamiehumphries/jtatomico.photodex.io/tree/gh-pages/snaps)

#### 2.1: Add your snaps

The first step is to place a copy your AR snaps from Pokémon GO in to the `/snaps` directory.

The images need to be PNG files and the name needs to include the Pokémon's three digit
[Pokédex number](http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number)
with leading zeroes if necessary.

For example, an AR snap of Bulbasaur could be placed at `/snaps/001-Bulbasaur.PNG` or just `/snaps/001.png`.

#### 2.2: Convert and optimise snaps

From your original snaps, we now need to generate a thumbnail and a gallery image which are to be are placed in `/snaps/thumbs` and `/snaps/gallery`.

To do this:

* Install ImageMagick: [https://www.imagemagick.org/](https://www.imagemagick.org/)

* Install Node: [https://nodejs.org/](https://www.imagemagick.org/)

* From the project's root directory, run:

  ```
  npm install
  npm run snaps
  ```

Once you have confirmed that the images have indeed been converted and copied to `/snaps/thumbs` and `/snaps/gallery`, you can delete the original images in the root of `/snaps`. This is not necessary because Git ignores them, but it might keep things tidier.

#### 2.3: Testing locally

To test that your website is working, run:

```
npm start
```

You should then be able to see your Photódex running at: [http://localhost:8080](http://localhost:8080)

### Step 3: Publish your GitHub Pages site

Once you are happy that your local instance is working properly, you can now publish it as a GitHub Pages site.

Checkout a new branch at the head of `master` called `gh-pages`:

```
git checkout -b gh-pages
```

Commit all of you new snaps to this new branch:

```
git add snaps/
git commit -m "Add snaps."
```

Push this branch back to your GitHub repository.

```
git push -u origin gh-pages
```

If you now return to GitHub and check the **Settings** page of your `photodex` repository,
you should see under the **GitHub Pages** that your site has been deployed, e.g.:

> ✓ Your site is published at [https://jamiehumphries.github.io/photodex/](https://jamiehumphries.github.io/photodex/)

Click the link and check that you are happy with the published Photódex, before moving on to the final step.

### Step 4: Request a \*.photodex.io subdomain

Your Photódex is now live on the internet, so you could stop here! But if you would like your own subdomain on [photodex.io](http://www.photodex.io), then read on.

The subdomain you request must match your Pokémon GO username, e.g. the user **PikachuRox91** gets [pikachurox91.photodex.io]().

Add this as a custom domain for your GitHub Pages site by following the instructions [here](https://help.github.com/articles/adding-or-removing-a-custom-domain-for-your-github-pages-site/).

Finally, email
[jtatomico@gmail.com](mailto:jtatomico@gmail.com?subject=Phot%C3%B3dex%20subdomain&body=I%20would%20like%20to%20request%20a%20Phot%C3%B3dex%20subdomain.%0A%0AMy%20GitHub%20Pages%20site%20can%20be%20found%20here%3A%20%3Clink%20to%20your%20site%3E)
with a link to your GitHub Pages site (e.g. [https://jamiehumphries.github.io/photodex](https://jamiehumphries.github.io/photodex)) to request your subdomain registration.

I will let you know once the subdomain has been registered. Please note that the DNS update may take up to a day to filter through.

## Adding new snaps

When, in the future, you get a snap of a new Pokémon that you haven't yet registered to your Photódex, you can quickly add it in using these steps:

* Add the new `.png` snap to your `/snaps` directory.

* Re-run the NPM task to generate the thumbnail and gallery images:

  ```
  npm run snaps
  ```

* Make a new commit with these images on the `gh-pages` branch, e.g.:

  ```
  git checkout gh-pages
  git add snaps/
  git commit -m "Found Chansey!"
  ```

* Push this commit back to GitHub:

  ```
  git push origin gh-pages
  ```

GitHub will then republish your site and in a few moments you should be able to see your new snap online.

That should hopefully be all that you need to know! Happy hunting - **Gotta Snap 'Em All!**
