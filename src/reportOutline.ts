import * as vscode from 'vscode';

export class ReportOutlineProvider implements vscode.DocumentSymbolProvider {
    
    private text: string;
	private editor: vscode.TextEditor;
    private routinePattern: RegExp;
    private symbols: vscode.DocumentSymbol[];

    constructor() {
        console.time("executionTime"); 
        this.routinePattern = /(?<!END)((?<global>global|GLOBAL)\s+)?(routine|ROUTINE)\s+(?<routineName>[a-z_]*)(\s*\((\s*(VALUE)?\s*[a-z_]+\s*,?)*\))?/g;
	}

    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[]> {
        return new Promise((resolve, reject) => 
        {
            this.symbols = [];

            this.text = document.getText();

            this.parseDocument();

            resolve(this.symbols);
        });
    }

    private parseDocument(): void {
        console.timeLog("executionTime", "\tparsing document");
        const regex = new RegExp(this.routinePattern);
        let matches: RegExpExecArray;
        while ((matches = regex.exec(this.text)) !== null) {
            let selectionStart = matches.index;
            let global = matches.groups.global;
            let selectionEnd = regex.lastIndex;
            let routineName = matches.groups.routineName;

            console.timeLog("executionTime", `\tFound Routine ${routineName}`);

            let symbol = new vscode.DocumentSymbol(
                    routineName, 
                    'Component',
                    vscode.SymbolKind.Function,
                    new vscode.Range(this.editor.document.positionAt(selectionStart), this.editor.document.positionAt(selectionEnd)), 
                    new vscode.Range(this.editor.document.positionAt(selectionStart), this.editor.document.positionAt(selectionEnd))
                );            
            
            this.symbols.push(symbol);
        }

    }
}