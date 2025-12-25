import { addErrorHandler, setNormalizationHandler } from "./json-schema-errors.js";

// Normalization Handlers
import definitionsNormalizationHandler from "./normalization-handlers/definitions.js";
import minimumNormalizationHandler from "./normalization-handlers/minimum.js";
import propertiesNormalizationHandler from "./normalization-handlers/properties.js";
import refNormalizationHandler from "./normalization-handlers/ref.js";
import typeNormalizationHandler from "./normalization-handlers/type.js";

// Error Handlers
import booleanSchemaErrorHandler from "./error-handlers/boolean-schema.js";
import typeErrorHandler from "./error-handlers/type.js";
import minimumErrorHandler from "./error-handlers/minimum.js";

setNormalizationHandler("https://json-schema.org/keyword/definitions", definitionsNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/minimum", minimumNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/properties", propertiesNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/ref", refNormalizationHandler);
setNormalizationHandler("https://json-schema.org/keyword/type", typeNormalizationHandler);

addErrorHandler(booleanSchemaErrorHandler);
addErrorHandler(typeErrorHandler);
addErrorHandler(minimumErrorHandler);

export { addErrorHandler, jsonSchemaErrors, setNormalizationHandler } from "./json-schema-errors.js";
