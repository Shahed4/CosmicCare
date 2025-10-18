const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Log info messages
 */
export function logInfo(message) {
  const timestamp = new Date().toISOString();
  console.log(`${colors.cyan}[INFO]${colors.reset} ${colors.bright}${timestamp}${colors.reset} - ${message}`);
}

/**
 * Log error messages
 */
export function logError(message, error = null) {
  const timestamp = new Date().toISOString();
  console.error(`${colors.red}[ERROR]${colors.reset} ${colors.bright}${timestamp}${colors.reset} - ${message}`);
  if (error) {
    console.error(`${colors.red}${error.stack || error}${colors.reset}`);
  }
}

/**
 * Log warning messages
 */
export function logWarn(message) {
  const timestamp = new Date().toISOString();
  console.warn(`${colors.yellow}[WARN]${colors.reset} ${colors.bright}${timestamp}${colors.reset} - ${message}`);
}

/**
 * Log success messages
 */
export function logSuccess(message) {
  const timestamp = new Date().toISOString();
  console.log(`${colors.green}[SUCCESS]${colors.reset} ${colors.bright}${timestamp}${colors.reset} - ${message}`);
}

export default { logInfo, logError, logWarn, logSuccess };
