import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";

import StudentApplicationsHeader from "../../components/student/applications/StudentApplicationsHeader";
import StudentApplicationSelector from "../../components/student/applications/StudentApplicationSelector";
import StudentApplicationSummary from "../../components/student/applications/StudentApplicationSummary";
import StudentApplicationTracker from "../../components/student/applications/StudentApplicationTracker";
import StudentApplicationActions from "../../components/student/applications/StudentApplicationActions";
import StudentApplicationUpdates from "../../components/student/applications/StudentApplicationUpdates";

const SELECTION_PARAM = "application";

const SECTION_GAP = {
  xs: 2,
  sm: 2.5,
  lg: 3,
};

const visuallyHidden = {
  position: "absolute",
  width: 1,
  height: 1,
  p: 0,
  m: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function recordId(value) {
  return Number.isSafeInteger(value)
    ? String(value)
    : text(value);
}

function isRecord(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

// Missing or malformed data remains unavailable.
// An empty array means the collection was loaded and is empty.
function prepareCollection(value, titleKey, fields) {
  if (!Array.isArray(value)) return null;

  const seen = new Set();
  const result = [];

  for (const item of value) {
    if (!isRecord(item) || !text(item[titleKey])) {
      return null;
    }

    const id = recordId(item.id);

    if (!id || seen.has(id)) {
      return null;
    }

    seen.add(id);

    const prepared = {
      ...item,
      id,
    };

    for (const field of fields) {
      prepared[field] = text(item[field]);
    }

    result.push(prepared);
  }

  return result;
}

function prepareApplications(value) {
  if (value == null) {
    return {
      records: null,
      invalid: false,
    };
  }

  if (!Array.isArray(value)) {
    return {
      records: null,
      invalid: true,
    };
  }

  const seen = new Set();
  const records = [];

  for (const item of value) {
    const id = isRecord(item) ? recordId(item.id) : "";

    // Do not silently discard applications and show incorrect totals.
    if (!id || seen.has(id)) {
      return {
        records: null,
        invalid: true,
      };
    }

    seen.add(id);

    const actions =
      prepareCollection(item.actions, "title", [
        "title",
        "category",
        "description",
        "reviewNote",
        "dueDate",
        "to",
        "actionLabel",
      ])?.map((action) => ({
        ...action,
        instructions: Array.isArray(action.instructions)
          ? action.instructions.map(text).filter(Boolean)
          : [],
      })) ?? null;

    const stages = prepareCollection(
      item.stages,
      "label",
      [
        "label",
        "description",
        "owner",
        "state",
        "completedAt",
      ],
    );

    const updates =
      prepareCollection(item.updates, "title", [
        "title",
        "body",
        "visibility",
        "createdAt",
        "authorName",
        "authorRole",
      ])?.map((update) => ({
        ...update,
        attachment: isRecord(update.attachment)
          ? {
              name: text(update.attachment.name),
              url: text(update.attachment.url),
              content: text(update.attachment.content),
            }
          : null,
      })) ?? null;

    records.push({
      ...item,
      id,

      institutionName:
        text(item.institutionName) ||
        "Institution to be confirmed",

      programmeName:
        text(item.programmeName) ||
        "Programme to be confirmed",

      institutionLogo: text(item.institutionLogo),
      reference: text(item.reference),
      country: text(item.country),
      intakeLabel: text(item.intakeLabel),
      studyLevel: text(item.studyLevel),
      studyMode: text(item.studyMode),
      consultantName: text(item.consultantName),
      statusLabel: text(item.statusLabel),
      updatedAt: text(item.updatedAt),
      waitingMessage: text(item.waitingMessage),

      actions,
      stages,
      updates,

      // The actions collection contains outstanding requirements only.
      // When unavailable, retain the API's attention flag.
      requiresAction:
        actions !== null
          ? actions.length > 0
          : item.requiresAction === true,
    });
  }

  return {
    records,
    invalid: false,
  };
}

function applicationLocation(location, id) {
  const params = new URLSearchParams(location.search);

  params.set(SELECTION_PARAM, id);

  return {
    pathname: location.pathname,
    search: `?${params.toString()}`,
    hash: location.hash,
  };
}

function selectedRecord(records, requestedId) {
  return requestedId
    ? records.find(
        (application) => application.id === requestedId,
      ) ?? null
    : records[0] ?? null;
}

function focusDetails(element) {
  if (!element) return;

  element.focus({
    preventScroll: true,
  });

  element.scrollIntoView({
    behavior: "instant",
    block: "start",
  });
}

/**
 * Data contract:
 *
 * applications:
 *   The complete student-visible application list.
 *   [] means the list was loaded and contains no applications.
 *   undefined/null means data has not been supplied.
 *
 * IDs:
 *   Applications, actions, stages and updates require unique IDs
 *   within their respective collections.
 *
 * actions:
 *   Outstanding requirements only, excluding completed history.
 *
 * preview:
 *   Uses fictional examples only when applications is undefined.
 *
 * Fetching and authorization belong to the route/API layer.
 * StudentLayout owns navigation, outer padding and the main landmark.
 */
export default function StudentApplications({
  applications,
  loading = false,
  error = false,
  onRetry,
  preview = false,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const detailsRef = useRef(null);
  const pendingFocus = useRef(false);

  const source =
    preview && applications === undefined
      ? PREVIEW_APPLICATIONS
      : applications;

  const { records, invalid } = useMemo(
    () => prepareApplications(source),
    [source],
  );

  const isLoading = Boolean(loading);
  const hasError = Boolean(error) || invalid;

  const ready =
    records !== null &&
    !isLoading &&
    !hasError;

  const requestedId = text(
    new URLSearchParams(location.search).get(
      SELECTION_PARAM,
    ),
  );

  const selectedApplication = ready
    ? selectedRecord(records, requestedId)
    : null;

  const selectionUnavailable =
    ready &&
    records.length > 0 &&
    Boolean(requestedId) &&
    !selectedApplication;

  const attentionCount = ready
    ? records.filter(
        (application) => application.requiresAction,
      ).length
    : null;

  // Move focus after an explicit selection.
  // Initial loading and ordinary data refreshes do not move focus.
  useEffect(() => {
    if (
      !pendingFocus.current ||
      !selectedApplication
    ) {
      return;
    }

    pendingFocus.current = false;

    focusDetails(detailsRef.current);
  }, [selectedApplication, location.search]);

  function handleSelect(value) {
    const id = recordId(value);

    if (
      !ready ||
      !records.some(
        (application) => application.id === id,
      )
    ) {
      return;
    }

    if (requestedId === id) {
      focusDetails(detailsRef.current);
      return;
    }

    pendingFocus.current = true;

    navigate(applicationLocation(location, id), {
      // Explicit selections remain accessible through Back/Forward.
      replace: false,
      preventScrollReset: true,
      state: location.state,
    });
  }

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        display: "grid",
        gap: SECTION_GAP,
      }}
    >
      <StudentApplicationsHeader
        totalApplications={
          ready ? records.length : null
        }
        attentionCount={attentionCount}
        loading={isLoading}
      />

      {selectionUnavailable && (
        <Alert
          severity="info"
          role="status"
          sx={{
            borderRadius: 2,
          }}
        >
          This application is not available in your list.
          Choose an application below.
        </Alert>
      )}

      <StudentApplicationSelector
        applications={records}
        selectedId={selectedApplication?.id ?? null}
        onSelect={handleSelect}
        loading={isLoading}
        error={hasError}
        onRetry={
          typeof onRetry === "function"
            ? onRetry
            : undefined
        }
      />

      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={visuallyHidden}
      >
        {selectedApplication
          ? `Selected application: ${selectedApplication.programmeName}, ${selectedApplication.institutionName}.`
          : ""}
      </Box>

      {selectedApplication && (
        <Box
          key={selectedApplication.id}
          ref={detailsRef}
          component="section"
          tabIndex={-1}
          aria-label={`Application details: ${
            selectedApplication.reference ||
            selectedApplication.programmeName
          }`}
          sx={{
            minWidth: 0,
            display: "grid",
            gap: SECTION_GAP,
            containerType: "inline-size",
            containerName: "application-details",
            scrollMarginTop:
              "var(--student-scroll-offset, 96px)",
            borderRadius: "16px",

            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "text.primary",
              outlineOffset: 4,
            },
          }}
        >
          <StudentApplicationSummary
            application={selectedApplication}
          />

          <Box
            sx={{
              minWidth: 0,
              display: "grid",
              gap: SECTION_GAP,
              alignItems: "start",
              gridTemplateColumns: "minmax(0, 1fr)",
              gridTemplateAreas:
                '"actions" "tracker" "updates"',

              "@container application-details (min-width: 960px)": {
                gridTemplateColumns:
                  "minmax(0, 1.1fr) minmax(0, 1fr)",
                gridTemplateAreas:
                  '"actions tracker" "updates tracker"',
              },
            }}
          >
            <Box
              sx={{
                gridArea: "actions",
                minWidth: 0,
              }}
            >
              <StudentApplicationActions
                actions={selectedApplication.actions}
                waitingMessage={
                  selectedApplication.waitingMessage
                }
              />
            </Box>

            <Box
              sx={{
                gridArea: "tracker",
                minWidth: 0,
              }}
            >
              <StudentApplicationTracker
                stages={selectedApplication.stages}
              />
            </Box>

            <Box
              sx={{
                gridArea: "updates",
                minWidth: 0,
              }}
            >
              <StudentApplicationUpdates
                updates={selectedApplication.updates}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// Fictional examples are isolated below so this replacement is self-contained.
// Production workflow stages and application records must come from the API.

const PREVIEW_STAGE_DEFINITIONS = [
  [
    "Application opened",
    "Your application is created and assigned to a consultant.",
    "Hi-Touch Global",
  ],
  [
    "Study preferences confirmed",
    "Your destination, study level and intake are reviewed.",
    "Your consultant",
  ],
  [
    "Programme confirmed",
    "Your programme choice is confirmed before preparation continues.",
    "Your consultant",
  ],
  [
    "Supporting documents",
    "Provide the requested documents for your application.",
    "You",
  ],
  [
    "Application checks",
    "Your details and documents are checked for completeness.",
    "Your consultant",
  ],
  [
    "Submitted to institution",
    "Your completed application is submitted to the institution.",
    "Hi-Touch Global",
  ],
  [
    "Institution review",
    "The institution reviews your application.",
    "The institution",
  ],
  [
    "Decision received",
    "The institution’s recorded decision is shared with you.",
    "Your consultant",
  ],
  [
    "Offer requirements",
    "Review the conditions and next steps that apply to your outcome.",
    "You and your consultant",
  ],
  [
    "Application closed",
    "The final outcome and completed requirements are recorded.",
    "Your consultant",
  ],
];

const PREVIEW_APPLICATIONS = [
  {
    id: "preview-1",
    reference: "HTG-1001",
    institutionName: "Northbridge University",
    programmeName: "MSc International Business",
    country: "United Kingdom",
    intakeLabel: "September 2027",
    statusLabel: "Documents requested",
    currentStageIndex: 3,

    actions: [
      {
        id: "transcript",
        category: "Document",
        dueDate: "2026-11-04",
        title: "Provide your complete academic transcript",
        description:
          "A clear copy of your academic record is required for review.",
        reviewNote:
          "Please include the grading scale and all pages. The final page was missing from the previous upload.",
        instructions: [
          "Include every page in the correct order.",
          "Make sure your name, grades and institution details are readable.",
          "Include your institution’s grading scale.",
        ],
      },
      {
        id: "statement",
        category: "Supporting statement",
        dueDate: "2026-11-06",
        title: "Prepare your personal statement",
        description:
          "Explain your course choice, relevant experience and study goals.",
        instructions: [
          "Explain why you selected this programme.",
          "Connect your previous study or work to the course.",
          "Describe what you want to achieve after your studies.",
        ],
      },
      {
        id: "profile",
        category: "Personal details",
        dueDate: "2026-11-07",
        title: "Check your personal information",
        description:
          "Review your name, contact details and education history.",
        to: "/student/profile",
        actionLabel: "Review my profile",
      },
    ],

    updates: [
      {
        id: "documents-requested",
        createdAt: "2026-10-27T10:30:00Z",
        title: "Supporting documents requested",
        body:
          "Your transcript and personal statement are needed before application checks can continue.",
        attachment: {
          name: "Document preparation checklist",
          content:
            "Include all transcript pages and the grading scale.\n\nExplain your course choice and study goals in your personal statement.\n\nCheck that your profile matches your supporting documents.",
        },
      },
      {
        id: "programme-confirmed",
        createdAt: "2026-10-14T10:00:00Z",
        title: "Your programme choice was confirmed",
        body:
          "MSc International Business has been recorded for this application.",
      },
      {
        id: "preferences-confirmed",
        createdAt: "2026-10-12T10:00:00Z",
        title: "Study preferences reviewed",
        body:
          "Your preferred destination and September 2027 intake have been recorded.",
      },
      {
        id: "application-opened",
        createdAt: "2026-10-10T10:00:00Z",
        title: "Application opened",
        body:
          "Your application was created and assigned to your consultant.",
      },
    ],
  },

  {
    id: "preview-2",
    reference: "HTG-1002",
    institutionName: "Lakeside University",
    programmeName: "MSc Business Analytics",
    country: "Canada",
    intakeLabel: "September 2027",
    statusLabel: "Under review",
    currentStageIndex: 6,

    actions: [],

    waitingMessage:
      "Your application is with the institution for review. Any additional requirements will appear here.",

    updates: [
      {
        id: "review-started",
        createdAt: "2026-10-27T09:00:00Z",
        title: "Institution review in progress",
        body:
          "The institution is reviewing your application. No additional documents have been requested.",
        attachment: {
          name: "While your application is under review",
          content:
            "Keep your contact details up to date.\n\nCheck this application for updates and additional requirements.\n\nYour consultant will share the institution’s decision when it is recorded.",
        },
      },
      {
        id: "submitted",
        createdAt: "2026-10-20T10:00:00Z",
        title: "Application submitted",
        body:
          "Your application and supporting documents were sent to the institution.",
      },
      {
        id: "checked",
        createdAt: "2026-10-18T10:00:00Z",
        title: "Application checks completed",
        body:
          "Your details were reviewed before submission.",
      },
    ],
  },

  {
    id: "preview-3",
    reference: "HTG-1003",
    institutionName: "Westhaven University",
    programmeName: "MSc Management",
    country: "United Kingdom",
    intakeLabel: "January 2028",
    statusLabel: "Offer requirements",
    currentStageIndex: 8,

    actions: [
      {
        id: "offer-review",
        category: "Offer",
        dueDate: "2026-11-10",
        title: "Review your offer requirements",
        description:
          "Read the offer conditions and discuss any questions with your consultant.",
        instructions: [
          "Check the programme and intake listed in the offer.",
          "Review each condition and its deadline.",
          "Ask your consultant to clarify anything you do not understand.",
        ],
      },
      {
        id: "intake-review",
        category: "Study plans",
        dueDate: "2026-11-12",
        title: "Review your intended intake",
        description:
          "Check that the January 2028 intake still matches your study plans.",
        instructions: [
          "Review the intake in your application overview.",
          "Discuss any change of plan with your consultant before making a decision.",
        ],
      },
    ],

    updates: [
      {
        id: "conditions-shared",
        createdAt: "2026-10-27T12:00:00Z",
        title: "Your next steps have been shared",
        body:
          "Review the offer requirements and your intended intake with your consultant.",
        attachment: {
          name: "Offer review notes",
          content:
            "Programme: MSc Management\nIntake: January 2028\n\nReview the formal offer and its conditions with your consultant. These notes do not replace the institution’s official letter.",
        },
      },
      {
        id: "decision",
        createdAt: "2026-10-24T10:00:00Z",
        title: "Conditional offer recorded",
        body:
          "Your consultant will explain the recorded offer requirements.",
      },
      {
        id: "review-completed",
        createdAt: "2026-10-22T10:00:00Z",
        title: "Institution review completed",
        body:
          "The institution completed its review of your application.",
      },
    ],
  },
].map(({ currentStageIndex, ...application }) => ({
  ...application,

  studyLevel: "Postgraduate",
  studyMode: "Full time",
  consultantName: "Amara Bello",
  updatedAt: application.updates[0].createdAt,
  requiresAction: application.actions.length > 0,

  stages: PREVIEW_STAGE_DEFINITIONS.map(
    ([label, description, owner], index) => ({
      id: `stage-${index + 1}`,
      label,
      description,
      owner,

      state:
        index < currentStageIndex
          ? "complete"
          : index === currentStageIndex
            ? "current"
            : "upcoming",

      completedAt:
        index < currentStageIndex
          ? `2026-10-${String(10 + index * 2).padStart(
              2,
              "0",
            )}T10:00:00Z`
          : null,
    }),
  ),

  updates: application.updates.map((update) => ({
    ...update,
    visibility: "student",
    authorName: "Amara Bello",
    authorRole: "Consultant",
  })),
}));