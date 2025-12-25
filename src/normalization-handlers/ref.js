import { evaluateSchema } from "../json-schema-errors.js";

/**
 * @import { KeywordHandler } from "../index.d.ts"
 */

/** @type KeywordHandler<string> */
const refNormalizationHandler = {
  evaluate(ref, instance, context) {
    return [evaluateSchema(ref, instance, context)];
  },
  simpleApplicator: true
};

export default refNormalizationHandler;
