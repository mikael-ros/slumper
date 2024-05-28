// This file is to be run locally.
import { writeFile } from 'fs/promises';
/**
 * Generates a book
 * @param input The book represented as a map of strings to chapter numbers
 * @param bookName The name of the book
 * @param bookPreviewImagePath The URL of the image used
 * @returns The book object
 */
export function generateBook(input: Map<string, number>, bookName: string, bookPreviewImagePath: string){
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
    const manssonlinalgBook = new Map<string,number>([
        ["Vektorer", 40],
        ["Vektorer som geometriska objekt", 39],
        ["Linjära ekvationssystem", 31],
        ["Matriser", 30],
        ["Några centrala begrepp inom linjär algebra", 35],
        ["Determinanter", 33],
        ["Linjära avbildningar", 18],
        ["Egenskaper hos linjära avbildningar", 28],
        ["Bas- och koordinatbyte", 10],
        ["Egenvektorer och egenvärden", 22],
        ["Diagonalisering", 16],
        ["Kapitel B", 32]
    ])

    const fmab20instuderingBook = new Map<string,number>([
        ["Linjära ekvationssystem", 2],
        ["Geometriska vektorer", 9],
        ["Linjer och plan", 11],
        ["Skalärprodukt", 12],
        ["Vektorprodukt", 6],
        ["Rummet R^n", 4],
        ["Matriser", 22],
        ["Linjära avbildningar", 10],
        ["Determinanter", 14],
        ["Egenvärden och egenvektorer", 4]
    ])

    const edaf052023Book = new Map<string,number>([["EDAF05 example questions 2023",40]]);

    const toGen = new Map([
        [edaf052023Book, ["EDAF05 example questions 2023", "/src/assets/previews/edaf052023.png"]],
        [fmab20instuderingBook, ["FMAB20: Instuderingsfrågor i Linjär algebra; ht 2011", "/src/assets/previews/fmab20instudering.png"]],
        [manssonlinalgBook, ["Linjär algebra (Månsson; Nordbeck)", "https://s1.adlibris.com/images/50965756/linjar-algebra.jpg"]]
    ])
    
    toGen.forEach((values, book) => writeBook(generateBook(book,values[0],values[1])))

}

generateDefaultLibrary();