import * as vscode from 'vscode';
import { SimpleGit } from 'simple-git';
import { getMainBranch, getDiff, getDiffForFile, getSettings } from './utils';

export const main = async (
  context: vscode.ExtensionContext,
  git: SimpleGit
) => {
  try {
    const settings = getSettings();

    const mainBranch = await getMainBranch(git, context);

    if (mainBranch) {
      const diff = await getDiff(git, mainBranch.commit);

      const additions = diff.insertions;
      const deletions = diff.deletions;

      let message = `$(settings-edit) +${additions} -${deletions}`;

      const currentFileName = vscode.window.activeTextEditor?.document.fileName;
      if (
        settings.showCurrentFile &&
        currentFileName &&
        !(await git.checkIgnore([currentFileName])).length
      ) {
        const fileDiff = await getDiffForFile(
          git,
          mainBranch.commit,
          currentFileName
        );
        message += ` (File: +${fileDiff.insertions} -${fileDiff.deletions})`;
      }

      vscode.window.setStatusBarMessage(message);
    } else {
      throw new Error('Main branch not found');
    }
  } catch (e) {
    console.error(e);
    vscode.window.setStatusBarMessage('');
  }
};
