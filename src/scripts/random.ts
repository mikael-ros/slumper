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

export function getRandomTaskInChapter(chapter: Chapter){
    return chapter.tasks[Math.floor(Math.random() * chapter.tasks.length)]; // Then a random task in that chapter
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
        return getRandomTaskInChapter(this.currentChapter);
    }

    // Takes the checkboxes and returns an array of numbers, each checkbox corresponding to an index.
    getFilter(): Set<number>{
        return new Set(this.checkboxes.filter((box) => box.checked).map((box) => this.checkboxes.indexOf(box) + 1));
    }

    displayTask(){
        this.taskOutput.textContent = this.currentChapter.number + "." + this.currentTask.task;
        this.chapterOutput.textContent = this.currentChapter.fullname;
    }

    addCurrentTaskToMemory(){
        const currentSpent : Book[] = (localStorage.getItem("spent") != null) 
        ? JSON.parse(localStorage.getItem("spent")!) : new Array<Book>();
        const indexOfBook : number = currentSpent.findIndex((book) => book.name == this.book.name)
    }
}

customElements.define('output-card', OutputCard);


