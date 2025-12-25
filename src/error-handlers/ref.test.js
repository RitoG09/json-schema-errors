import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("$ref and $defs keywords", async () => {
  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("$ref fail", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      properties: {
        foo: { $ref: "#/$defs/number" }
      },
      $defs: {
        number: { type: "number" }
      }
    }, schemaUri);

    const instance = { foo: "bar" };
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getTypeErrorMessage(["number"]),
        instanceLocation: "#/foo",
        schemaLocations: [`${schemaUri}#/$defs/number/type`]
      }
    ]);
  });

  test("$ref pass", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      properties: {
        foo: { $ref: "#/$defs/number" }
      },
      $defs: {
        number: { type: "number" }
      }
    }, schemaUri);

    const instance = { foo: 42 };
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
