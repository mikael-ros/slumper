import { addSpentTaskToBook, getSpentTasksFromBook, getSpentTasksFromChapter, resetSpentTasksFromBook } from "./SpentHandler";

export interface Task {
    task: number;
    section: string;
}

export interface Chapter {
    fullname: string;
    number: number;
    tasks: Task[];
}

export interface Book {
    name: string;
    previewImagePath: string;
    chapters: Chapter[];
}

export const dummyTask : Task = {
    task: -1,
    section: "No section"
}

export const dummyChapter: Chapter = {
    fullname: "No chapters left",
    number: -1,
    tasks: [dummyTask]
}


import manssonlinalg from '../content/tasks/manssonlinalg.json';
import fmab20instudering from '../content/tasks/fmab20instudering.json';
import edaf052023 from '../content/tasks/edaf052023.json';


export const BOOKS : Book[] = [manssonlinalg, fmab20instudering, edaf052023];

export function getBook(name: string): Book {
    const indexOfBook = BOOKS.findIndex((book) => book.name == name);
    return indexOfBook == -1 ? BOOKS[0] : BOOKS[indexOfBook];
}

export class Randomizer{
    book: Book;
    disclude: Set<Number> = new Set<Number>();
    spentTasks: Book;

    filteredChapters: Chapter[];

    currentChapter: Chapter;
    currentTask: Task;

    constructor(book: Book){
        this.book = book;
        this.filteredChapters = book.chapters;
        [this.currentChapter, this.currentTask] = this.getNew(false);
        this.spentTasks = this.getSpentTasks();
    }

    updateFilteredChapters(){
        this.filteredChapters = this.book.chapters.filter((chapter) => !this.disclude.has(chapter.number));
    }

    updateFilter(newDisclude: Set<Number>){
        this.disclude = newDisclude;
        this.updateFilteredChapters();
    }
    
    addToFilter(chapter: Chapter){
        this.updateFilter(this.disclude.add(chapter.number));
    }

    resetFilter(){
        this.updateFilter(new Set);
    }
    
    removeFromFilter(chapter: Chapter){
        this.disclude.delete(chapter.number)
        this.updateFilteredChapters();
    }

    /**
     * Gets a new random task and chapter
     * @returns A new chapter and task
     */
    getNew(memorize: Boolean) : [Chapter, Task] {
        if (memorize && this.currentTask != dummyTask){
            addSpentTaskToBook(this.book, this.currentChapter, this.currentTask);
        }
        const chapter: Chapter = this.getRandomChapter();
        return [chapter, this.getRandomTaskInChapter(chapter)];
    }

    setNew(memorize: Boolean) {
        [this.currentChapter, this.currentTask] = this.getNew(memorize);
    }

    getRandomChapter() : Chapter{
        return this.filteredChapters.length > 0 
        ? this.filteredChapters[Math.floor(Math.random() * this.filteredChapters.length)]
        : dummyChapter; // Return an empty dummy chapter when there are no chapters left (usually due to exhaustion)
    }

    getRandomTaskInChapter(chapter: Chapter) : Task{
        const spentTasksFromChapter = getSpentTasksFromChapter(this.book, chapter);
        if (this.chapterIsSpent(chapter)){
            this.addToFilter(chapter);
            return dummyTask;
        } else {
            const filteredTasks: Task[] = chapter.tasks.filter((task) => spentTasksFromChapter.find((spentTask) => spentTask.task == task.task) == undefined);
            return filteredTasks[Math.floor(Math.random() * filteredTasks.length)];
        }
    }

    chapterIsSpent(chapter: Chapter){
        const spentTasksFromChapter = getSpentTasksFromChapter(this.book, chapter);
        return spentTasksFromChapter.length == chapter.tasks.length;
    }

    getSpentTasks() : Book {
        return getSpentTasksFromBook(this.book);
    }

    updateSpentTasks() {
        this.spentTasks = this.getSpentTasks();
    }

    resetSpentTasks() {
        resetSpentTasksFromBook(this.book);
        this.resetFilter();
        this.updateSpentTasks();
    }

    getTask() : Task {
        return this.currentTask;
    }

    getChapter() : Chapter {
        return this.currentChapter;
    }

}