# Setting Up Desktop App in a New Repository

This guide will help you set up the desktop app in a new Git repository.

## Prerequisites

- Git installed on your system
- A GitHub/GitLab/Bitbucket account (or any Git hosting service)
- Terminal/Command Prompt access

## Step-by-Step Instructions

### Step 1: Navigate to the Desktop App Directory

```bash
cd desktop-app
```

### Step 2: Initialize Git Repository (if not already initialized)

```bash
git init
```

### Step 3: Check Current Status

```bash
git status
```

This will show you which files will be tracked. Make sure `node_modules/`, `build/`, and `dist/` are not listed (they should be ignored by `.gitignore`).

### Step 4: Add All Files to Staging

```bash
git add .
```

### Step 5: Create Initial Commit

```bash
git commit -m "Initial commit: Desktop app for Ticketing and Task Management System"
```

### Step 6: Create a New Repository on GitHub (or your Git host)

1. Go to GitHub.com (or your Git hosting service)
2. Click "New repository"
3. Name it (e.g., `ticketing-system-desktop-app`)
4. **Do NOT** initialize with README, .gitignore, or license (since we already have these)
5. Click "Create repository"

### Step 7: Add Remote Repository

After creating the repository, GitHub will show you the repository URL. Use it in the following command:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**OR if using SSH:**

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

### Step 8: Verify Remote

```bash
git remote -v
```

This should show your remote repository URL.

### Step 9: Push to Remote Repository

```bash
git branch -M main
git push -u origin main
```

If you're using `master` as your default branch:

```bash
git branch -M master
git push -u origin master
```

### Step 10: Verify Upload

Go to your repository on GitHub and verify that all files have been uploaded correctly.

## Alternative: Using GitHub CLI (gh)

If you have GitHub CLI installed, you can simplify the process:

```bash
cd desktop-app
git init
git add .
git commit -m "Initial commit: Desktop app for Ticketing and Task Management System"
gh repo create YOUR_REPO_NAME --public --source=. --remote=origin --push
```

## Troubleshooting

### If you get "remote origin already exists"

```bash
git remote remove origin
git remote add origin YOUR_NEW_REPO_URL
```

### If you need to change the branch name

```bash
git branch -M main
```

### If files that should be ignored are showing up

1. Check that `.gitignore` is properly formatted
2. Remove cached files:
   ```bash
   git rm -r --cached .
   git add .
   git commit -m "Update .gitignore and remove tracked files"
   ```

### If you want to push to a different branch

```bash
git push -u origin main:YOUR_BRANCH_NAME
```

## What Gets Excluded

The following files/folders are excluded from the repository (as defined in `.gitignore`):

- `node_modules/` - Dependencies (should be installed via `npm install`)
- `build/` - Build output directory
- `dist/` - Distribution/build artifacts
- `.env*` - Environment files with sensitive data
- IDE configuration files
- OS-specific files

## Next Steps

After setting up the repository:

1. **Update README.md** - Make sure it reflects your repository-specific information
2. **Add License** - If you haven't already, add a license file
3. **Set up CI/CD** - Consider adding GitHub Actions for automated builds
4. **Add Badges** - Add status badges to your README
5. **Configure Branch Protection** - Set up branch protection rules on GitHub

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Electron Builder Documentation](https://www.electron.build/)
