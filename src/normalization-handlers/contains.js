import * as Instance from "@hyperjump/json-schema/instance/experimental";
import { evaluateSchema, isSchemaValid } from "../json-schema-errors.js";

/**
 * @import { KeywordHandler, NormalizedOutput } from "../index.d.ts"
 * @import { EvaluatedItemsContext } from "./unevaluatedItems.js"
 */

/**
 * @typedef {{
 *   contains: string;
 *   minContains: number;
 *   maxContains: number;
 * }} ContainsAst
 */

/** @type KeywordHandler<ContainsAst, EvaluatedItemsContext> */
const containsNormalizationHandler = {
  evaluate({ contains }, instance, context) {
    /** @type NormalizedOutput[] */
    const output = [];

    if (Instance.typeOf(instance) !== "array") {
      return output;
    }

    let index = 0;
    for (const item of Instance.iter(instance)) {
      const itemOutput = evaluateSchema(contains, item, context);
      output.push(itemOutput);

      if (isSchemaValid(itemOutput)) {
        context.evaluatedItems?.add(index);
      }

      index++;
    }

    return output;
  }
};

export default containsNormalizationHandler;
