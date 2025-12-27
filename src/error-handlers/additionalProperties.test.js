import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("additionalProperties keyword", async () => {
  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("additionalProperties with false schema", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      properties: {
        foo: { type: "number" }
      },
      patternProperties: {
        "^a": { type: "boolean" }
      },
      additionalProperties: false
    }, schemaUri);

    const instance = { foo: 42, apple: true, bar: "foo" };
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getBooleanSchemaErrorMessage(),
        instanceLocation: "#/bar",
        schemaLocations: [`${schemaUri}#/additionalProperties`]
      }
    ]);
  });

  test("additionalProperties with object schema", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      properties: {
        foo: { type: "number" }
      },
      patternProperties: {
        "^a": { type: "boolean" }
      },
      additionalProperties: { type: "string" }
    }, schemaUri);

    const instance = { foo: 42, apple: true, bar: null };
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getTypeErrorMessage(["string"]),
        instanceLocation: "#/bar",
        schemaLocations: [`${schemaUri}#/additionalProperties/type`]
      }
    ]);
  });

  test("additionalProperties on a non-object", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      properties: {
        foo: { type: "number" }
      },
      patternProperties: {
        "^a": { type: "boolean" }
      },
      additionalProperties: { type: "string" }
    }, schemaUri);

    const instance = 42;
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });

  test("additionalProperties pass", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      properties: {
        foo: { type: "number" }
      },
      patternProperties: {
        "^a": { type: "boolean" }
      },
      additionalProperties: false
    }, schemaUri);

    const instance = { foo: 42, apple: true };
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
