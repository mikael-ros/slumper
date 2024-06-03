// This file is to be run locally.
import { writeFile } from 'fs/promises';
/**
 * Generates a book
 * @param input The book represented as a map of strings to chapter numbers
 * @param bookName The name of the book
 * @param bookPreviewImagePath The URL of the image used
 * @returns The book object
 */
export function generateBook(input: Map<string, number>, bookName: string, bookPreviewImagePath: string, source: string){
    var parsedChapters: Chapter[] = [];
    var currentIndex = 1;
    input.forEach((length, chapter) => {
        var taskList: number[] = Array.from({length: length}, (_, i) => i + 1);
        var processedTasks: Task[] = [];

        taskList.forEach((task) => processedTasks.push({task: task}));
        var chapterObj: Chapter = {
            fullname: chapter,
            number: currentIndex,
            tasks: processedTasks
        };
        parsedChapters.push(chapterObj);
        currentIndex += 1;
    });

    var book: Book =  {
        name: bookName,
        previewImagePath: bookPreviewImagePath,
        source: source,
        chapters: parsedChapters
    }
    return book;
}

export interface Task {
    task: number;
}

export interface Chapter {
    fullname: string;
    number: number;
    tasks: Task[];
}

export interface Book {
    name: string;
    previewImagePath: string;
    source: string;
    chapters: Chapter[];
}

async function writeBook(book: Book){
    try {
        await writeFile("../content/tasks/" + book.name.replaceAll(/[^a-zA-Z]/g,"").toLowerCase()+".json", JSON.stringify(book));
        console.log('JSON file saved successfully:', book.name);
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
}

export default async function generateDefaultLibrary(){
    const exampleBook = new Map<string,number>([
        ["A very interesting chapter", 20],
        ["Must read", 15],
        ["Ramblings and other essentials", 30],
        ["The most interesting chapter", 30],
        ["The least interesting chapter", 35],
    ])

    const toGen = new Map([
        [exampleBook, ["Example book", "/src/assets/previews/example-book-preview", "https://github.com/mikael-ros/slumper"]],
    ])
    
    toGen.forEach((values, book) => writeBook(generateBook(book,values[0],values[1], values[2])))

}

generateDefaultLibrary();