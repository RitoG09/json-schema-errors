import { evaluateSchema } from "../json-schema-errors.js";
import * as Instance from "@hyperjump/json-schema/instance/experimental";

/**
 * @import { KeywordHandler, NormalizedOutput} from "../index.d.ts"
 */

/** @type KeywordHandler<[string, string][]> */
const dependentSchemaNormalizationHandler = {
  evaluate(dependentSchemas, instance, context) {
    /** @type NormalizedOutput[] */
    const outputs = [];
    if (Instance.typeOf(instance) !== "object") {
      return outputs;
    }

    const instanceKeys = Object.keys(Instance.value(instance));
    for (const [propertyName, schemaLocation] of dependentSchemas) {
      if (instanceKeys.includes(propertyName)) {
        outputs.push(evaluateSchema(schemaLocation, instance, context));
      }
    }

    return outputs;
  },
  simpleApplicator: true
};

export default dependentSchemaNormalizationHandler;
