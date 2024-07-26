// This file is to be run locally.
import { writeFile } from 'fs/promises';
/**
 * Generates a book
 * @param input The book represented as a map of strings to chapter numbers
 * @param bookName The name of the book
 * @param bookPreviewImagePath The URL of the image used
 * @param source Where you can acquire the book
 * @returns The book object
 */
export function generateBook(input: Map<string, number>, bookName: string, bookPreviewImagePath: string, source: string){
    const generatorVersion = "1.0.3";
    
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
        chapters: parsedChapters,
        generatorVersion: generatorVersion,
        custom: false,
        id: bookName + ":" + false
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
    generatorVersion: string;
    custom: boolean;
    id: string;
}

async function writeBook(book: Book){
    try {
        await writeFile("../content/tasks/" + book.name.replaceAll(/[^a-zA-Z0-9]/g,"").toLowerCase()+".json", JSON.stringify(book));
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

    const PGK1_2022 = new Map<string,number>([
        ["Introduktion", 37],
        ["Program och kontrollstrukturer", 18],
        ["Funktioner och abstraktion", 19],
        ["Objekt och inkapsling", 20],
        ["Klasser och datamodellering", 17],
        ["Mönster och felhantering", 22],
        ["Sekvenser och enumerationer", 27],
    ]) 

    const PGK2_2022 = new Map<string,number>([
        ["Nästlade och generiska strukturer", 10],
        ["Mängder och tabeller", 14],
        ["Arv och komposition", 12],
        ["Kontextuella abstraktioner och varians", 9],
    ]) 

    const toGen = new Map([
        [exampleBook, 
            ["Example book", 
            "https://raw.githubusercontent.com/mikael-ros/slumper/main/src/assets/previews/example-book-preview.png", 
            "https://github.com/mikael-ros/slumper"]
        ],
        [PGK1_2022, 
            ["Introduktion till programmering med Scala, del 1", 
            "https://github.com/lunduniversity/introprog/blob/master/img/compendium-cover-part1-2022.png?raw=true", 
            "https://cs.lth.se/pgk/compendium/"]
        ],
        [PGK2_2022, 
            ["Introduktion till programmering med Scala, del 2", 
            "https://github.com/lunduniversity/introprog/blob/master/img/compendium-cover-part2-2022.png?raw=true", 
            "https://cs.lth.se/pgk/compendium/"]
        ],
    ])
    
    toGen.forEach((values, book) => writeBook(generateBook(book,values[0],values[1], values[2])))

}

generateDefaultLibrary();