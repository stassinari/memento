# Memento

Memento is a SPA (Single Page Application) that helps you keep track of everything coffee.

_Short description_

## Decent Espresso integration

If you're lucky enough to own a Decent Espresso machine, there is a handy plugin that lets you automatically upload your shots as soon as they finish.

The way it works is heavily borrowed from the amazing [Decent Visualizer](https://github.com/miharekar/decent-visualizer), so, when everything is properly set up, you'll see a new espresso pop up as soon as the machine finishes a shot.

The end result will look something like this:

<img src="docs/decent-graph.png" width=512 />

In order to have the integration running, follow theses steps:

On Memento:

1. (Prerequisite) Sign up as a registered user (it won't work for guest users)
2. Navigate to your **Account** page and genereate a "secret key"
3. You're going to need both your secret and your email (on the same page for easy copy/pasting) 

From this repo:

3. Download the [`plugin.tcl` file](external/decent/memento_uploader/plugin.tcl) to your computer
4. (Optional) Download the [`settings.tdb` file](external/decent/memento_uploader/settings.tdb) to your computer. If you skip this step, you're going to have to enter your email and secret manually from the tablet
   - Open the `settings.tdb` file with any text editor and replace `memento_username` and `memento_password` with your email and secret respectively

On your tablet running the Decent app:

5. Create a folder called `memento_uploader` in the `plugins` folder inside of `de1plus`
6. Transfer the `plugin.tcl` (and optionally the `settings.tdb`) to the above folder
7. Navigate to the *Extensions* page on the Decent app and enable the "Upload to Memento" extension
8. If you transfered the `settings.tdb` file, you're all set! If you haven't, open the settings page for the extension and enter you email and secret key