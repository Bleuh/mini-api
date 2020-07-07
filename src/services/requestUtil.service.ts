//src/services/requestChecker.service.ts

type CheckResult = {
  ok: boolean;
  extra: string[];
  miss: string[];
};

export default class RequestUtil {
  public checkFields(required: string[], reqBody: string[]): CheckResult {
    // Creating a table for missing or too many fields
    const miss: string[] = [];
    const extra: string[] = [];

    // Check that there are no fields missing
    required.forEach((prop) => {
      if (reqBody.indexOf(prop) === -1) {
        miss.push(prop);
      }
    });

    // Check if to many field
    reqBody.forEach((prop) => {
      if (required.indexOf(prop) === -1) {
        extra.push(prop);
      }
    });

    // Check field
    const ok = extra.length === 0 && miss.length === 0;

    return {
      ok,
      extra,
      miss,
    };
  }

  public apiSuccessResponse(
    message: string,
    data: Record<string, unknown> | null = null
  ): Record<string, unknown> {
    if (data) {
      return {
        message,
        error: null,
        data,
      };
    } else {
      return {
        message,
        error: null,
      };
    }
  }

  public apiErrorResponse(
    message: string,
    error = "An error has occurred"
  ): Record<string, unknown> {
    return {
      message,
      error,
    };
  }

  public apiFieldsErrorReponse(
    miss: Array<string>,
    extra: Array<string>
  ): Record<string, unknown> {
    return {
      ...this.apiErrorResponse('Missing parameters'),
      miss,
      extra
    }
  }
}
