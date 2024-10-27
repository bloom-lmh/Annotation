import * as vscode from 'vscode';
import { Picker } from './picker';
import ts from 'typescript'

export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerCommand('addAnnotation', () => {

    let context = new Picker().pick();
    /*  if (context) {
       new Parser().parse(context);
     } */




    //vscode.commands.executeCommand('editor.action.addCommentLine');

  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
