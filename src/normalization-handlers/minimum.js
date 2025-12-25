/**
 * @import { KeywordHandler } from "../index.d.ts"
 */

/** @type KeywordHandler */
const minimumNormalizationHandler = {
  appliesTo(type) {
    return type === "number";
  }
};

export default minimumNormalizationHandler;
