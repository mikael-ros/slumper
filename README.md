# [🎲 Slumper](https://www.slumper.me)

***A web tool for randomizing and gameifying exercises from books.***

🎰 **Randomizer** :: A smart randomizer that can save completed tasks and avoid them.

⚙️ **Filters** :: Lets you filter which chapters you want included.

⏱️ **Timer** :: Allows you to keep yourself within time constraints.

🪄 **Custom books** :: Your book isn't in the included library? You can add it yourself in the meantime.

<a href='https://ko-fi.com/Z8Z212GZR6' target='_blank'><img height='60' style='border:0px;height:60px;' src='https://storage.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
> This website is upkept from my own pocket. Consider donating with the button above ^ :)

## 🔨 Usage

Simply visit [slumper.me](https://www.slumper.me) and pick any of the included books, or add your own.
> This website can also be run locally (see section on contributing), and will work the exact same way :) (just with different instances of localStorage)

### 🎰 Randomization
To randomize, simply hit the random button! (the first button) To mark a task as completed, and randomize a new one, press the "tick" button. To clear the task memory for the selected book, click the "trash can" icon.
### ⚙️ Filters
Select the chapters by toggling the corresponding boxes. When a chapter is exhausted, it will automatically be unchecked and greyed out until memory is cleared.
### ⏱️ Timer
If enabled, this will start every time you start a new task. The default time is 180 seconds (3 minutes), but you can set your own, between 1 and 3600 seconds (1 hour), which will be upheld until the page is refreshed. It will flash and play a sound when the time is elapsed.
### 🪄 Adding books
Click the "add" button next to the book selector. It will bring you to a different page where you can add the chapters of the book, or import a previously created book to edit it or duplicate it.

Add chapters by writing the chapter title and number of tasks, then click the ``+ Add entry`` button to add another chapter. If there are no tasks in a given chapter, you can simply set it to 0, and the randomizer will skip it. To remove a chapter, click the trash can icon next to it. 

When all entries have been added, simply press ``Save`` and the book will be added to your local browser storage, as reflected by the personal library tab. You can also choose to save the book to disk by pressing ``Export``.

Browser stored books are stored under the "Personal library" and can be managed from there. To edit a book, simply import it and make your changes, then save (it will overwrite as long as you don't change the title). You can also export it here, or completely remove it by clicking the "trashcan" icon.

> [!WARNING]
> As memory is stored solely in browser storage (``localStorage``) clearing your browser storage will reset any progress and remove any custom books. **It is therefore a good idea to export your books!**

#### ✉️ Submitting a book to the default list
> [!NOTE]
> After inquiring with the Swedish patent office [(PRV)](https://www.prv.se/sv/), it seems like I have to ask permission for every book added, hence why adding books wont be as simple as pull requests.

To submit a book to be considered as a default entry:
1. Check the banned books list, to see if it's banned
2. If not, submit an issue with the template ``Book suggestion`` and title as the book title. Do NOT include an exported book that you have made, as it might infringe copyright.

I will, given time, then contact the copyright holder myself and seek permission, and will respond wheter or not it got approved or not. If approved, I will then ask you to provide the generated book unless I also own a copy. If the copyright holders decline, it will go in the banned books list.

### 🔊 Changing the volume
You can change the volume of the sounds (on PC) by pressing the knob in the lower right corner. Then slide your mouse up and down to adjust. You can also adjust the volume with your keyboard, by using the following keybinds:

| Key | Action | 
|-----| ------ |
| ``+``, ``w`` or ``Arrow Up`` | Volume up (+) |
| ``-``, ``s`` or ``Arrow Down`` | Volume down (-) |
| ``m`` or ``0`` | Mute / unmute |
| ``[1-9]`` | Change volume to ``n * 10 %`` |
| ``x`` or ``Escape`` | Exit the volume dialog |


#### 💢 Troubleshooting
- 📤 ``"I tried to import a previously generated book, but it gave me an error"``: It is possible that the program has changed inbetween, which will unfortunately mean you have to regenerate the book. That, or you tried to import an invalid format.
- 🔄 ``"The page wont load"``: It is very likely something happened with your ``localStorage``. Please report it as a bug if possible, and then clear your memory by opening the development tools in your browser (usually ``F12``) and within it's console type ``localStorage.clear()`` and press enter. Reload. If it still doesn't load, please definitely report it.

#### ♿️ Accessibility
The site has been designed with those impaired in mind. This includes having made the site keyboard-navigable, and improving the experience for screen-readers. Likewise, colors and contrasts have been chosen to create a design legible even in grey-scale, easy for those with color-blindness of any type to use.

**Please feel free to [add an issue](https://www.github.com/mikael-ros/slumper/issues/new) with the "Accessibility" tag, if you feel your needs aren't accounted for. The goal is to create a site usable for everyone.**

---

## 🔮 How does it work?
This website uses books stored as JSON files. A book is just an object with ``title``, ``preview image``, ``source link``, ``chapters``, ``custom``, ``id``, and ``generator version`` (not actual variable names). The ``chapters`` field contains an array of chapter objects, which themselves consist of ``number``, ``full name`` and ``tasks``. Tasks is similarly just an array of task objects, which currently only hold the field ``task``, but could be expanded in the future to enable more content. ``id`` is just a string id, mostly used for memory management and is just the concatenation of the name and custom tag. The ``custom`` tag is just a boolean that indicated whether a book is a personal library item or not, and is used to identify custom books as well as handle conflicts. 

When a task is randomized, the script looks through any non-filtered chapters and checks whether their tasks are exhausted. It then picks a random chapter, and then a random task in that chapter.

The books provided are stored on server, but the memory of tasks is saved in ``localStorage`` as copies of the book. This is not particularly efficient, but prevents me from needing to have user accounts or similar as well as using other possibly more complicated storage solutions. It is not currently planned to replace this behavior as I doubt it will ever be an issue, and I lack the knowledge as of right now.

---
<details closed><summary><h2>🪚 Contributing</h2></summary>

> This website is made with the frameworks [Astro.js](https://astro.build/) and [Solid.js](https://www.solidjs.com/) and written mostly in TypeScript and HTML. In addition, only pure CSS is used, no Tailwind. The website is automatically built and deployed to [Netlify](https://www.netlify.com/). You may or may not need to be comfortable with these to work on this project. In depth documentation is not yet provided.

#### 🗒 If you cant work on the project, but have ideas
Add them to the [**list of issues**](https://www.github.com/mikael-ros/slumper/issues), perhaps by using the ``Feature suggestion`` template :)

#### 🗒 Things to work on
[**Check out the issues**](https://www.github.com/mikael-ros/slumper/issues) and pick any issue currently unassigned. Issued marked as ``good first issue`` are, like it says on the tin, good to start with.

#### 🧰 Prerequisites
- Node.js

#### ✅️ Recommended
*If you run into issues, I am easierly able to help you if you are using the following:*
- Linux
- Visual Studio Code
- Firefox or Chrome/Chromium

#### ✔️ Good-to-haves
- Lighthouse browser addon
- Some kind of screen reader
- Some kind of addon that allows you to simulate colorblindness (Firefox can do this natively)
- A couple devices and browsers to test compatability

### 🖥 Running the site locally
Simply run:
```sh
npx astro dev
npm install @astrojs/netlify
npm install @astrojs/solid-js
npx astro dev
```
And navigate to [localhost:4321](http://localhost:4321).

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

</details>
 
---

## 📚 Default library ✅️
These books are included with the site. The permission to use them has been granted explicitly (when relevant) by the respective authors on the date referenced in the ``Accepted`` column.

| Relevant courses @ LTH | Book title   | Author(s) | Accepted |
|------------------------| ------------ | ------ | -------- |
| EDAA45                 | [Introduktion till programmering med Scala, del 1](https://cs.lth.se/pgk/compendium/) | Björn Regnell | 2024-07-26 |
| EDAA45                 | [Introduktion till programmering med Scala, del 2](https://cs.lth.se/pgk/compendium/) | Björn Regnell | 2024-07-26 |
| EDAN40, EDAF95         | [Programming in Haskell, second edition](https://www.amazon.co.uk/Programming-Haskell-Graham-Hutton/dp/1316626229) | Graham Hutton | 2024-07-27 |
| EITF45         | [Datakommunikation och nätverk, andra upplagan](https://www.studentlitteratur.se/kurslitteratur/teknik/tele--och-datakommunikation/datakommunikation-och-natverk/?srsltid=AfmBOor6Qss-WlACmeqRhSWCGIEnTvrmREXMb-HaluoK0BmoB3LyzqIg) | Jens A. Andersson; Maria Kihl | 2024-08-04 |
| EDAN40, EDAF95         | [H-99: Ninety-Nine Haskell Problems](https://wiki.haskell.org/H-99:_Ninety-Nine_Haskell_Problems) | Haskell wiki contributors | Not relevant |

## 📚 Banned books 🚫
What follows is a list of books that will never be added to the default list of books, and the reason why. You can, however, add these yourself locally; I simply cannot, due to copyright issues, include them in the default list.

| Book title | Copyright holder(s) | Reason | Date of rejection |
| ---------- | ------ | ------ | ----- |
| Linjär algebra övningsbok | Jonas Månsson, Patrik Nordbeck | Declined by Månsson | 2024-03 |
