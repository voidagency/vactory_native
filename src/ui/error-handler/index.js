import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoggerService } from "../../services";
import ErrorFallback from "./error-fallback";

const appErrorHandler = (error) => {
  LoggerService.error(error);
  //   captureException(error);
};

export const ErrorHandler = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback} onError={appErrorHandler}>
    {children}
  </ErrorBoundary>
);

