# 🎲 Slumper

***A web tool for randomizing and gameifying course exercises.***

🎰 **Randomizer** :: A smart randomizer that can save completed tasks and avoid them

⚙️ **Filters** :: Lets you filter chapters you want included

⏱️ **Timer** :: Allows you to time your performance, and set max time goals

## 🔨 Usage

Simply visit [slumper.me](https://www.slumper.me).

### 🎰 Randomization
To randomize, simply hit the random button!
### ⚙️ Filters
Select the chapters by checking the boxes
### ⏱️ Timer
Start the timer, stop it when finished. If you've set a maximum, and you hit it, a bell will ring.

---

<details closed><summary><h2>🪚 Contributing</h2></summary>

> This website is made with the framework Astro.js and in the TypeScript language. In addition, only pure CSS is used. You may or may not need to know these to work on this project.

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
npm run dev
```
And navigate to [localhost:4321](http://localhost:4321).

### ✨️ Adding courses

> Please **do not add the contents of any book**, only the task lists and chapter headings. Any addition made including copyrighted material will be rejected unless you have solid proof of permission from the authors and publishers.

Courses are added in a fairly simple manner.

1. Install prequisites
2. **Clone** this repo
3. Add an issue for your chapter, **create a development branch** and switch to it
4. In the branch, **change [``src/content/tasks/generatebook.ts``](src/content/tasks/generatebook.ts) to match your book**
5. **Generate the JSON** by, while in the ``src/content/tasks`` directory, running the ``./generatebook`` script (you might need to run ``chmod u+x generatebook.sh`` first)
6. Add the entry in [``src/scripts/random.ts``](src/scripts/random.ts), by importing it, creating a ``Book`` object and registering it in the list.
7. Push it and submit a **pull request**

</details>
 
---

# ⚠️ Notice
This project **does not use any copyrighted material**. The user has to own the book to use the website. 