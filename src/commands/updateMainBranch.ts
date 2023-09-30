import { SimpleGit } from 'simple-git';
import * as vscode from 'vscode';
import { branchExists } from '../utils';
import { main } from '../main';

export const updateMainBranchCommand = async (
  context: vscode.ExtensionContext,
  git: SimpleGit
) => {
  const mainBranchName = await vscode.window.showInputBox({
    placeHolder: 'main',
    prompt: 'Main branch name (default: master/main)'
  });

  if (mainBranchName === '') {
    vscode.window.showErrorMessage('Main branch name is mandatory');
  }

  if (mainBranchName !== undefined) {
    if (await branchExists(git, mainBranchName)) {
      context.workspaceState.update('main_branch', mainBranchName);
      vscode.window.showInformationMessage(
        `Main branch name updated: '${mainBranchName}'`
      );
      main(context, git);
    } else {
      vscode.window.showErrorMessage('Branch not found');
    }
  }
};
