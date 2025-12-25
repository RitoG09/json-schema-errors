/**
 * @import { KeywordHandler } from "../index.d.ts"
 */

/** @type KeywordHandler */
const dependentRequiredNormalizationHandler = {
  appliesTo(type) {
    return type === "object";
  }
};

export default dependentRequiredNormalizationHandler;
