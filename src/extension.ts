import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerCommand('demo.helloWorld', () => {

    vscode.window.showInformationMessage("aa");
    vscode.commands.executeCommand('editor.action.addCommentLine');

  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
