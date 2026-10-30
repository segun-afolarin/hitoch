import { useState } from "react";
import { Box } from "@mui/material";
import { useOutletContext } from "react-router-dom";

import StudentWelcome from "../../components/student/home/StudentWelcome";
import StudentActionList from "../../components/student/home/StudentActionList";
import StudentNextDeadline from "../../components/student/home/StudentNextDeadline";
import StudentProfileProgress from "../../components/student/home/StudentProfileProgress";

function createPreviewData() {
  function dateInDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const actions = [
    {
      id: "preview-passport",
      kind: "document",
      title: "Upload your passport",
      description:
        "Upload a clear copy of your passport identification page.",
      dueDate: dateInDays(2),
      actionLabel: "Upload document",
      to: "/student/documents",
    },
    {
      id: "preview-qualifications",
      kind: "profile",
      title: "Complete your qualifications",
      description:
        "Add your education history so your consultant can review your study options.",
      dueDate: null,
      actionLabel: "Continue profile",
      to: "/student/profile/qualifications",
    },
    {
      id: "preview-transcript",
      kind: "document",
      title: "Update your academic transcript",
      description:
        "Provide a complete copy of your transcript for document review.",
      reviewNote:
        "Please include every page. The grading scale is missing from the current copy.",
      dueDate: dateInDays(5),
      actionLabel: "Replace document",
      to: "/student/documents",
    },
  ];

  return {
    actions,

    // Uses the same requirement and date as the Action centre.
    deadline: {
      title: actions[0].title,
      description:
        "Submit this document so your consultant can continue the review.",
      dueDate: actions[0].dueDate,
      to: actions[0].to,
      actionLabel: "View requirement",
    },

    profile: {
      completedSections: 4,
      totalSections: 7,
      nextSection: {
        label: "Qualifications",
        to: "/student/profile/qualifications",
      },
    },
  };
}

export default function StudentHome({
  preview = false,
  actions = null,
  deadline,
  profile = null,
  loading = false,
  error = false,
  onRetry,
}) {
  const { student } = useOutletContext() ?? {};
  const [previewData] = useState(createPreviewData);

  // Preview data is used only when no live data has been supplied.
  const showPreview =
    preview &&
    actions === null &&
    deadline === undefined &&
    profile === null &&
    !loading &&
    !error;

  const displayedActions = showPreview ? previewData.actions : actions;
  const displayedDeadline = showPreview ? previewData.deadline : deadline;
  const displayedProfile = showPreview ? previewData.profile : profile;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, md: 3 },
        minWidth: 0,
      }}
    >
      <StudentWelcome
        studentName={student?.name || "Afolarin Oluwasegun"}
      />

      <StudentActionList
        items={displayedActions}
        loading={loading}
        error={error}
        onRetry={onRetry}
        preview={showPreview}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "repeat(2, minmax(0, 1fr))",
          },
          alignItems: "stretch",
          gap: { xs: 2, md: 3 },
          minWidth: 0,
        }}
      >
        <StudentNextDeadline
          deadline={displayedDeadline}
          loading={loading}
          error={error}
          onRetry={onRetry}
          preview={showPreview}
        />

        <StudentProfileProgress
          profile={displayedProfile}
          loading={loading}
          error={error}
          onRetry={onRetry}
          preview={showPreview}
        />
      </Box>
    </Box>
  );
}