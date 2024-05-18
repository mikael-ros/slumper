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
Select the chapters by checking the boxes
### ⏱️ Timer
Start the timer, stop it when finished. If you've set a maximum, and you hit it, a bell will ring.
### 📚 Adding books
Click the ``+`` button next to the book selector. It will bring you to a different page where you can add the chapters of the book, or import a previously generated book.

Add entries by writing the chapter title and number of tasks, then either press enter or click the + button. To remove or ignore a chapter, leave the amount of tasks at 0 (and the parser will simply skip it).

When all entries have been added, simply press ``Save`` and the book will be added to your local browser storage. You can also choose to save the book to disk by pressing ``Export``.

#### ✉️ Submitting a book to the default list
> [!NOTE]
> As per contact with the Swedish patent office [(PRV)](https://www.prv.se/sv/), it seems like I have to ask permission for every book added, hence why adding books wont be as simple as pull requests.

To submit a book to be considered as a default:
1. Check the banned books list, to see if it's banned
2. If not banned, submit an issue with the tag ``book`` and title as the book title. The description should atleast contain the ISBN. Do NOT include an exported book.

I will, given time, then contact the copyright holder myself and seek permission, and will respond wheter or not it got approved or not. If approved, I will ask you to provide the generated book. If the copyright holders decline, it will go in the banned books list.

#### ‼️ Troubleshooting
- 📤 ``"I tried to import a previously generated book, but it gave me an error"``: It is possible that the program has changed inbetween, which will unfortunately mean you have to regenerate the book.

---

<details closed><summary><h2>🪚 Contributing</h2></summary>

> This website is made with the framework Astro.js and in the TypeScript language. In addition, only pure CSS is used, no Tailwind. You may or may not need to know these to work on this project.

#### 🗒 If you cant work on the project, but have ideas
Add them to the [**list of issues**](https://www.github.com/mikael-ros/slumper/issues) :)

#### 🗒 Things to work on
[**Check out the issues**](https://www.github.com/mikael-ros/slumper/issues) and pick any issue currently unassigned. Issued marked as ``good first issue`` are, like it says on the tin, good to start with.

#### 🧰 Prerequisites
- Node.js and npm
- Visual Studio Code or VSCodium

### 🖥 Running the site locally
Simply run:
```sh
npx astro dev
```
And navigate to [localhost:4321](http://localhost:4321).

</details>
 
---

## 📚 Banned books 🚫
What follows is a list of books that will never be added to the default list of books, and the reason why. You can, however, add these yourself locally; I simply cannot, due to copyright issues, include them in the default list.

| Book title | Copyright holder(s) | Reason |
| ---------- | ------ | ------ |
| Linjär algebra övningsbok | Jonas Månsson, Patrik Nordbeck | Declined by Månsson |