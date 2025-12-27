import * as Instance from "@hyperjump/json-schema/instance/experimental";
import { getErrors } from "../json-schema-errors.js";

/**
 * @import { ErrorHandler, ErrorObject } from "../index.d.ts"
 */

/** @type ErrorHandler */
const oneOfErrorHandler = async (normalizedErrors, instance, localization) => {
  /** @type ErrorObject[] */
  const errors = [];

  for (const schemaLocation in normalizedErrors["https://json-schema.org/keyword/oneOf"]) {
    const oneOf = normalizedErrors["https://json-schema.org/keyword/oneOf"][schemaLocation];
    if (typeof oneOf === "boolean") {
      continue;
    }

    const alternatives = [];
    let matchCount = 0;
    for (const alternative of oneOf) {
      const alternativeErrors = await getErrors(alternative, instance, localization);
      if (alternativeErrors.length) {
        alternatives.push(alternativeErrors);
      } else {
        matchCount++;
      }
    }

    /** @type ErrorObject */
    const alternativeErrors = {
      message: localization.getOneOfErrorMessage(matchCount),
      instanceLocation: Instance.uri(instance),
      schemaLocations: [schemaLocation]
    };
    if (alternatives.length) {
      alternativeErrors.alternatives = alternatives;
    }
    errors.push(alternativeErrors);
  }

  return errors;
};

export default oneOfErrorHandler;
