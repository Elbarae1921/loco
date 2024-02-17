import * as vscode from 'vscode';
import {
  SimpleGit,
  BranchSummary,
  BranchSummaryBranch,
  DiffResult
} from 'simple-git';

let cachedBranchSummary: BranchSummary | null = null;

export const getSettings = () => {
  const extensionSettings = vscode.workspace.getConfiguration('loco');
  const gitPath = extensionSettings.get<string>('gitPath');
  const autoDiff = extensionSettings.get<boolean>('autoDiff');
  const showCurrentFile = extensionSettings.get<boolean>('showCurrentFile');
  return { gitPath, autoDiff, showCurrentFile };
};

export const getAllBranches = (git: SimpleGit) =>
  new Promise<BranchSummary>((res, rej) => {
    if (!cachedBranchSummary) {
      git.branch({}, (e, d) => {
        if (e) {
          return rej(e);
        }
        cachedBranchSummary = d;
        return res(d);
      });
    } else {
      res(cachedBranchSummary);
    }
  });

export const branchExists = async (git: SimpleGit, branch: string) => {
  const branches = await getAllBranches(git);
  return branches.all.some((branchName) => branchName === branch);
};

export const getMainBranch = async (
  git: SimpleGit,
  context: vscode.ExtensionContext
): Promise<BranchSummaryBranch | undefined> => {
  const branchSummary = await getAllBranches(git);
  let mainBranch: string | undefined;

  const preferredMainBranchName = context.workspaceState.get('main_branch');
  if (
    typeof preferredMainBranchName === 'string' &&
    !!preferredMainBranchName
  ) {
    mainBranch = branchSummary.all.find(
      (branchName) => branchName === preferredMainBranchName
    );
  } else {
    mainBranch = branchSummary.all.find(
      (branchName) => branchName === 'main' || branchName === 'master'
    );
  }
  if (mainBranch) {
    return branchSummary.branches[mainBranch];
  }
};

export const getCurrentBranch = async (git: SimpleGit) => {
  const branchSummary = await getAllBranches(git);
  return branchSummary.branches[branchSummary.current];
};

export const getDiff = async (
  git: SimpleGit,
  mainRef: string
): Promise<DiffResult> =>
  new Promise((res, rej) => {
    git.diffSummary([mainRef], (e, d) => {
      if (e) {
        return rej(e);
      }
      return res(d);
    });
  });

export const getDiffForFile = async (
  git: SimpleGit,
  mainRef: string,
  file: string
): Promise<DiffResult> =>
  new Promise((res, rej) => {
    git.diffSummary([mainRef, '--', file], (e, d) => {
      if (e) {
        return rej(e);
      }
      return res(d);
    });
  });
