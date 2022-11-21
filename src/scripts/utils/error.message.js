class ErrorMessage {
  static ERR_REQUEST_FAILED = 'Failed to execute request.';

  static ERR_GET_DATA(name) {
    return `Failed to get ${name} data. Try again.`;
  }

  static ERR_POST_DATA(name) {
    return `Failed to submit ${name} data. Please check your data and try again.`;
  }
}

export default ErrorMessage;
