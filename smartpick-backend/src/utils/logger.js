// src/utils/logger.js
const fs = require('fs');
const path = require('path');

class Logger {
  static instance = null;

  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    this.logDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }

    Logger.instance = this;
  }

  static getInstance() {
    if (!Logger.instance) {
      new Logger();
    }
    return Logger.instance;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}\n`;
    console.log(logMessage);
    try {
      fs.appendFileSync(path.join(this.logDir, 'app.log'), logMessage);
    } catch (e) {
      console.error('Error writing log file', e);
    }
  }

  error(message, error) {
    const timestamp = new Date().toISOString();

    // ✅ Manejar cuando error viene undefined o es solo un string
    let details = '';

    if (error) {
      if (error.stack) {
        details = error.stack;
      } else if (error.message) {
        details = error.message;
      } else if (typeof error === 'string') {
        details = error;
      } else {
        details = JSON.stringify(error);
      }
    }

    const errorMessage = `[${timestamp}] ERROR: ${message}${
      details ? ' - ' + details : ''
    }\n`;

    console.error(errorMessage);
    try {
      fs.appendFileSync(path.join(this.logDir, 'error.log'), errorMessage);
    } catch (e) {
      console.error('Error writing error log file', e);
    }
  }
}

module.exports = Logger.getInstance();
