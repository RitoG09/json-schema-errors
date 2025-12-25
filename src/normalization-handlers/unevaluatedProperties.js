import { evaluateSchema } from "../json-schema-errors.js";
import * as Instance from "@hyperjump/json-schema/instance/experimental";

/**
 * @import { EvaluationContext, KeywordHandler, NormalizedOutput } from "../index.d.ts"
 */

/**
 * @typedef {{
 *   rootSchema: string;
 *   evaluatedProperties: Set<string>;
 *   schemaEvaluatedProperties: Set<string>;
 * } & EvaluationContext} EvaluatedPropertiesContext
 */

/** @type KeywordHandler<string, EvaluatedPropertiesContext> */
const unevaluatedPropertiesNormalizationHandler = {
  evaluate(unevaluatedProperties, instance, context) {
    /** @type NormalizedOutput[] */
    const outputs = [];

    if (Instance.typeOf(instance) !== "object") {
      return outputs;
    }

    const evaluatedProperties = context.schemaEvaluatedProperties;

    for (const [propertyNameNode, property] of Instance.entries(instance)) {
      const propertyName = /** @type string */ (Instance.value(propertyNameNode));
      if (evaluatedProperties.has(propertyName)) {
        continue;
      }

      outputs.push(evaluateSchema(unevaluatedProperties, property, context));
      context.evaluatedProperties?.add(propertyName);
    }

    return outputs;
  },
  simpleApplicator: true
};

export default unevaluatedPropertiesNormalizationHandler;
