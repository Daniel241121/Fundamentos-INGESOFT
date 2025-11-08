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
    const logMessage = `[${timestamp}] INFO: ${message}\\n`;
    console.log(logMessage);
    fs.appendFileSync(path.join(this.logDir, 'app.log'), logMessage);
  }

  error(message, error) {
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] ERROR: ${message} - ${error.message}\\n`;
    console.error(errorMessage);
    fs.appendFileSync(path.join(this.logDir, 'error.log'), errorMessage);
  }
}

module.exports = Logger.getInstance();
