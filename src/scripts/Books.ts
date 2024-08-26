import {getSetOrElse, set} from "./StorageHandler.ts";
import type {Task, Chapter, Book} from "./BookGenerator.ts";

// Some placeholders for certain situations
export const dummyTask : Task = {
    task: -1,
}

export const dummyChapter: Chapter = {
    fullname: "",
    number: -1,
    tasks: [dummyTask]
}

export const dummyBook: Book = {
    name: "",
    previewImagePath: "",
    source: "",
    chapters: [{
        fullname: "",
        number: -1,
        tasks: new Array()
    }],
    generatorVersion: "1.0.3",
    custom: false,
    id: "dummybook"
}

// Import the included books
import pgk1_2022 from '../content/tasks/introduktiontillprogrammeringmedscaladel1.json';
import pgk2_2022 from '../content/tasks/introduktiontillprogrammeringmedscaladel2.json';
import programmingInHaskell from '../content/tasks/programminginhaskellsecondedition.json';
import datakommunikationOchNatverk from '../content/tasks/datakommunikationochntverkandraupplagan.json';
import h99 from '../content/tasks/h99ninetyninehaskellproblems.json';

var library : Book[] = assembleLibrary();

/** Gathers the library again, useful for example when the personal library has changed */
export function refreshLibrary() {
    library = assembleLibrary();
}

export function setPersonalLibrary(library: Array<Book>) {
    set("personalLibrary", library);
}

export function getPersonalLibrary() {
    return getSetOrElse("personalLibrary", new Array<Book>);
}

/** Concatenates the built in library with the personal */
function assembleLibrary() {
    return [pgk1_2022, pgk2_2022, programmingInHaskell,datakommunikationOchNatverk,h99].concat(getPersonalLibrary());
}

/** Refreshes, then retrieves the library */
export function getLibrary() {
    refreshLibrary();
    return library;
}

/* In the default library */
export function indexOfBook(book: Book) : number {
    return indexOfBookByName(book.name);
}

export function indexOfBookByName(name: string) : number {
    refreshLibrary();
    return indexOfBookByNameIn(name,library);
}

export function indexOfBookById(id: string) : number {
    refreshLibrary();
    return indexOfBookByIdIn(id,library)
}

/**
 * @param book The book queried
 * @returns Whether the book is in the library
 */
export function libraryHas(book: Book): boolean {
    refreshLibrary();
    return libraryHasByName(book.name);
}

export function libraryHasId(id: string): boolean {
    refreshLibrary();
    return libraryHasIdIn(id,library);
}

export function libraryHasByName(name: string) : boolean {
    refreshLibrary();
    return libraryHasByNameIn(name,library);
}

/* In the personal library */
export function indexOfBookPersonal(book: Book) : number {
    return indexOfBookByName(book.name);
}

export function indexOfBookByNamePersonal(name: string) : number {
    return indexOfBookByNameIn(name,getPersonalLibrary());
}

export function indexOfBookByIdPersonal(id: string) : number {
    return indexOfBookByIdIn(id,getPersonalLibrary())
}

/**
 * @param book The book queried
 * @returns Whether the book is in the library
 */
export function libraryHasPersonal(book: Book): boolean {
    return libraryHasByName(book.name);
}

export function libraryHasIdPersonal(id: string): boolean {
    return libraryHasIdIn(id,getPersonalLibrary());
}

export function libraryHasByNamePersonal(name: string) : boolean {
    return libraryHasByNameIn(name,getPersonalLibrary());
}

/* Generic libraries */

export function indexOfBookIn(book: Book, library: Array<Book>) : number {
    return indexOfBookByNameIn(book.name,library);
}

export function indexOfBookByNameIn(name: string, library: Array<Book>) : number {
    return library.findIndex(book => book.name == name);
}

export function indexOfBookByIdIn(id: string, library: Array<Book>) : number {
    return library.findIndex(book => book.id == id);
}

/**
 * @param book The book queried
 * @returns Whether the book is in the library
 */
export function libraryHasIn(book: Book, library: Array<Book>): boolean {
    return libraryHasByNameIn(book.name,library);
}

export function libraryHasIdIn(id: string, library: Array<Book>): boolean {
    return indexOfBookByIdIn(id,library) != -1;
}

export function libraryHasByNameIn(name: string, library: Array<Book>) : boolean {
    return indexOfBookByNameIn(name,library) != -1;
}

/**
 * Retrieves a book from id
 * @param id The id of the book
 * @returns The book, if it is found, or just the first book
 */
export function getBook(id: string): Book {
    refreshLibrary();
    const indexOfBook = library.findIndex((book) => book.id == id);
    return indexOfBook == -1 ? library[0] : library[indexOfBook];
}

/**
 * @returns The whole memory of spent tasks
 */
function getSpentTasks() : Book[]{
    return getSetOrElse("spent", new Array<Book>); 
}

/**
 * @param book The book queried
 * @returns Wheter or not book is currently registered in the memory
 */
function spentIsEmptyFromBook(book: Book) : Boolean{
    return getSpentTasks().find((spentBook) => spentBook.id == book.id) == undefined;
}

/**
 * @param book The book queried
 * @returns The spent tasks corresponding the book
 */
export function getSpentTasksFromBook(book: Book) : Book{
    ensureBook(book);
    return getSpentTasks().find((spentBook) => spentBook.id == book.id)!;
}

/**
 * @param book The book which the chapter calls "home"
 * @param chapter The chapter queried
 * @returns The spent tasks from that chapter
 */
export function getSpentTasksFromChapter(book: Book, chapter: Chapter) : Task[]{
    ensureBook(book);
    return getSpentTasksFromBook(book)
    .chapters.find((spentChapter) => spentChapter.number == chapter.number)!
    .tasks;
}

/**
 * Ensures book exists
 * @param book The book being ensured
 */
function ensureBook(book: Book){
    if (spentIsEmptyFromBook(book)){ initBook(book);}
}

/**
 * Adds a new empty book
 * @param book The book added
 */
function initBook(book: Book){
    var emptiedChapters : Array<Chapter> = book.chapters.map((chapter) => {return {
        fullname: chapter.fullname,
        number: chapter.number,
        tasks: new Array<Task>
    }})
    setBook({
        name: book.name,
        previewImagePath: book.previewImagePath,
        source: book.source,
        chapters: emptiedChapters,
        generatorVersion: book.generatorVersion,
        custom: book.custom,
        id: book.id
    });
}

/**
 * Simply calls initBook(book) to reset the book, as initBook will override the book.
 * @param book The book to be reset
 */
export function resetSpentTasksFromBook(book: Book){ initBook(book);}


/**
 * Overwrites the memory for a book
 * @param book The book to be set
 */
function setBook(book: Book){
    var spentTasks: Book[] = getSpentTasks();
    const bookIndex = spentTasks.findIndex((spentBook) => spentBook.id == book.id);
    if (bookIndex == -1){
        spentTasks.push(book);
    } else {
        spentTasks[bookIndex] = book;
    }
    set("spent",spentTasks);
}

/**
 * Adds a task to the spent memory
 * @param book The book added to
 * @param chapter The chapter the task belongs to
 * @param task The task
 */
export function addSpentTaskToBook(book: Book, chapter: Chapter, task: Task){
    var spentTasks : Book = getSpentTasksFromBook(book);
    
    spentTasks.chapters.find((spentChapter) => spentChapter.number == chapter.number)!.tasks.push(task);

    setBook(spentTasks);
}


