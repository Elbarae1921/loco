import * as vscode from 'vscode';
import { SimpleGit, simpleGit } from 'simple-git';
import { updateMainBranchCommand } from './commands/updateMainBranch';
import { main } from './main';

const registerCommands = async (
  context: vscode.ExtensionContext,
  git: SimpleGit
) => {
  let disposable = vscode.commands.registerCommand(
    'loco.updateMainBranch',
    () => updateMainBranchCommand(context, git)
  );
  context.subscriptions.push(disposable);
};

export async function activate(context: vscode.ExtensionContext) {
  try {
    const path = vscode.workspace.workspaceFolders?.[0];
    if (path) {
      const git = simpleGit({ baseDir: path.uri.fsPath });

      registerCommands(context, git);

      main(context, git);
      vscode.workspace.onDidSaveTextDocument(() => main(context, git));
    } else {
      throw new Error('Folder path not found');
    }
  } catch (e) {
    console.error(e);
  }
}
