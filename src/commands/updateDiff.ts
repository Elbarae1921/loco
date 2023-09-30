import { SimpleGit } from 'simple-git';
import * as vscode from 'vscode';
import { main } from '../main';

export const updateDiffCommand = async (
  context: vscode.ExtensionContext,
  git: SimpleGit
) => {
  await main(context, git);
};
