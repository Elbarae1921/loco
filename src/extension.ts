import * as vscode from 'vscode';
import { SimpleGit, simpleGit } from 'simple-git';
import { updateDiffCommand } from './commands/updateDiff';
import { updateMainBranchCommand } from './commands/updateMainBranch';
import { main } from './main';

const registerCommands = async (
  context: vscode.ExtensionContext,
  git: SimpleGit
) => {
  const disposables = [
    vscode.commands.registerCommand(
      'loco.updateDiff',
      () => updateDiffCommand(context, git)
    ),
    vscode.commands.registerCommand(
      'loco.updateMainBranch',
      () => updateMainBranchCommand(context, git)
    )
  ];

  for (const disposable of disposables) {
    context.subscriptions.push(disposable);
  }
};

export async function activate(context: vscode.ExtensionContext) {
  try {
    const path = vscode.workspace.workspaceFolders?.[0];
    if (path) {
      const git = simpleGit({ baseDir: path.uri.fsPath });

      registerCommands(context, git);

      vscode.workspace.onDidSaveTextDocument(() => main(context, git));
      await main(context, git);
    } else {
      throw new Error('Folder path not found');
    }
  } catch (e) {
    console.error(e);
  }
}
