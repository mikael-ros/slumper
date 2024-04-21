import { addSpentTaskToBook, getSpentTasksFromBook, getSpentTasksFromChapter, resetSpentTasksFromBook } from "./StorageHandler";

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

import manssonlinalg from '../content/tasks/manssonlinalg.json';
import fmab20instudering from '../content/tasks/fmab20instudering.json';

export const BOOKS : Book[] = [manssonlinalg, fmab20instudering];

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

    updateFilter(newDisclude: Set<Number>){
        this.disclude = newDisclude;
        this.filteredChapters = this.book.chapters.filter((chapter) => !this.disclude.has(chapter.number));
    }

    /**
     * Gets a new random task and chapter
     * @returns A new chapter and task
     */
    getNew(memorize: Boolean) : [Chapter, Task] {
        if (memorize){
            addSpentTaskToBook(this.book, this.currentChapter, this.currentTask);
        }
        const chapter: Chapter = this.getRandomChapter();
        return [chapter, this.getRandomTaskInChapter(chapter)];
    }

    getRandomChapter() : Chapter{
        return this.filteredChapters[Math.floor(Math.random() * this.filteredChapters.length)]; // First gets a random chapter from the book
    }

    getRandomTaskInChapter(chapter: Chapter) : Task{
        const spentTasksFromChapter = getSpentTasksFromChapter(this.book, chapter);
        const filteredTasks: Task[] = chapter.tasks.filter((task) => spentTasksFromChapter.find((spentTask) => spentTask.task == task.task) == undefined);
        return filteredTasks[Math.floor(Math.random() * filteredTasks.length)];
    }

    getSpentTasks() : Book {
        return getSpentTasksFromBook(this.book);
    }

    updateSpentTasks() {
        this.spentTasks = this.getSpentTasks();
    }

    resetSpentTasks() {
        resetSpentTasksFromBook(this.book);
        this.updateSpentTasks();
    }

    getTask() : Task {
        return this.currentTask;
    }

    getChapter() : Chapter {
        return this.currentChapter;
    }

}