// Import the Electron tools used by the app.
const {
  app,
  BrowserWindow,
  globalShortcut,
  desktopCapturer,
  screen,
  session
} = require("electron");

// Start the app after Electron is ready.
app.whenReady().then(() => {
  // Allow the app to request Windows system audio through loopback.
  // Loopback captures audio playing on the computer.
  session.defaultSession.setDisplayMediaRequestHandler(async (request, callback) => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ["screen"]
      });

      if (!sources.length) {
        callback({});
        return;
      }

      callback({
        video: sources[0],
        audio: "loopback"
      });
    } catch (error) {
      console.error("System audio setup failed:", error);
      callback({});
    }
  });

  // Create the transparent, always-on-top overlay window.
  const mainWindow = new BrowserWindow({
    width: 440,
    height: 580,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Request protection from screen capture and load the app page.
  mainWindow.setContentProtection(true);
  mainWindow.loadFile("index.html");

  // Remember whether mouse clicks pass through the overlay.
  let isClickThrough = false;

  // Register a shortcut and report a conflict in the terminal.
  function addShortcut(keys, action) {
    if (!globalShortcut.register(keys, action)) {
      console.log(`Could not register shortcut: ${keys}`);
    }
  }

  // Hide or show the overlay without focusing it when shown.
  addShortcut("CommandOrControl+Shift+B", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.showInactive();
    }
  });

  // Move the overlay relative to its current position.
  function moveWindow(horizontal, vertical) {
    const [x, y] = mainWindow.getPosition();
    mainWindow.setPosition(x + horizontal, y + vertical);
  }

  // Register the four window movement shortcuts.
  addShortcut("CommandOrControl+Shift+Up", () => moveWindow(0, -30));
  addShortcut("CommandOrControl+Shift+Down", () => moveWindow(0, 30));
  addShortcut("CommandOrControl+Shift+Left", () => moveWindow(-30, 0));
  addShortcut("CommandOrControl+Shift+Right", () => moveWindow(30, 0));

  // Toggle click-through mode and update the page.
  addShortcut("CommandOrControl+Shift+M", () => {
    isClickThrough = !isClickThrough;
    mainWindow.setIgnoreMouseEvents(isClickThrough);
    mainWindow.webContents.send("click-through-status", isClickThrough);
  });

  // Capture the primary screen for screenshot analysis.
  addShortcut("CommandOrControl+Shift+H", async () => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ["screen"],
        thumbnailSize: {
          width: 1920,
          height: 1080
        }
      });

      // Match the capture source to the primary display.
      const primaryId = String(screen.getPrimaryDisplay().id);
      const primarySource = sources.find(
        source => source.display_id === primaryId
      );

      // If there is only one source, use it when its display ID is unavailable.
      const source =
        primarySource || (sources.length === 1 ? sources[0] : null);

      if (!source || source.thumbnail.isEmpty()) {
        throw new Error("Could not capture the primary screen.");
      }

      // Send the PNG image to index.html.
      if (!mainWindow.isDestroyed()) {
        const dataUrl = source.thumbnail.toDataURL();
        mainWindow.webContents.send("screenshot-captured", dataUrl);
      }
    } catch (error) {
      console.error("Screen capture failed:", error);

      if (!mainWindow.isDestroyed()) {
        mainWindow.webContents.send("capture-error", error.message);
      }
    }
  });

  // Tell the page to answer using the latest buffered conversation.
  addShortcut("CommandOrControl+Shift+A", () => {
    mainWindow.webContents.send("answer-audio");
  });

  // Clear the current screenshot and answer.
  addShortcut("CommandOrControl+Shift+R", () => {
    mainWindow.webContents.send("clear-screen");
  });

  // Quit the app.
  addShortcut("CommandOrControl+Shift+Q", () => {
    app.quit();
  });
});

// Quit when the overlay window is closed.
app.on("window-all-closed", () => {
  app.quit();
});

// Release all shortcuts when the app closes.
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});