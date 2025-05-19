export interface Connection {
  id: string;
  [key: string]: any;
}

export interface DataMakerResponse {
  live_data: any[];
}

interface WordsField {
  name: string;
  type: "Words";
  options?: { count?: number };
}

interface UUIDField {
  name: string;
  type: "UUID";
  options?: { primaryKey?: boolean };
}

interface NumberField {
  name: string;
  type: "Number";
  options?: { min?: number; max?: number; stringify?: boolean };
}

interface FloatField {
  name: string;
  type: "Float";
  options?: { min?: number; max?: number; precision?: number };
}

interface BooleanField {
  name: string;
  type: "Boolean";
  options?: { truthy?: boolean; falsy?: boolean };
}

interface AIField {
  name: string;
  type: "AI";
  options: { prompt: string };
}

interface CustomField {
  name: string;
  type: "Custom";
  options: { values: string[] };
}

interface DateField {
  name: string;
  type: "Date";
  options?: { format?: string };
}

interface NameField {
  name: string;
  type: "Name";
  options?: { sex?: "male" | "female" };
}

interface FirstNameField {
  name: string;
  type: "First Name";
  options?: { sex?: "male" | "female" };
}

interface LastNameField {
  name: string;
  type: "Last Name";
  options?: { sex?: "male" | "female" };
}

interface EmailField {
  name: string;
  type: "E-Mail";
  options?: {};
}

interface AddressField {
  name: string;
  type: "Address";
  options?: { useFullAddress?: boolean };
}

interface CityField {
  name: string;
  type: "City";
  options?: {};
}

interface CountryField {
  name: string;
  type: "Country";
  options?: {};
}

interface PhoneNumberField {
  name: string;
  type: "Phone Number";
  options?: { format?: string };
}

interface ZipCodeField {
  name: string;
  type: "Zip Code";
  options?: { format?: string };
}

interface SexField {
  name: string;
  type: "Sex";
  options?: {};
}

interface GenderField {
  name: string;
  type: "Gender";
  options?: {};
}

interface AvatarField {
  name: string;
  type: "Avatar";
  options?: {};
}

interface JobTitleField {
  name: string;
  type: "Job Title";
  options?: {};
}

interface RandomStringField {
  name: string;
  type: "Random String";
  options?: { min?: number; max?: number };
}
interface AccountNameField {
  name: string;
  type: "Account Name";
  options?: {};
}

interface IBANField {
  name: string;
  type: "IBAN";
  options?: { formatted?: boolean; countryCode?: string };
}

interface CurrencyNameField {
  name: string;
  type: "Currency Name";
  options?: {};
}

interface CreditCardNumberField {
  name: string;
  type: "Credit Card Number";
  options?: { issuer?: string };
}

interface AccountNumberField {
  name: string;
  type: "Account Number";
  options?: { length?: number };
}

interface PasswordField {
  name: string;
  type: "Password";
  options?: {};
}

interface DomainNameField {
  name: string;
  type: "Domain Name";
  options?: {};
}

interface ColorField {
  name: string;
  type: "Color";
  options?: {};
}

interface EmojiField {
  name: string;
  type: "Emoji";
  options?: {};
}

interface IPv4Field {
  name: string;
  type: "IPv4";
  options?: {};
}

interface MACAddressField {
  name: string;
  type: "MAC Address";
  options?: {};
}

interface URLField {
  name: string;
  type: "URL";
  options?: {};
}

interface ProductField {
  name: string;
  type: "Product";
  options?: {};
}

interface DepartmentField {
  name: string;
  type: "Department";
  options?: {};
}

interface ProductNameField {
  name: string;
  type: "Product Name";
  options?: {};
}

interface DatetimeField {
  name: string;
  type: "Datetime";
  options?: { past?: boolean };
}

interface MonthField {
  name: string;
  type: "Month";
  options?: { abbr?: boolean };
}

interface WeekdayField {
  name: string;
  type: "Weekday";
  options?: { abbr?: boolean };
}

interface TimeZoneField {
  name: string;
  type: "Time Zone";
  options?: {};
}

interface LoremField {
  name: string;
  type: "Lorem";
  options?: { lineCount?: number };
}

interface RegExpField {
  name: string;
  type: "RegExp";
  options: { string: string };
}

interface MongoDBObjectIDField {
  name: string;
  type: "MongoDB ObjectID";
  options?: {};
}

interface NullField {
  name: string;
  type: "Null";
  options?: { value?: string };
}

interface DerivedField {
  name: string;
  type: "Derived";
  options: { value: string };
}

interface TemplateField {
  name: string;
  type: "Template";
  options: {
    templateId?: string;
    foreignKey?: string;
    array: boolean;
    quantity: number;
  };
}

interface APIResponseField {
  name: string;
  type: "API Response";
  options: {
    endpoint: string;
    query?: string;
    masking?: string;
    prompt?: string;
  };
}

interface DBResponseField {
  name: string;
  type: "DB Response";
  options: {
    connection: string;
    sql: string;
    query?: string;
    masking?: string;
    prompt?: string;
  };
}

interface MappedField {
  name: string;
  type: "Mapped";
  options: { field: string; map: Record<string, string> };
}

interface NestedField {
  name: string;
  type: "Nested";
  options: { array: boolean; quantity: number };
}

type DataMakerField =
  | WordsField
  | UUIDField
  | NumberField
  | FloatField
  | BooleanField
  | AIField
  | CustomField
  | DateField
  | NameField
  | FirstNameField
  | LastNameField
  | EmailField
  | AddressField
  | CityField
  | CountryField
  | PhoneNumberField
  | ZipCodeField
  | SexField
  | GenderField
  | AvatarField
  | JobTitleField
  | RandomStringField
  | AccountNameField
  | IBANField
  | CurrencyNameField
  | CreditCardNumberField
  | AccountNumberField
  | PasswordField
  | DomainNameField
  | ColorField
  | EmojiField
  | IPv4Field
  | MACAddressField
  | URLField
  | ProductField
  | DepartmentField
  | ProductNameField
  | DatetimeField
  | MonthField
  | WeekdayField
  | TimeZoneField
  | LoremField
  | RegExpField
  | MongoDBObjectIDField
  | NullField
  | DerivedField
  | TemplateField
  | APIResponseField
  | DBResponseField
  | MappedField
  | NestedField;

export type Fields = DataMakerField[];

export type AccountTemplate = {
  id: string;
  name: string;
  fields: Fields;
  createdAt: string;
  createdBy: string;
  templateFolderId: null;
  teamId: string;
  seed: null;
};

export interface Template {
  id: string;
  fields: Fields;
  [key: string]: any;
}
