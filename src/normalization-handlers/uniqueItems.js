/**
 * @import { KeywordHandler } from "../index.d.ts"
 */

/** @type KeywordHandler */
const uniqueItemsNormalizationHandler = {
  appliesTo(type) {
    return type === "array";
  }
};

export default uniqueItemsNormalizationHandler;
