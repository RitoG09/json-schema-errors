import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("contains keyword", async () => {
  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("contains", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      contains: { type: "number" }
    }, schemaUri);

    const instance = ["foo", null, true];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        instanceLocation: "#",
        message: localization.getContainsErrorMessage({}),
        schemaLocations: ["https://example.com/main#/contains"]
      }
    ]);
  });

  test("contains with minContains", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      contains: { type: "number" },
      minContains: 2
    }, schemaUri);

    const instance = ["foo", 42];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        instanceLocation: "#",
        message: localization.getContainsErrorMessage({ minContains: 2 }),
        schemaLocations: [
          "https://example.com/main#/contains",
          "https://example.com/main#/minContains"
        ]
      }
    ]);
  });

  test("contains with an exact number of matches", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      contains: { type: "number" },
      maxContains: 1
    }, schemaUri);

    const instance = ["foo", 42, 24];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        instanceLocation: "#",
        message: localization.getContainsErrorMessage({ maxContains: 1 }),
        schemaLocations: [
          "https://example.com/main#/contains",
          "https://example.com/main#/maxContains"
        ]
      }
    ]);
  });

  test("contains with a range of matches", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      contains: { type: "number" },
      maxContains: 2
    }, schemaUri);

    /** @type string[] */
    const instance = [];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        instanceLocation: "#",
        message: localization.getContainsErrorMessage({ maxContains: 2 }),
        schemaLocations: [
          "https://example.com/main#/contains",
          "https://example.com/main#/maxContains"
        ]
      }
    ]);
  });

  test("contains with a non-array", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      contains: { type: "number" }
    }, schemaUri);

    const instance = 42;
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });

  test("contains passing", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      contains: { type: "number" }
    }, schemaUri);

    const instance = ["foo", 42];
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
