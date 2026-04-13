# CLAUDE.md

## Project rules

- This is a html project. (心理測驗網站)
- Do not modify any files unless I explicitly ask.
- Do not execute commands unless I explicitly ask.
- Do not install packages, run builds, or run tests unless I explicitly ask.
- Always explain the planned changes before editing files.
- Prefer minimal, focused changes.
- Preserve the existing project structure and coding style.

## Sensitive files and settings

- Treat all appsettings files as sensitive.
- Ask before reading or changing:
  - `appsettings.json`
  - `appsettings.Development.json`
  - `appsettings.Production.json`
  - `.env`
  - any `*.pfx`, `*.pem`, `*.key`, or certificate files
  - publish profiles
  - files containing connection strings, API keys, tokens, passwords, or secrets
- Do not reveal, rewrite, or copy secret values.

## Code change rules

- Ask before changing `Program.cs`, startup configuration, dependency injection setup, authentication, authorization, or security-related code.
- When suggesting changes, explain:
  1. which files will be touched
  2. why the change is needed
  3. the expected impact
- Avoid unrelated refactoring.
- Do not rename files, classes, methods, or variables unless necessary and approved.

## Analysis mode

- When I ask for analysis, read only.
- In analysis mode, do not modify files and do not execute commands.
- First identify:
  - entry point
  - configuration files
  - service layer
  - controllers / pages / endpoints
  - potential sensitive files

## Editing workflow

- Before making any approved code change, first propose a minimal change plan.
- The plan must list:
  1. which files will be modified
  2. the purpose of each modification
  3. the expected impact
  4. the estimated number of change points
- Do not modify files outside the explicitly approved file list.
- After I approve the plan, apply all approved edits in one batch whenever possible.
- Do not ask for confirmation for every small patch if the file list and change scope were already approved.
- If the required changes exceed the approved scope, stop and ask before proceeding.
- Prefer the smallest possible implementation that fully fixes the issue.
- Do not perform cleanup, style-only edits, or opportunistic refactoring unless I explicitly ask.
- After completing changes, provide a concise change summary instead of repeating large code blocks.

## Patch approval behavior

- If I approve a plan, treat that as approval for all edits within the agreed file list and scope.
- Only ask again if:
  - you need to modify an additional file not previously approved
  - you need to change security-sensitive behavior beyond the approved plan
  - you discover the original plan is insufficient and the scope must expand
- For small, related edits inside already approved files, complete them together in one pass.

## Output style

- Be concise and technical.
- For code issues, point out the exact file and reason.
- If uncertain, say what is uncertain instead of guessing.
- When presenting a fix plan, prefer short structured summaries over long explanations.
- After implementation, summarize:
  1. what changed
  2. why it changed
  3. any compatibility or deployment impact
  
  - Do not show each individual patch for approval once the approved scope is clear; apply the approved batch directly.