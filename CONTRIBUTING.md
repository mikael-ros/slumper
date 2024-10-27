## 🪚 Contributing

> This website is made with the frameworks [Astro.js](https://astro.build/) and [Solid.js](https://www.solidjs.com/) and written mostly in TypeScript and HTML. In addition, only pure CSS is used, no Tailwind. The website is automatically built and deployed to [Netlify](https://www.netlify.com/). You may or may not need to be comfortable with these to work on this project. In depth documentation is not yet provided.

#### 🗒 If you cant work on the project, but have ideas
Add them to the [**list of issues**](https://www.github.com/mikael-ros/slumper/issues), perhaps by using the ``Feature suggestion`` template :)

#### 🗒 Things to work on
[**Check out the issues**](https://www.github.com/mikael-ros/slumper/issues) and pick any issue currently unassigned. Issued marked as ``good first issue`` are, like it says on the tin, good to start with.

#### 🧰 Prerequisites
- Node
- Packages mentioned further down

#### ✅️ Recommended
*If you run into issues, I am easierly able to help you if you are using the following:*
- Linux / Windows 10/11
- Visual Studio Code w/ the [recommended extensions](.vscode/extensions.json) installed
- Firefox or Chrome/Chromium

#### ✔️ Good-to-haves
- Lighthouse browser addon
- Some kind of screen reader
- Some kind of addon that allows you to simulate colorblindness (Firefox can do this natively)
- A couple devices and browsers to test compatability, for example:
    - Linux, Windows, Android and or IOS
    - Phone and PC, maybe also a laptop or TV
    - The above, or BrowserStack (or a similar service)

### 🖥 Running the site locally
Simply run:
```sh
npx astro dev
npm install @astrojs/netlify
npm install @astrojs/solid-js
npm install @vitejs/plugin-legacy
npm install vite-plugin-top-level-await
npx astro dev
```
And navigate to [``localhost:4321``](http://localhost:4321).

You can optionally append ``--host`` to expose the site to your local network (useful when testing on other devices).

### 📚 Regenerating the default library
Change directory to ``/src/scripts/``:
```sh
cd /src/scripts/
```
And then modify the permissions:
```sh
chmod u+x generatedefaults.sh
```
Then run the script:
```sh
./generatedefaults.sh
```
It should then print a line for each successfully generated book.

To modify the included books, change the ``GenerateDefaults.ts`` file. Note that this also needs to be changed any time you change the book object format or generation behaviour (it has it's own copies of these, as I couldn't get it to run in terminal otherwise.).

#### Creating images
When creating the images available in this repository, for use as backgrounds, I go through the following process:
1. Download the cover from an official source
2. Load it onto [photopea](https://www.photopea.com)
3. Image -> Image size -> Set width to 500 px (if bigger than that), otherwise default
4. Filter -> Noise -> Median, 7px (or lower if image isn't bigger than 500 px width)
5. Save as .png and name same as .json file

This process is an attempt to "deface" the covers, such that noone would want to use them for further distrubution - protecting the rights of the copyright holders. You could use other methods. The important part is that it should remove any details whilst preserving colors and silhouettes.

> Do note that this is my first website of this nature, so a lot of code might not "make sense". Feel free to correct me, but keep that in mind when communicating.
