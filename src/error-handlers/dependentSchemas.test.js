import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("dependentSchemas keyword", async () => {
  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("dependentSchemas fail", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      dependentSchemas: {
        foo: { required: ["bar", "baz"] },
        aaa: { required: ["bbb"] }
      }
    }, schemaUri);

    const instance = { foo: 42, bar: true };
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getRequiredErrorMessage(["baz"]),
        instanceLocation: "#",
        schemaLocations: [`${schemaUri}#/dependentSchemas/foo/required`]
      }
    ]);
  });

  test("dependentSchemas on a non-object", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      dependentSchemas: {
        foo: { required: ["bar"] }
      }
    }, schemaUri);

    const instance = 42;
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });

  test("dependentSchemas pass", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      dependentSchemas: {
        foo: { required: ["bar"] }
      }
    }, schemaUri);

    const instance = { foo: 42, bar: true };
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
