import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("oneOf error handler", async () => {
  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("oneOf on matches", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      oneOf: [
        { type: "string" },
        { type: "number" }
      ]
    }, schemaUri);

    const instance = null;
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getOneOfErrorMessage(0),
        alternatives: [
          [
            {
              message: localization.getTypeErrorMessage(["string"]),
              instanceLocation: "#",
              schemaLocations: [`${schemaUri}#/oneOf/0/type`]
            }
          ],
          [
            {
              message: localization.getTypeErrorMessage(["number"]),
              instanceLocation: "#",
              schemaLocations: [`${schemaUri}#/oneOf/1/type`]
            }
          ]
        ],
        instanceLocation: "#",
        schemaLocations: [`${schemaUri}#/oneOf`]
      }
    ]);
  });

  test("oneOf more than one match", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      oneOf: [
        { type: "integer" },
        { type: "number" }
      ]
    }, schemaUri);

    const instance = 1;
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getOneOfErrorMessage(2),
        instanceLocation: "#",
        schemaLocations: [`${schemaUri}#/oneOf`]
      }
    ]);
  });

  test("oneOf pass", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      oneOf: [
        { type: "string" },
        { type: "number" }
      ]
    }, schemaUri);

    const instance = 42;
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
