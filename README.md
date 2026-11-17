# Interview Ace

Interview Ace is a Windows desktop companion for working through coding questions. It keeps a small overlay beside your editor so you can capture a problem, explore an approach, and review an explanation without losing your place.

> **Work in progress:** This is a prototype. Features, installation, and security need further testing before release.

## What it is intended to do

- Capture your primary screen and ask Gemini to help explain coding questions, errors, or technical concepts.
- Keep a small always-on-top window that you can move, hide, or set to click-through.
- Use optional system and microphone audio for voice follow-ups, including conversational Hinglish responses.
- Keep a short session history and the latest screenshot for follow-up context.
- Let you choose a Gemini model, add your own project background, and adjust the answer size and window opacity.

## Getting started

The prototype uses Windows, Node.js, plain Electron, HTML, and JavaScript. Open the project folder in VS Code, open **Terminal → New Terminal**, then run:

```powershell
npm.cmd install
npm.cmd start
```

Enter your own Gemini API key in the app's settings. Model access and API charges depend on your Google account. The app is currently launched from source; there is no installer in this repository.

## Shortcuts

| Shortcut | Action |
| --- | --- |
| Ctrl + Shift + H | Capture the screen and ask Gemini |
| Ctrl + Shift + A | Answer using buffered audio when listening is enabled |
| Ctrl + Shift + R | Clear the current topic |
| Ctrl + Shift + B | Hide or show the window |
| Ctrl + Shift + M | Toggle click-through |
| Ctrl + Shift + Arrow keys | Move the window |
| Ctrl + Shift + Q | Quit |

## Privacy and responsible use

Screenshots, audio, resume text, and relevant session context may be sent to Google when you ask for an answer. Audio capture is optional; obtain any required consent and follow the rules of the platform or interview. Review and test AI-generated answers.

The prototype requests Windows screen-capture protection, but this does not guarantee invisibility or prevent detection. The current prototype's API key storage and Electron settings need a security review before distribution. Do not commit API keys, personal resumes, recordings, or local settings.

## Project status

The source is available here, but further testing and a security review are needed before the project is ready to share or sell.
