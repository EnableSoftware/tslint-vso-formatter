# tslint-vso-formatter

A TSLint formatter for Visual Studio Online and Team Foundation Server.

This is a custom formatter for [TSLint](https://palantir.github.io/tslint/)
which uses Visual Studio Online and Team Foundation Server
[logging commands](https://github.com/Microsoft/vsts-tasks/blob/main/docs/authoring/commands.md)
to integrate the TSLint linting results with Visual Studio Online and Team 
Foundation Server build output.

# Usage

## CLI

The following example demonstrates how to use this `tslint-vso-formatter` with 
TSLint from the command line:

    node_modules/.bin/tslint --format tslint-vso-formatter filename.ts

Note that this assumes that both tslint and `tslint-vso-formatter` are available
in your local `node_modules` directory.

## Library

The following example demonstrates how consume TSLint as a library in your code,
using `tslint-vso-formatter`. This assumes that `tslint-vso-formatter` is
available to be `require`d, .e. that is has been placed with your application
`node_modules` directory.

    const Linter = require("tslint");

    const options = {
        formatter: "tslint-vso-formatter",
        configuration: {
            rules: {
                "variable-name": true,
                "quotemark": [true, "double"]
            }
        }
    };

    const contents = `class Greeter {
        constructor(public greeting: string) { }
        greet() {
            return '<h1>' + this.greeting + "</h1>";
        }
    };

    var greeter = new Greeter("Hello, world!");
        
    document.body.innerHTML = greeter.greet();`;

    const ll = new Linter("greeter.ts", contents, options);
    const result = ll.lint();

    console.log(result.output);
    // This will ouput:
    // ##vso[task.logissue type=warning;sourcepath=greeter.ts;linenumber=4;columnnumber=16;code=quotemark;]' should be "

