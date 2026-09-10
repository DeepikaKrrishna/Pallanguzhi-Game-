# Working with GitHub on this project

A start-to-finish guide, from installing Git to opening pull requests. Run
every command from inside the `Pallanguzhi` folder unless stated otherwise.

---

## 1. Install and identify yourself (once per machine)

Download Git from <https://git-scm.com/downloads>, then tell it who you are.
This name and email appear on every commit you ever make.

```bash
git --version
git config --global user.name "Gurusreeram"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

---

## 2. Create the repository on GitHub

On <https://github.com>, click **New repository**.

- Name: `pallanguzhi`
- Description: A traditional Tamil board game, built with React Native and Expo
- Public
- Do **not** tick "Add a README" or "Add .gitignore" — the project already has
  both, and an empty remote is easier to push into.

Click **Create repository** and leave the page open; you will need the URL.

---

## 3. Turn the folder into a repository

```bash
cd Pallanguzhi
git init
git status
```

`git status` lists everything Git can see. Confirm `node_modules/` is **not**
in that list before going further — `.gitignore` should already be keeping it
out. If it appears, you are in the wrong folder or `.gitignore` is missing.

---

## 4. Make the first commit

```bash
git add .
git commit -m "Initial Expo project setup"
```

`git add` stages the changes you want to record. `git commit` writes them into
history with a message describing what changed.

---

## 5. Connect to GitHub and push

Copy the HTTPS URL from the GitHub page, then:

```bash
git remote add origin https://github.com/<your-username>/pallanguzhi.git
git branch -M main
git push -u origin main
```

GitHub asks for a password on first push. Your account password will not work
— generate a **personal access token** instead:

Profile photo → Settings → Developer settings → Personal access tokens →
Tokens (classic) → Generate new token → tick the `repo` scope → copy the token
and paste it as the password. Save it somewhere safe; GitHub shows it once.

The `-u` flag links your local `main` to the remote one, so later pushes are
just `git push`.

---

## 6. The everyday loop

This is the cycle you repeat while building.

```bash
git status                       # what changed
git diff                         # the exact lines that changed
git add src/game/gameEngine.ts   # stage specific files
git commit -m "Implemented seed distribution logic"
git push
```

Commit when a piece of work makes sense on its own — after the board renders,
after sowing works, after the history screen saves. A commit that says
"Implemented scoring and turn management" is useful six months later; one that
says "update" is not.

Write commit messages in the imperative, under about 60 characters, describing
what the commit does rather than what you did.

---

## 7. Branches for new work

Never build a risky feature directly on `main`. Branch instead:

```bash
git checkout -b feature/seed-animation
# ... edit files, commit as usual ...
git push -u origin feature/seed-animation
```

On GitHub the branch now shows a **Compare & pull request** button. Open the
pull request, describe what changed and why, then merge it. Afterwards:

```bash
git checkout main
git pull            # bring the merged work into your local main
git branch -d feature/seed-animation
```

---

## 8. Working from two machines

Before you start work anywhere, pull first:

```bash
git pull
```

This avoids the most common source of merge conflicts — two copies of `main`
that have drifted apart.

---

## 9. When something goes wrong

| Situation | Command |
| --- | --- |
| Undo changes to a file you have not staged | `git restore src/screens/GameScreen.tsx` |
| Unstage a file you added by mistake | `git restore --staged <file>` |
| Fix the message of the last commit | `git commit --amend -m "Better message"` |
| See the history | `git log --oneline --graph --decorate` |
| Committed `node_modules` by accident | `git rm -r --cached node_modules` then commit |
| A merge conflict | Open the marked file, keep the correct lines, delete the `<<<<<<<` markers, then `git add <file>` and `git commit` |

---

## 10. What never gets committed

`.gitignore` already excludes these, and they should stay excluded:

- `node_modules/` — reinstalled from `package.json` by anyone who clones
- `.expo/`, `dist/`, `android/`, `ios/` — build output
- `.env` files, `*.keystore`, `google-services.json` — secrets and signing keys
- `.vscode/`, `.idea/`, `.DS_Store` — machine-specific clutter

If a secret ever does get committed, treat it as leaked: rotate the key, then
remove it from history.

---

## 11. Making the repository presentable

For a project you will show to reviewers or recruiters:

- Fill in the **About** panel with a description and topics
  (`react-native`, `expo`, `typescript`, `tamil`, `board-game`)
- Keep `README.md` current — it is the first thing anyone reads
- Add screenshots to `assets/images/` and link them in the README
- Tag a release once the app runs end to end:
  `git tag -a v1.0.0 -m "First playable release"` then `git push --tags`
