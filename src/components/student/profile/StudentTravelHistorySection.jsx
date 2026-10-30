import StudentProfileHistorySection from "./StudentProfileHistorySection";

const text = (value) => String(value ?? "").trim();

const recordTypes = [
  { value: "passport", label: "Passport" },
  { value: "trip", label: "Trip / stay abroad" },
  { value: "visa", label: "Issued visa / residence permit" },
];

const purposes = [
  { value: "study", label: "Study" },
  { value: "work", label: "Work" },
  { value: "tourism", label: "Tourism / holiday" },
  { value: "family", label: "Family visit" },
  { value: "business", label: "Business visit" },
  { value: "transit", label: "Transit" },
  { value: "other", label: "Other" },
];

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T12:00:00`);

  return !Number.isNaN(date.getTime()) && dateKey(date) === value;
}

function formatDate(value) {
  if (!validDate(value)) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function maskedReference(value) {
  const reference = text(value).replace(/\s/g, "");

  if (!reference) return "";
  return reference.length > 4 ? `•••• ${reference.slice(-4)}` : "••••";
}

const isTrip = (values) => values.kind === "trip";
const isPassport = (values) => values.kind === "passport";
const isVisa = (values) => values.kind === "visa";
const isDocument = (values) => isPassport(values) || isVisa(values);

const config = {
  title: "Travel & immigration history",
  description: "Your passports, trips abroad and issued visas or permits.",
  recordLabel: "travel record",
  addLabel: "Add record",

  editorDescription:
    "Choose what you are adding. Record trips you have made and details from documents you hold. Leave optional dates blank if you need to confirm them.",

  emptyTitle: "Build a clear record of your travel history",
  emptyDescription:
    "Add your passport, previous trips or stays abroad, and any issued visas or residence permits. Each item has its own record.",

  nonePrompt: "Have you travelled abroad before?",
  noneHelp:
    "You can record passport and visa details even if you have never travelled abroad.",
  noneButton: "I have never travelled abroad",
  noneTitle: "No previous international travel declared",
  noneDescription:
    "You can still add your passport and issued visas here. Add a trip when you have travelled.",

  footer:
    "Supporting files are managed in Documents. Record visa refusals in Prior refusals.",

  defaults: {
    kind: "",
    country: "",
    passportNumber: "",
    visaType: "",
    reference: "",
    purpose: "",
    city: "",
    entryDate: "",
    departureDate: "",
    ongoing: false,
    issueDate: "",
    validFrom: "",
    expiryDate: "",
    notes: "",
  },

  // Passports and visas do not imply that the student has travelled.
  affectsDeclaration: (record) => record.kind === "trip",

  fields: [
    {
      name: "kind",
      label: "What are you adding?",
      type: "select",
      required: true,
      wide: true,
      options: recordTypes,
      disabled: (_values, editing) => editing,
      helper: "Keep each passport, trip or issued visa as a separate record.",
    },
    {
      name: "country",
      label: (values) =>
        values.kind === "trip" ? "Country visited" : "Issuing country",
      required: true,
      when: (values) => Boolean(values.kind),
    },
    {
      name: "passportNumber",
      label: "Passport number",
      required: true,
      when: isPassport,
      helper: "Enter it exactly as printed on your passport.",
    },
    {
      name: "visaType",
      label: "Visa / permit type",
      required: true,
      when: isVisa,
      helper: "Use the description shown on the document.",
    },
    {
      name: "purpose",
      label: "Purpose of travel",
      type: "select",
      required: true,
      when: isTrip,
      options: purposes,
    },
    {
      name: "city",
      label: "City / area visited",
      when: isTrip,
      helper: "Optional.",
    },
    {
      name: "entryDate",
      label: "Date you entered",
      type: "date",
      when: isTrip,
      helper: "Optional if you need to confirm the date.",
      inputProps: () => ({ max: dateKey(new Date()) }),
    },
    {
      name: "departureDate",
      label: "Date you left",
      type: "date",
      when: (values) => isTrip(values) && !values.ongoing,
      helper: "Optional if you need to confirm the date.",
      inputProps: (values) => ({
        max: dateKey(new Date()),
        min: validDate(values.entryDate) ? values.entryDate : undefined,
      }),
    },
    {
      name: "ongoing",
      label: "I am still in this country",
      type: "checkbox",
      when: isTrip,
    },
    {
      name: "issueDate",
      label: "Passport issue date",
      type: "date",
      when: isPassport,
      helper: "Optional. Use the date printed on your passport.",
      inputProps: () => ({ max: dateKey(new Date()) }),
    },
    {
      name: "validFrom",
      label: "Visa / permit valid from",
      type: "date",
      when: isVisa,
      helper: "Optional. Use the date printed on the document.",
    },
    {
      name: "expiryDate",
      label: "Expiry date",
      type: "date",
      when: isDocument,
      helper: "Optional. Expired documents can also be recorded.",
    },
    {
      name: "reference",
      label: "Visa / permit reference",
      when: isVisa,
      helper: "Optional. Your reference is masked in the summary.",
    },
    {
      name: "notes",
      label: "Additional details",
      type: "textarea",
      wide: true,
      when: (values) => Boolean(values.kind),
      helper: "Optional. Add information that helps explain this record.",
    },
  ],

  normalize(values) {
    const common = {
      kind: text(values.kind),
      country: text(values.country),
      notes: text(values.notes),
    };

    if (values.kind === "passport") {
      return {
        ...common,
        passportNumber: text(values.passportNumber),
        issueDate: text(values.issueDate),
        expiryDate: text(values.expiryDate),
      };
    }

    if (values.kind === "visa") {
      return {
        ...common,
        visaType: text(values.visaType),
        reference: text(values.reference),
        validFrom: text(values.validFrom),
        expiryDate: text(values.expiryDate),
      };
    }

    return {
      ...common,
      purpose: text(values.purpose),
      city: text(values.city),
      entryDate: text(values.entryDate),
      departureDate: values.ongoing ? "" : text(values.departureDate),
      ongoing: Boolean(values.ongoing),
    };
  },

  validate(values) {
    const errors = {};
    const today = dateKey(new Date());

    if (!recordTypes.some((option) => option.value === values.kind)) {
      errors.kind = "Choose the type of record.";
      return errors;
    }

    if (!values.country) {
      errors.country = "Enter the country.";
    }

    if (values.kind === "passport" && !values.passportNumber) {
      errors.passportNumber = "Enter your passport number.";
    }

    if (values.kind === "visa" && !values.visaType) {
      errors.visaType = "Enter the visa or permit type.";
    }

    if (
      values.kind === "trip" &&
      !purposes.some((option) => option.value === values.purpose)
    ) {
      errors.purpose = "Choose the purpose of this trip.";
    }

    const dateFields =
      values.kind === "trip"
        ? ["entryDate", "departureDate"]
        : values.kind === "passport"
          ? ["issueDate", "expiryDate"]
          : ["validFrom", "expiryDate"];

    dateFields.forEach((name) => {
      if (values[name] && !validDate(values[name])) {
        errors[name] = "Enter a valid date.";
      }
    });

    ["entryDate", "departureDate", "issueDate"].forEach((name) => {
      if (validDate(values[name]) && values[name] > today) {
        errors[name] = "Use a date that is not in the future.";
      }
    });

    if (
      values.kind === "trip" &&
      validDate(values.entryDate) &&
      validDate(values.departureDate) &&
      values.departureDate < values.entryDate
    ) {
      errors.departureDate = "The departure date cannot be before entry.";
    }

    const documentStart =
      values.kind === "passport" ? values.issueDate : values.validFrom;

    if (
      values.kind !== "trip" &&
      validDate(documentStart) &&
      validDate(values.expiryDate) &&
      values.expiryDate < documentStart
    ) {
      errors.expiryDate =
        "The expiry date cannot be before the document's start date.";
    }

    return errors;
  },

  summary(record) {
    const expiryPassed =
      validDate(record.expiryDate) &&
      record.expiryDate < dateKey(new Date());

    if (record.kind === "passport") {
      return {
        title: "Passport",
        subtitle: `Issuing country · ${record.country}`,
        tag: {
          label: expiryPassed ? "Expiry date passed" : "Passport record",
          tone: expiryPassed ? "secondary" : "primary",
        },
        details: [
          {
            label: "Passport number",
            value: maskedReference(record.passportNumber),
          },
          {
            label: "Issue date",
            value: formatDate(record.issueDate),
          },
          {
            label: "Expiry date",
            value: formatDate(record.expiryDate),
          },
        ],
        notes: record.notes,
      };
    }

    if (record.kind === "visa") {
      return {
        title: record.visaType || "Visa / residence permit",
        subtitle: `Issuing country · ${record.country}`,
        tag: {
          label: expiryPassed ? "Expiry date passed" : "Visa / permit record",
          tone: expiryPassed ? "secondary" : "primary",
        },
        details: [
          {
            label: "Reference",
            value: maskedReference(record.reference),
          },
          {
            label: "Valid-from date",
            value: formatDate(record.validFrom),
          },
          {
            label: "Expiry date",
            value: formatDate(record.expiryDate),
          },
        ],
        notes: record.notes,
      };
    }

    const purpose =
      purposes.find((option) => option.value === record.purpose)?.label ||
      "Purpose not provided";

    return {
      title: record.country || "Trip abroad",
      subtitle: [purpose, record.city].filter(Boolean).join(" · "),
      tag: {
        label: record.ongoing ? "Ongoing stay" : "Travel record",
        tone: record.ongoing ? "secondary" : "primary",
      },
      details: [
        {
          label: "Date entered",
          value: formatDate(record.entryDate),
        },
        {
          label: "Date left",
          value: record.ongoing ? "Still in this country" : formatDate(record.departureDate),
        },
        {
          label: "Purpose",
          value: purpose,
        },
      ],
      notes: record.notes,
    };
  },
};

export default function StudentTravelHistorySection(props) {
  return <StudentProfileHistorySection {...props} config={config} />;
}