// This file is to be run locally. It is a workaround, since I had difficulties making the other code run in a terminal.

import { writeFile } from 'fs/promises';
/**
 * Generates a book
 * @param input The book represented as a map of strings to chapter numbers
 * @param bookName The name of the book
 * @param bookPreviewImagePath The URL of the image used
 * @param source Where you can acquire the book
 * @returns The book object
 */
export function generateBook(input: [string, number][], bookName: string, bookPreviewImagePath: string, source: string){
    const generatorVersion = "1.0.6";
    
    var parsedChapters: Chapter[] = [];

    const generatedBookPreviewImagePath = bookPreviewImagePath.length > 0 ? bookPreviewImagePath 
        : "https://slumper.me/.netlify/images?url=/previews/" + bookName.replaceAll(/[^a-zA-Z0-9]/g,"").toLowerCase() + ".png&width=300";

    input.forEach(chapter => { // For every chapter given
        var taskList: Task[] = Array.from({length: chapter[1]}, (_, i) => {return {task: i + 1}}); // Create an array of tasks

        var chapterObj: Chapter = {
            fullname: chapter[0],
            number: 0,
            tasks: taskList
        };
        parsedChapters.push(chapterObj);
    });
    parsedChapters.forEach(chapter => chapter.number = parsedChapters.indexOf(chapter) + 1); // Set the numbers based on index automatically 

    var book: Book =  {
        name: bookName,
        previewImagePath: generatedBookPreviewImagePath,
        source: source,
        chapters: parsedChapters,
        generatorVersion: generatorVersion,
        custom: false,
        id: bookName
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
    const PGK1_2022 : [string,number][] = [
        ["Introduktion", 37],
        ["Program och kontrollstrukturer", 18],
        ["Funktioner och abstraktion", 19],
        ["Objekt och inkapsling", 20],
        ["Klasser och datamodellering", 17],
        ["Mönster och felhantering", 22],
        ["Sekvenser och enumerationer", 27],
    ]

    const PGK2_2022 : [string,number][] = [
        ["Nästlade och generiska strukturer", 10],
        ["Mängder och tabeller", 14],
        ["Arv och komposition", 12],
        ["Kontextuella abstraktioner och varians", 9],
    ]

    const programmingInHaskell : [string,number][] = [
        ["Introduction", 5],
        ["First steps", 5],
        ["Types and classes", 5],
        ["Defining functions", 8],
        ["List comprehensions", 10],
        ["Recursive functions", 9],
        ["Higher-order functions", 10],
        ["Declaring types and classes", 9],
        ["The countdown problem", 6],
        ["Interactive programming", 6],
        ["Unbeatable tic-tac-toe", 4],
        ["Monads and more", 8],
        ["Monadic parsing", 9],
        ["Foldables and friends", 5],
        ["Lazy evaluation", 6],
        ["Reasoning about programs", 9],
        ["Calculating compilers", 1],
    ]

    const datakommunikationOchNatverk : [string,number][] = [
        ["Introduktion", 0],
        ["Information och bitar", 11],
        ["Att skicka signaler på en länk", 18],
        ["Tillförlitlig dataöverföring", 17],
        ["Access till nätet", 10],
        ["Stora datanät", 5],
        ["Internet", 10],
        ["Grunderna för routing", 4],
        ["Routingprotokoll", 3],
        ["Transportprotokoll", 9],
        ["Säker datakommunikation", 0],
        ["Applikationer", 0],
        ["Telekommunikationssystem", 0],
        ["Stamnät", 0],
        ["Internet of Things (IoT)",0],
        ["Prestanda och QoS", 6],
    ]

    const h99 : [string,number][] = [
        ["Lists",10],
        ["Lists, continued",10],
        ["Lists again",8],
        ["Arithmetic",11],
        ["Logic and codes",5],
        ["Binary trees",7],
        ["Binary trees, continued",9],
        ["Multiway trees",4],
        ["Graphs",10],
        ["Miscellaneous problems",5],
        ["Miscellaneous problems, continued",5],
    ]

    const reglerteknikKompendie : [string,number][] = [
        ["Modellering och linjärisering",9],
        ["Dynamiska system",16],
        ["Frekvensanalys",7],
        ["Återkopplade system",19],
        ["Tillståndsåterkoppling och Kalmanfiltrering",13],
        ["Designmetoder",16],
        ["Regulatorstrukturer",10],
        ["Några designexempel",2],
        ["Interaktiv jämförelse mellan modellbeskrivningar",3]
    ]

    const automaticcontrolCompendium : [string,number][] = [
        ["Model Building and Linearization",9],
        ["Dynamical Systems",16],
        ["Frequency Analysis",7],
        ["Feedback Systems",19],
        ["State Feedback and Kalman Filtering",13],
        ["Design methods",16],
        ["Controller Structures",10],
        ["Design Examples",2],
        ["Interactive Comparison Between Model Descriptions",3]
    ]

    const computerOrganizationRISCV : [string,number][] = [
        ["Computer Abstractions and Technology",15],
        ["Instructions",42],
        ["Arithmetic for Computers",47],
        ["The Processor",33],
        ["Large and Fast",29],
        ["Parallel Processors from Client to Cloud",20],
        ["Appendix A: The Basics of Logic Design",44],
        ["Appendix B: Graphics and Computing GPUs",0],
        ["Appendix C: Mapping Control to Hardware",6],
        ["Appendix D: A Survey of RISC Architectures for Desktop, Server, and Embedded Computers",0]
    ]

    const toGen = new Map<[string,number][], string[]>([
        [PGK1_2022, 
            [
                "Introduktion till programmering med Scala, del 1", 
                "", 
                "https://cs.lth.se/pgk/compendium/"
            ]
        ],
        [PGK2_2022, 
            [
                "Introduktion till programmering med Scala, del 2", 
                "", 
                "https://cs.lth.se/pgk/compendium/"
            ]
        ],
        [programmingInHaskell, 
            [
                "Programming in Haskell, second edition", 
                "", 
                "https://www.amazon.co.uk/Programming-Haskell-Graham-Hutton/dp/1316626229"
            ]
        ],
        [datakommunikationOchNatverk,
            [
                "Datakommunikation och nätverk, andra upplagan",
                "",
                "https://www.studentlitteratur.se/kurslitteratur/teknik/tele--och-datakommunikation/datakommunikation-och-natverk/?srsltid=AfmBOor6Qss-WlACmeqRhSWCGIEnTvrmREXMb-HaluoK0BmoB3LyzqIg"
            ]
        ],
        [h99,
            [
                "H-99: Ninety-Nine Haskell Problems",
                "",
                "https://wiki.haskell.org/H-99:_Ninety-Nine_Haskell_Problems"
            ]
        ],
        [reglerteknikKompendie,
            [
                "Reglerteknik AK Övningsexempel 2022",
                "",
                "https://control.lth.se/fileadmin/control/Education/EngineeringProgram/FRTF05/exempelsamling_print.pdf"
            ]
        ],
        [automaticcontrolCompendium,
            [
                "Automatic Control Basic Course Exercises 2022",
                "",
                "https://control.lth.se/fileadmin/control/Education/EngineeringProgram/FRTF05/exercises_print.pdf"
            ]
        ],
        [computerOrganizationRISCV,
            [
                "Computer Organization and Design RISC-V Edition 2017",
                "",
                "https://shop.elsevier.com/books/computer-organization-and-design-risc-v-edition/patterson/978-0-12-812275-4"
            ]
        ]
    ])
    
    toGen.forEach((values, book) => writeBook(generateBook(book,values[0],values[1], values[2])))

}

generateDefaultLibrary();