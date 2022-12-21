export class JsonApiErrors extends Error {
    errors;
    statusCode;
  
    constructor(errors, statusCode) {
      super();
  
      this.errors = errors;
      this.statusCode = statusCode;
      this.message = JsonApiErrors.formatMessage(errors);
    }
  
    static formatMessage(errors) {
      if (typeof errors === "string") {
        return errors;
      }
  
      const [error] = errors;
  
      let message = `${error.status} ${error.title}`;
  
      if (error.detail) {
        message += `\n${error.detail}`;
      }
  
      return message;
    }
  }