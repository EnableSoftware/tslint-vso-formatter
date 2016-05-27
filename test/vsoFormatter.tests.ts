import {RuleFailure} from "tslint/lib/lint";
import {Formatter} from "../lib/vsoFormatter";
import * as ts from "typescript";
import * as assert from "assert";

describe("VSO Formatter", function() {
    describe("#format()", function() {
        let sourceFile: ts.SourceFile;
        let formatter: Formatter;

        before(function() {
            formatter = new Formatter();
            sourceFile = getSourceFile("test.ts", `class Greeter {
    constructor(public greeting: string) { }
    greet() {
        return "<h1>" + this.greeting + "</h1>";
    }
};

var greeter = new Greeter("Hello, world!");

document.body.innerHTML = greeter.greet();`);
        });

        it("handles no failures", function() {
            const result = formatter.format([]);
            assert.equal(result, "\n");
        });

        it("formats failure", function() {
            // Arrange
            const failure = new RuleFailure(sourceFile, 0, 1, "rule failure message", "rule-name");

            const expectedResult =
                "##vso[task.logissue type=warning;sourcepath=test.ts;linenumber=1;columnnumber=1;code=rule-name;]rule failure message\n";

            // Act
            const actualResult = formatter.format([failure]);

            // Assert
            assert.equal(actualResult, expectedResult);
        });

        it("formats multiple failures", function() {
            // Arrange
            const failures = [
                new RuleFailure(sourceFile, 0, 1, "first failure message", "first-name"),
                new RuleFailure(sourceFile, 32, 36, "second failure message", "second-name"),
                new RuleFailure(sourceFile, 236, 237, "last failure message", "last-name")
            ];

            const expectedResult =
`##vso[task.logissue type=warning;sourcepath=test.ts;linenumber=1;columnnumber=1;code=first-name;]first failure message
##vso[task.logissue type=warning;sourcepath=test.ts;linenumber=2;columnnumber=17;code=second-name;]second failure message
##vso[task.logissue type=warning;sourcepath=test.ts;linenumber=10;columnnumber=58;code=last-name;]last failure message
`; // Note the trainling new line.

            // Act
            const actualResult = formatter.format(failures);

            // Assert
            assert.equal(actualResult, expectedResult);
        });
    });

    function getSourceFile(fileName: string, source: string): ts.SourceFile {
        return ts.createSourceFile(fileName, source, ts.ScriptTarget.ES5, true);
    }
});
