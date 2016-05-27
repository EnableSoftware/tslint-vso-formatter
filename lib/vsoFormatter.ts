import * as Lint from "tslint/lib/lint";

export class Formatter extends Lint.Formatters.AbstractFormatter {
    public format(failures: Lint.RuleFailure[]): string {
        const output  = failures.map((failure: Lint.RuleFailure) => {
            const fileName = failure.getFileName();
            const failureString = failure.getFailure();
            const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
            const line = lineAndCharacter.line + 1;
            const character = lineAndCharacter.character + 1;
            const code = (failure.getRuleName ? failure.getRuleName() : "");
            const properties = `sourcepath=${fileName};linenumber=${line};columnnumber=${character};code=${code};`;

            return `##vso[task.logissue type=warning;${properties}]${failureString}`;
        });

        return output.join("\n") + "\n";
    }
}
