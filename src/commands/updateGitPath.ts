import { SimpleGit } from 'simple-git';
import * as vscode from 'vscode';
import { main } from '../main';

export const updateGitPath = async (
  context: vscode.ExtensionContext,
  git: SimpleGit
) => {
  const newGitPath = await vscode.window.showInputBox({
    placeHolder: '/Users/foo/projects/bar',
    prompt: 'Absolute git path (default: current workspace path)'
  });
  if (newGitPath === '') {
    vscode.window.showErrorMessage('Git path is mandatory');
  }
  if (newGitPath !== undefined) {
    const extensionSettings = vscode.workspace.getConfiguration('loco');
    await extensionSettings.update('gitPath', newGitPath);
    const selection = await vscode.window.showInformationMessage(
      'Settings have been updated. Please reload VSCode to apply the changes.',
      'Reload Now'
    );
    if (selection === 'Reload Now') {
      vscode.commands.executeCommand('workbench.action.reloadWindow');
    }
    await main(context, git);
  }
};
