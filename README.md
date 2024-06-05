# 🎲 Slumper

***A web tool for randomizing and gameifying course exercises.***

🎰 **Randomizer** :: A smart randomizer that can save completed tasks and avoid them

⚙️ **Filters** :: Lets you filter chapters you want included

⏱️ **Timer** :: Allows you to time your performance, and set max time goals

## 🔨 Usage

Simply visit [slumper.me](https://www.slumper.me) and pick any of the pregenerated books, or add your own.

### 🎰 Randomization
To randomize, simply hit the random button! To mark a task as completed, and randomize, press the "tick" button. 

### ⚙️ Filters
Select the chapters by checking the corresponding boxes.
### ⏱️ Timer
Start the timer, stop it when finished. If you've set a maximum, and you hit it, a bell will ring.
### 📚 Adding books
Click the ``+`` button next to the book selector. It will bring you to a different page where you can add the chapters of the book, or import a previously generated book.

Add entries by writing the chapter title and number of tasks, then click the + button. To remove or ignore a chapter, click the x next to it.

You can also edit a previously generated book, by importing it. You can import from disk by clicking the ``Import`` button, or import from browser storage by clicking a similar button in your personal library.

When all entries have been added, simply press ``Save`` and the book will be added to your local browser storage, as reflected by the personal library tab. You can also choose to save the book to disk by pressing ``Export``.

Browser stored books are stored under the "Personal library" and can be managed from there. To edit a book, simply import it and make your changes, then save (it will overwrite as long as you don't change the title). You can also export it here, or completely remove it by clicking the "trashcan" icon.

#### ✉️ Submitting a book to the default list
> [!NOTE]
> As per contact with the Swedish patent office [(PRV)](https://www.prv.se/sv/), it seems like I have to ask permission for every book added, hence why adding books wont be as simple as pull requests.

To submit a book to be considered as a default:
1. Check the banned books list, to see if it's banned
2. If not banned, submit an issue with the tag ``book`` and title as the book title. The description should atleast contain the ISBN. Do NOT include an exported book.

I will, given time, then contact the copyright holder myself and seek permission, and will respond wheter or not it got approved or not. If approved, I will ask you to provide the generated book. If the copyright holders decline, it will go in the banned books list.

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

---

## 🔮 How does it work?
This website uses books stored as JSON files. A book is just an object with ``title``, ``preview image``, ``purchase link``, ``chapters`` and ``generator version`` (not actualy variable names). The ``chapters`` field contains an array of chapter objects, which themselves consist of ``number``, ``full name`` and ``tasks``. Tasks is similarly just an array of task objects, which currently only hold the field ``task``, but could be expanded in the future to enable more content.

The books provided are stored on server, but the memory of tasks is saved in ``localStorage`` as copies of the book. This is not particularly efficient, but prevents me from needing to have user accounts or similar as well as using other possibly more complicated storage solutions. It is not currently planned to replace this behavior as I doubt it will ever be an issue.

---
<details closed><summary><h2>🪚 Contributing</h2></summary>

> This website is made with the framework Astro.js and in the TypeScript language. In addition, only pure CSS is used, no Tailwind. You may or may not need to know these to work on this project. Documentation is not yet provided.

#### 🗒 If you cant work on the project, but have ideas
Add them to the [**list of issues**](https://www.github.com/mikael-ros/slumper/issues) :)

#### 🗒 Things to work on
[**Check out the issues**](https://www.github.com/mikael-ros/slumper/issues) and pick any issue currently unassigned. Issued marked as ``good first issue`` are, like it says on the tin, good to start with.

#### 🧰 Prerequisites
- Node.js and npm

### 🖥 Running the site locally
Simply run:
```sh
npx astro dev
```
And navigate to [localhost:4321](http://localhost:4321).

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
These books are included with the site.

| Course | Book title | Author | Date added |
|--------| ---------- | ------ | ---------- |
| Example | Example book | Me | 2024-06 |

## 📚 Banned books 🚫
What follows is a list of books that will never be added to the default list of books, and the reason why. You can, however, add these yourself locally; I simply cannot, due to copyright issues, include them in the default list.

| Book title | Copyright holder(s) | Reason | Date of rejection |
| ---------- | ------ | ------ | ----- |
| Linjär algebra övningsbok | Jonas Månsson, Patrik Nordbeck | Declined by Månsson | 2024-03 |