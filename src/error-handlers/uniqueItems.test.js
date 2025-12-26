import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("uniqueItems error handler", async () => {
  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("uniqueItems fail", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      uniqueItems: true
    }, schemaUri);

    const instance = ["foo", "foo", "bar"];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getUniqueItemsErrorMessage(),
        instanceLocation: "#/0",
        schemaLocations: [`${schemaUri}#/uniqueItems`]
      },
      {
        message: localization.getUniqueItemsErrorMessage(),
        instanceLocation: "#/1",
        schemaLocations: [`${schemaUri}#/uniqueItems`]
      }
    ]);
  });

  test("uniqueItems pass", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      uniqueItems: true
    }, schemaUri);

    const instance = ["foo", "bar"];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
