import * as vscode from 'vscode';
import { SimpleGit, simpleGit } from 'simple-git';
import { updateDiffCommand } from './commands/updateDiff';
import { updateMainBranchCommand } from './commands/updateMainBranch';
import { main } from './main';
import { updateGitPath } from './commands/updateGitPath';

const registerCommands = async (
  context: vscode.ExtensionContext,
  git: SimpleGit
) => {
  const disposables = [
    vscode.commands.registerCommand('loco.updateDiff', () =>
      updateDiffCommand(context, git)
    ),
    vscode.commands.registerCommand('loco.updateMainBranch', () =>
      updateMainBranchCommand(context, git)
    ),
    vscode.commands.registerCommand('loco.updateGitPath', () =>
      updateGitPath(context, git)
    )
  ];

  context.subscriptions.push(...disposables);
};

export async function activate(context: vscode.ExtensionContext) {
  try {
    const workspacePath = vscode.workspace.workspaceFolders?.[0];
    if (workspacePath) {
      const extensionSettings = vscode.workspace.getConfiguration('loco');
      let gitPath = extensionSettings.get<string>('gitPath');
      if (!gitPath) {
        gitPath = workspacePath.uri.fsPath;
      }
      let git: SimpleGit;
      try {
        git = simpleGit({ baseDir: gitPath });
      } catch {
        git = simpleGit({ baseDir: workspacePath.uri.fsPath });
      }

      registerCommands(context, git);

      const autoDiff = extensionSettings.get<boolean>('autoDiff');
      if (autoDiff) {
        vscode.workspace.onDidSaveTextDocument(() => main(context, git));
      }
      await main(context, git);
    } else {
      throw new Error('Folder path not found');
    }
  } catch (e) {
    console.error(e);
  }
}
