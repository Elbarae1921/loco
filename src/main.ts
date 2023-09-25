import * as vscode from 'vscode';
import { SimpleGit } from 'simple-git';
import { getMainBranch, getDiff } from './utils';

export const main = async (
  context: vscode.ExtensionContext,
  git: SimpleGit
) => {
  try {
    const mainBranch = await getMainBranch(git, context);

    if (mainBranch) {
      const diff = await getDiff(git, mainBranch.commit);

      const additions = diff.insertions;
      const deletions = diff.deletions;

      vscode.window.setStatusBarMessage(`+${additions} -${deletions}`);
    } else {
      throw new Error('Main branch not found');
    }
  } catch (e) {
    console.error(e);
    vscode.window.setStatusBarMessage('');
  }
};
