import StudentProfileHistorySection from "./StudentProfileHistorySection";

const employmentTypes = [
  { value: "full_time", label: "Full-time employment" },
  { value: "part_time", label: "Part-time employment" },
  { value: "contract", label: "Contract work" },
  { value: "self_employed", label: "Self-employment" },
  { value: "internship", label: "Internship" },
  { value: "volunteer", label: "Voluntary work" },
  { value: "other", label: "Other" },
];

const text = (value) => String(value ?? "").trim();

function currentMonth() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
  ].join("-");
}

function validMonth(value) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

function formatMonth(value) {
  if (!validMonth(value)) return "";

  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}-01T12:00:00`));
}

const config = {
  title: "Employment history",
  description: "Your current and previous work experience.",
  recordLabel: "work experience",
  addLabel: "Add experience",

  editorDescription:
    "Add one role at a time. Use month and year for dates, and mark roles you still hold as current.",

  emptyTitle: "Tell us about your work experience",
  emptyDescription:
    "Include employment, self-employment, internships or voluntary roles. If you have never worked, record that below.",

  nonePrompt: "Have you worked before?",
  noneHelp: "Add a role, or confirm that you have no previous work experience.",
  noneButton: "I have not worked before",
  noneTitle: "No work experience declared",
  noneDescription:
    "You can add your first role here when you start working.",

  footer:
    "Employment letters and supporting documents are managed in Documents.",

  defaults: {
    employmentType: "",
    employer: "",
    jobTitle: "",
    country: "",
    city: "",
    startMonth: "",
    endMonth: "",
    current: false,
    description: "",
  },

  // Any work record replaces the no-work-history declaration.
  affectsDeclaration: () => true,

  sort: (a, b) =>
    Number(Boolean(b.current)) - Number(Boolean(a.current)) ||
    text(b.startMonth).localeCompare(text(a.startMonth)),

  fields: [
    {
      name: "employmentType",
      label: "Type of work",
      type: "select",
      required: true,
      wide: true,
      options: employmentTypes,
    },
    {
      name: "employer",
      label: (values) =>
        values.employmentType === "self_employed"
          ? "Business / trading name"
          : "Employer / organisation",
      required: true,
      wide: true,
      helper: (values) =>
        values.employmentType === "self_employed"
          ? 'Use your business name, or enter "Self-employed".'
          : undefined,
    },
    {
      name: "jobTitle",
      label: "Job title / role",
      required: true,
      wide: true,
      helper: "Use the title that best describes your responsibilities.",
    },
    {
      name: "country",
      label: "Country",
    },
    {
      name: "city",
      label: "City / town",
      helper: "Optional.",
    },
    {
      name: "startMonth",
      label: "Start month",
      type: "month",
      helper: "Leave blank if you need to confirm the date.",
      inputProps: () => ({ max: currentMonth() }),
    },
    {
      name: "endMonth",
      label: "End month",
      type: "month",
      when: (values) => !values.current,
      helper: "Leave blank if you need to confirm the date.",
      inputProps: (values) => ({
        max: currentMonth(),
        min: validMonth(values.startMonth) ? values.startMonth : undefined,
      }),
    },
    {
      name: "current",
      label: "I currently work in this role",
      type: "checkbox",
    },
    {
      name: "description",
      label: "Main responsibilities",
      type: "textarea",
      wide: true,
      helper: "Optional. Briefly describe the work you do or did.",
    },
  ],

  normalize(values) {
    return {
      employmentType: text(values.employmentType),
      employer: text(values.employer),
      jobTitle: text(values.jobTitle),
      country: text(values.country),
      city: text(values.city),
      startMonth: text(values.startMonth),
      endMonth: values.current ? "" : text(values.endMonth),
      current: Boolean(values.current),
      description: text(values.description),
    };
  },

  validate(values) {
    const errors = {};
    const today = currentMonth();

    if (
      !employmentTypes.some(
        (option) => option.value === values.employmentType
      )
    ) {
      errors.employmentType = "Choose the type of work.";
    }

    if (!values.employer) {
      errors.employer = "Enter the employer or business name.";
    }

    if (!values.jobTitle) {
      errors.jobTitle = "Enter your job title or role.";
    }

    ["startMonth", "endMonth"].forEach((name) => {
      if (!values[name]) return;

      if (!validMonth(values[name])) {
        errors[name] = "Enter a valid month and year.";
      } else if (values[name] > today) {
        errors[name] = "Use a month that is not in the future.";
      }
    });

    if (
      validMonth(values.startMonth) &&
      validMonth(values.endMonth) &&
      values.endMonth < values.startMonth
    ) {
      errors.endMonth = "The end month cannot be before the start month.";
    }

    return errors;
  },

  summary(record) {
    const workType =
      employmentTypes.find(
        (option) => option.value === record.employmentType
      )?.label || "Work experience";

    return {
      title: record.jobTitle || "Work experience",
      subtitle: record.employer,
      tag: {
        label: record.current ? "Current role" : workType,
        tone: "primary",
      },
      details: [
        {
          label: "Period",
          value: [
            formatMonth(record.startMonth) || "Start not provided",
            record.current
              ? "Present"
              : formatMonth(record.endMonth) || "End not provided",
          ].join(" – "),
        },
        {
          label: "Location",
          value: [record.city, record.country].filter(Boolean).join(", "),
        },
        {
          label: "Type of work",
          value: workType,
        },
      ],
      notes: record.description,
    };
  },
};

export default function StudentEmploymentHistorySection(props) {
  return <StudentProfileHistorySection {...props} config={config} />;
}