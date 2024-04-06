import manssonlinalg from '../content/tasks/manssonlinalg.json';

const manssonLinalg : Book = {
    name: "Linjär algebra",
    chapters: manssonlinalg
}

interface Task {
    task: number;
    section: string;
}

interface Chapter {
    fullname: string;
    number: number;
    tasks: Task[];
}

interface Book {
    name: string;
    chapters: Chapter[];
}

export function getRandomChapter(chapters: Chapter[], includedChapters : Set<number>){
    const filtered: Chapter[] = chapters.filter((chapter) => includedChapters.has(chapter.number));
    return filtered[Math.floor(Math.random() * filtered.length)]; // First gets a random chapter from the book
}

export function getRandomTaskInChapter(tasks: Task[], spentTasks: Set<number>){
    const filteredTasks: Task[] = tasks.filter((task) => !spentTasks.has(task.task));
    return filteredTasks[Math.floor(Math.random() * filteredTasks.length)]; // Then a random task in that chapter
}

class OutputCard extends HTMLElement {
    book: Book;
    currentChapter: Chapter;
    currentTask: Task;
    
    taskOutput: HTMLElement;
    chapterOutput: HTMLElement;
    randButton: HTMLElement;
    doneButton: HTMLElement;
    resetButton: HTMLElement;
    selector: HTMLElement;

    checkboxes: HTMLInputElement[];

    constructor () {
        super();
        
        this.taskOutput = this.querySelector('#output')!;
        this.chapterOutput = this.querySelector('#chapter')!;
        this.randButton = this.querySelector('#random')!;  
        this.doneButton = this.querySelector('#done')!;  
        this.resetButton = this.querySelector('#reset')!;
        this.selector = this.querySelector('#course-select')!;

        this.randButton.addEventListener("click", () => {this.getRandom(false)});
        this.doneButton.addEventListener("click", () => {this.getRandom(true)});
        this.resetButton.addEventListener("click", () => {localStorage.removeItem("spent"); this.getRandom(false)});

        this.checkboxes = [];
        this.book = manssonLinalg;
    
        this.book.chapters.forEach((chapter) => this.checkboxes.push(document.createElement("input")));
        this.checkboxes.forEach((checkbox) => {
            checkbox.setAttribute("type", "checkbox");
            checkbox.checked = true;
            this.appendChild(checkbox)
        });

        this.currentChapter = this.getRandomFilteredChapter();
        this.currentTask = this.getRandomTaskInCurrentChapter();
        this.displayTask();
    }

    getRandom(remember: boolean){
        if (remember) {this.addCurrentTaskToMemory()}

        this.currentChapter = this.getRandomFilteredChapter();
        this.currentTask = this.getRandomTaskInCurrentChapter();
        this.displayTask();
    }

    getRandomFilteredChapter(): Chapter{
        return getRandomChapter(this.book.chapters, this.getFilter());
    }

    getRandomTaskInCurrentChapter(): Task{
        const currentSpent : Book[] = (localStorage.getItem("spent") != null) 
        ? JSON.parse(localStorage.getItem("spent")!) : new Array<Book>();
        const indexOfBook : number = currentSpent.findIndex((book) => book.name == this.book.name);
        const bookSpent : Book = (indexOfBook > -1) ? currentSpent[indexOfBook] : {
            name: this.book.name,
            chapters: []
        };

        const indexOfChapter : number = bookSpent.chapters.findIndex((chapter) => chapter.number == this.currentChapter.number);
        const chapterSpent : Chapter = (indexOfChapter > -1) ? bookSpent.chapters[indexOfChapter] : {
            fullname: this.currentChapter.fullname,
            number: this.currentChapter.number,
            tasks: []
        }

        return getRandomTaskInChapter(this.currentChapter.tasks, this.getSpent(chapterSpent));
    }

    // Takes the checkboxes and returns an array of numbers, each checkbox corresponding to an index.
    getFilter(): Set<number>{
        return new Set(this.checkboxes.filter((box) => box.checked).map((box) => this.checkboxes.indexOf(box) + 1));
    }

    getSpent(chapter: Chapter){
        return new Set(chapter.tasks.map((task) => task.task));
    }

    displayTask(){
        this.taskOutput.textContent = this.currentChapter.number + "." + this.currentTask.task;
        this.chapterOutput.textContent = this.currentChapter.fullname;
    }

    addCurrentTaskToMemory(){
        const currentSpent : Book[] = (localStorage.getItem("spent") != null) 
        ? JSON.parse(localStorage.getItem("spent")!) : new Array<Book>();
        const indexOfBook : number = currentSpent.findIndex((book) => book.name == this.book.name);
        const bookSpent : Book = (indexOfBook > -1) ? currentSpent[indexOfBook] : {
            name: this.book.name,
            chapters: []
        };

        const indexOfChapter : number = bookSpent.chapters.findIndex((chapter) => chapter.number == this.currentChapter.number);
        const chapterSpent : Chapter = (indexOfChapter > -1) ? bookSpent.chapters[indexOfChapter] : {
            fullname: this.currentChapter.fullname,
            number: this.currentChapter.number,
            tasks: []
        }

        chapterSpent.tasks.push(this.currentTask);

        if (indexOfChapter > -1){
            bookSpent.chapters[indexOfChapter] = chapterSpent;
        } else {
            bookSpent.chapters.push(chapterSpent);
        }

        if (indexOfBook > -1){
            currentSpent[indexOfBook] = bookSpent;
        } else {
            currentSpent.push(bookSpent);
        }

        localStorage.setItem("spent", JSON.stringify(currentSpent));
    }
}

customElements.define('output-card', OutputCard);


