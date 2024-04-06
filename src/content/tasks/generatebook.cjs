"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("fs/promises");
function generateJSON(input, outputPath) {
    return __awaiter(this, void 0, void 0, function () {
        var chapters, currentIndex, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chapters = [];
                    currentIndex = 1;
                    input.forEach(function (length, chapter) {
                        var taskList = Array.from({ length: length }, function (_, i) { return i + 1; });
                        var processedTasks = [];
                        taskList.forEach(function (task) { return processedTasks.push({ task: task, section: "Undefined" }); });
                        var chapterObj = {
                            fullname: chapter,
                            number: currentIndex,
                            tasks: processedTasks
                        };
                        chapters.push(chapterObj);
                        currentIndex += 1;
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, promises_1.writeFile)(outputPath + ".json", JSON.stringify(chapters))];
                case 2:
                    _a.sent();
                    console.log('JSON file saved successfully:', outputPath);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error('Error writing JSON file:', err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.default = generateJSON;
var manssonlinalg = new Map();
manssonlinalg.set("Vektorer", 40);
manssonlinalg.set("Vektorer som geometriska objekt", 39);
manssonlinalg.set("Linjära ekvationssystem", 31);
manssonlinalg.set("Matriser", 30);
manssonlinalg.set("Några centrala begrepp inom linjär algebra", 35);
manssonlinalg.set("Determinanter", 33);
manssonlinalg.set("Linjära avbildningar", 18);
manssonlinalg.set("Egenskaper hos linjära avbildningar", 28);
manssonlinalg.set("Bas- och koordinatbyte", 10);
manssonlinalg.set("Egenvektorer och egenvärden", 22);
manssonlinalg.set("Diagonalisering", 16);
generateJSON(manssonlinalg, "manssonlinalg");
