import { evaluateSchema } from "../json-schema-errors.js";

/**
 * @import { KeywordHandler, NormalizedOutput } from "../index.d.ts"
 */

/** @type KeywordHandler<string[]> */
const oneOfNormalizationHandler = {
  evaluate(oneOf, instance, context) {
    /** @type NormalizedOutput[] */
    const outputs = [];
    for (const schemaLocation of oneOf) {
      outputs.push(evaluateSchema(schemaLocation, instance, context));
    }

    return outputs;
  }
};

export default oneOfNormalizationHandler;
