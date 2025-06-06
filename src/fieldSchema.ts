import { z } from "zod";

export const DataMakerFieldSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("Words"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ count: z.number().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("UUID"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ primaryKey: z.boolean().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Number"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      stringify: z.boolean().optional(),
    }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Float"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      precision: z.number().optional(),
    }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Boolean"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({
      truthy: z.boolean().optional(),
      falsy: z.boolean().optional(),
    }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("AI"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ prompt: z.string() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Custom"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ values: z.array(z.string()) }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Date"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ format: z.string().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Name"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ sex: z.enum(["male", "female"]).optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("First Name"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ sex: z.enum(["male", "female"]).optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Last Name"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ sex: z.enum(["male", "female"]).optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("E-Mail"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Address"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ useFullAddress: z.boolean().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("City"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Country"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Phone Number"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ format: z.string().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Zip Code"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ format: z.string().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Sex"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Gender"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Avatar"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Job Title"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Random String"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Account Name"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("IBAN"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({
      formatted: z.boolean().optional(),
      countryCode: z.string().optional(),
    }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Currency Name"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Credit Card Number"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ issuer: z.string().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Account Number"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ length: z.number().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Password"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Domain Name"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Color"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Emoji"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("IPv4"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("MAC Address"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("URL"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Product"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Department"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Product Name"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Datetime"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ past: z.boolean().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Month"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ abbr: z.boolean().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Weekday"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ abbr: z.boolean().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Time Zone"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Lorem"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ lineCount: z.number().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("RegExp"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ string: z.string() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("MongoDB ObjectID"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({}),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Null"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ value: z.string().optional() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Derived"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ value: z.string() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Template"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({
      templateId: z.string().optional(),
      foreignKey: z.string().optional(),
      array: z.boolean(),
      quantity: z.number(),
    }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("API Response"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({
      endpoint: z.string(),
      query: z.string().optional(),
      masking: z.string().optional(),
      prompt: z.string().optional(),
    }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("DB Response"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({
      connection: z.string(),
      sql: z.string(),
      query: z.string().optional(),
      masking: z.string().optional(),
      prompt: z.string().optional(),
    }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Mapped"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ field: z.string(), map: z.record(z.string()) }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
  z.object({
    type: z.literal("Nested"),
    name: z.string(),
    active: z.boolean(),
    nested: z.array(z.any()),
    options: z.object({ array: z.boolean(), quantity: z.number() }),
    function: z.string(),
    optional: z.boolean(),
    sensitive: z.boolean(),
  }),
]);

export const DataMakerFieldsSchema = z.array(DataMakerFieldSchema);
