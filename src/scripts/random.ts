import FMAB20 from '../content/tasks/manssonlinalg.json';

export function getRandomChapter(includedChapters : number[]){
    var filtered = FMAB20.filter((chapter) => includedChapters.indexOf(chapter.chapter.number) > -1);
    return filtered[Math.floor(Math.random() * filtered.length)]; // First gets a random chapter from the book
}

export function getRandomTaskInChapter(chapter: any){
    var currentSpent : CourseMemory[] = (localStorage.getItem("spent") != null) ? JSON.parse(localStorage.getItem("spent")!) : new Array<CourseMemory>();
    var indexOfCourse : number = currentSpent.findIndex((course) => course.course == "FMAB20");
    var courseSpent : TaskMemory[] = (indexOfCourse > -1) ? currentSpent[indexOfCourse].tasks : new Array<TaskMemory>();
    var spentFromChapter = courseSpent.filter((taskmemory) => taskmemory.task.chapter == chapter.chapter.number).map((taskmemory) => taskmemory.task.task);
    var unspentFromChapter: any[] = chapter.tasks.filter((task) => !(spentFromChapter.indexOf(task.task) > -1));
    return unspentFromChapter[Math.floor(Math.random() * unspentFromChapter.length)]; // Then a random task in that chapter
}

interface Task {
    chapter: number;
    task: number;
}

interface TaskMemory{
    timestamp: string,
    task: Task
}

interface CourseMemory{
    course: string,
    tasks: TaskMemory[]
}

class OutputCard extends HTMLElement {
    course: string;
    
    taskOutput: HTMLElement;
    chapterOutput: HTMLElement;
    randButton: HTMLElement;
    doneButton: HTMLElement;
    resetButton: HTMLElement;
    selector: HTMLElement;

    checkboxes: HTMLInputElement[];


    constructor () {
        super();
        this.course = "No course selected";

        this.taskOutput = this.querySelector('#output')!;
        this.chapterOutput = this.querySelector('#chapter')!;
        this.randButton = this.querySelector('#random')!;  
        this.doneButton = this.querySelector('#done')!;  
        this.resetButton = this.querySelector('#reset')!;
        this.selector = this.querySelector('#course-select')!;
        this.course = this.selector.value;

        this.randButton.addEventListener("click", () => {this.getRandom(false)});
        this.doneButton.addEventListener("click", () => {this.getRandom(true)});
        this.resetButton.addEventListener("click", () => {localStorage.removeItem("spent"); this.getRandom(false)});

        this.checkboxes = [];

        FMAB20.forEach((chapter) => this.checkboxes.push(document.createElement("input")));
        this.checkboxes.forEach((checkbox) => {
            checkbox.setAttribute("type", "checkbox");
            checkbox.checked = true;
            this.appendChild(checkbox)
        });
        this.getRandom(false);
    }

    getRandom(remember: boolean){
        var currentChapter = getRandomChapter(this.checkboxes.filter((box) => box.checked).map((box) => this.checkboxes.indexOf(box) + 1));
        var currentTask = getRandomTaskInChapter(currentChapter);

        this.taskOutput.textContent = currentChapter.chapter.number + "." + currentTask.task;
        this.chapterOutput.textContent = currentChapter.chapter.fullname;
        
        if (remember){
            var task : TaskMemory = {
                timestamp: Date(),
                task: {
                    chapter: currentChapter.chapter.number,
                    task: currentTask.task
                }
            }

            var currentSpent : CourseMemory[] = (localStorage.getItem("spent") != null) ? JSON.parse(localStorage.getItem("spent")!) : new Array<CourseMemory>();
            var indexOfCourse : number = currentSpent.findIndex((course) => course.course == this.course);
            var courseSpent : TaskMemory[] = (indexOfCourse > -1) ? currentSpent[indexOfCourse].tasks : new Array<TaskMemory>();

            courseSpent.push(task);
            if (indexOfCourse > -1){
                currentSpent[indexOfCourse].tasks = courseSpent;
            } else {
                currentSpent.push({
                    course: this.course,
                    tasks: courseSpent
                });
            }
            localStorage.setItem("spent", JSON.stringify(currentSpent));
        }
        

    }
}

customElements.define('output-card', OutputCard);


