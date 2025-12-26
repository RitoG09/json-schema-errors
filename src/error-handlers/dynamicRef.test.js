import { afterEach, describe, expect, test } from "vitest";
import { registerSchema, unregisterSchema, validate } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { jsonSchemaErrors } from "../index.js";
import { Localization } from "../localization.js";

describe("$dynamicRef and $dynamicAnchor keywords", async () => {
  const schemaUri = "https://example.com/main";
  const localization = await Localization.forLocale("en-US");

  afterEach(() => {
    unregisterSchema(schemaUri);
  });

  test("$dynamicRef fail", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $ref: "base",
      $defs: {
        a: {
          $dynamicAnchor: "foo",
          type: "number"
        },
        base: {
          $id: "base",
          properties: {
            foo: { $dynamicRef: "#foo" }
          },
          $defs: {
            foo: {
              $dynamicAnchor: "foo",
              type: "string"
            }
          }
        }
      }
    }, schemaUri);

    const instance = { foo: "bar" };
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getTypeErrorMessage(["number"]),
        instanceLocation: "#/foo",
        schemaLocations: [`${schemaUri}#/$defs/a/type`]
      }
    ]);
  });

  test("$dynamicRef invalid", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      properties: {
        foo: { $dynamicRef: "#foo" }
      },
      $defs: {
        foo: {
          $anchor: "foo",
          type: "number"
        }
      }
    }, schemaUri);

    const instance = { foo: "bar" };
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([
      {
        message: localization.getTypeErrorMessage(["number"]),
        instanceLocation: "#/foo",
        schemaLocations: [`${schemaUri}#/$defs/foo/type`]
      }
    ]);
  });

  test("$dynamiRef pass", async () => {
    registerSchema({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $ref: "base",
      $defs: {
        a: {
          $dynamicAnchor: "foo",
          type: "number"
        },
        base: {
          $id: "base",
          properties: {
            foo: { $dynamicRef: "#foo" }
          },
          $defs: {
            foo: {
              $dynamicAnchor: "foo",
              type: "string"
            }
          }
        }
      }
    }, schemaUri);

    const instance = { foo: 42 };
    const output = await validate(schemaUri, instance, BASIC);
    const errors = await jsonSchemaErrors(output, schemaUri, instance);

    expect(errors).to.eql([]);
  });
});
