import type {Book, Chapter, Task} from "./BookGenerator.ts";
import {addSpentTaskToBook, getSpentTasksFromBook, getSpentTasksFromChapter, resetSpentTasksFromBook, dummyChapter, dummyTask} from "./Books.ts";

/**
 * Randomizes tasks from a book
 */
export class Randomizer{
    book: Book; // The book
    spentTasks: Book; // The corresponding spent tasks from the book
    disclude: Set<Number> = new Set<Number>(); // Which chapters to disclude from the process
    
    filteredChapters: Chapter[]; // The chapters included

    currentChapter: Chapter; // The currently displayed chapter
    currentTask: Task; // The currently displayed task

    constructor(book: Book){
        this.book = book;
        this.currentTask = dummyTask;
        this.currentChapter = dummyChapter;
        this.filteredChapters = book.chapters;
        this.updateFilteredChapters();
        [this.currentChapter, this.currentTask] = this.bookIsSpent() ? [dummyChapter, dummyTask] : this.getNew(false); // If the book is completely exhausted, display dummy tasks
        this.spentTasks = this.getSpentTasks();
    }

    /** Updates the filtered chapters based on disclude */
    updateFilteredChapters(){
        this.filteredChapters = this.book.chapters.filter((chapter) => !this.disclude.has(chapter.number));
    }

    /** Updates disclude, and then updates the filtered chapters */
    updateFilter(newDisclude: Set<Number>){
        this.disclude = newDisclude;
        this.updateFilteredChapters();
    }
    
    /** Discludes a chapter, and then updates the filter based on that */
    addToFilter(chapter: Chapter){
        this.updateFilter(this.disclude.add(chapter.number));
    }
    
    /** Removes a chapter from the disclusion list, and updates the filter */
    removeFromFilter(chapter: Chapter){
        this.disclude.delete(chapter.number)
        this.updateFilteredChapters();
    }

    toggleFilter(chapter: Chapter) {
        if (this.chapterIsFiltered(chapter)) {
            this.addToFilter(chapter);
        } else {
            this.removeFromFilter(chapter);
        }
    }

    /** Resets the disclude list, and updates the filter too */
    resetFilter(){
        this.updateFilter(new Set);
    }

    /** Sets what filters should be discluded based on browser storage, immideately */
    setInitialSpent(){
        this.book.chapters.forEach(chapter => {if (this.chapterIsSpent(chapter)) {this.addToFilter(chapter)}});
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

    /** Retrieve a new task, and set it */
    setNew(memorize: Boolean) {
        [this.currentChapter, this.currentTask] = this.getNew(memorize);
    }

    /** Gets a random chapter out of the available chapters */
    getRandomChapter() : Chapter{
        return this.filteredChapters.length > 0 
        ? this.filteredChapters[Math.floor(Math.random() * this.filteredChapters.length)]
        : this.currentChapter; // Don't change chapter if exhausted
    }

    /** Retrieves a random task from a chapter in the book */
    getRandomTaskInChapter(chapter: Chapter) : Task{
        const spentTasksFromChapter = getSpentTasksFromChapter(this.book, chapter);
        if (this.chapterIsSpent(chapter)){
            this.addToFilter(chapter);
            return dummyTask; // Return a dummy task if exhausted
        } else {
            const filteredTasks: Task[] = chapter.tasks.filter((task) => spentTasksFromChapter.find((spentTask) => spentTask.task == task.task) == undefined);
            return filteredTasks[Math.floor(Math.random() * filteredTasks.length)];
        }
    }

    /** Checks wheter the length of the corresponding chapter in spent memory is the same length, which would indicate there are no tasks left in said chapter */
    chapterIsSpent(chapter: Chapter){
        const spentTasksFromChapter = getSpentTasksFromChapter(this.book, chapter);
        return spentTasksFromChapter.length >= chapter.tasks.length;
    }

    /** Checks wether the chapter is filtered and is not in the discluded*/
    chapterIsFiltered(chapter: Chapter) : boolean {
        return !(this.filteredChapters.findIndex(_chapter => _chapter.number == chapter.number) == -1 
                || this.disclude.has(chapter.number));
    }

    /** Checks whether all chapters are spent, which would indicate the book being spent */
    bookIsSpent(){
        return this.book.chapters.every(chapter => this.chapterIsSpent(chapter));
    }

    /** Retrieves the spent tasks for the book. Doesn't do much more other than make retrieving them shorter */
    getSpentTasks() : Book {
        return getSpentTasksFromBook(this.book);
    }

    /** Retrieve new spent tasks */
    updateSpentTasks() {
        this.spentTasks = this.getSpentTasks();
    }

    /** Clear the memory, and update filters */
    resetSpentTasks() {
        resetSpentTasksFromBook(this.book);
        this.resetFilter();
        this.updateSpentTasks();
        this.setInitialSpent();
    }

    /** Retrieves the saved task */
    getTask() : Task {
        return this.currentTask;
    }

    /** Retrieves the saved chapter */
    getChapter() : Chapter {
        return this.currentChapter;
    }

}