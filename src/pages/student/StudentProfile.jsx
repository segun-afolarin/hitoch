import { useState } from "react";
import { Box, Snackbar } from "@mui/material";
import { useOutletContext } from "react-router-dom";

import StudentProfileHeader from "../../components/student/profile/StudentProfileHeader";
import StudentContactDetailsSection from "../../components/student/profile/StudentContactDetailsSection";
import StudentQualificationsSection from "../../components/student/profile/StudentQualificationsSection";
import StudentEnglishLanguageSection from "../../components/student/profile/StudentEnglishLanguageSection";
import StudentEmploymentHistorySection from "../../components/student/profile/StudentEmploymentHistorySection";
import StudentTravelHistorySection from "../../components/student/profile/StudentTravelHistorySection";
import StudentPriorRefusalsSection from "../../components/student/profile/StudentPriorRefusalsSection";

function ProfileContent({
  student,
  personalDetails = null,
  profileProgress = null,
  onSavePersonalDetails,
  onSaveProfilePhoto,
  contactDetails = null,
  onSaveContactDetails,
  qualifications = null,
  onSaveQualification,
  onRemoveQualification,
  qualificationsLoading = false,
  qualificationsError = false,
  onRetryQualifications,
  englishLanguage = null,
  onSaveEnglishLanguage,
  englishLanguageLoading = false,
  englishLanguageError = false,
  onRetryEnglishLanguage,
  employmentHistory = null,
  onSaveEmploymentHistory,
  employmentHistoryLoading = false,
  employmentHistoryError = false,
  onRetryEmploymentHistory,
  travelHistory = null,
  onSaveTravelHistory,
  travelHistoryLoading = false,
  travelHistoryError = false,
  onRetryTravelHistory,
  priorRefusals = null,
  refusalGroundOptions = [],
  onSavePriorRefusals,
  loading = false,
}) {
  const [editedDetails, setEditedDetails] = useState(null);
  const [editedQualifications, setEditedQualifications] = useState(null);
  const [notice, setNotice] = useState("");

  const profilePreview = typeof onSavePersonalDetails !== "function";
  const qualificationsPreview = typeof onSaveQualification !== "function";

  const details = editedDetails ?? {
    fullName: personalDetails?.fullName ?? student?.name ?? "",
    preferredName: personalDetails?.preferredName ?? "",
    dateOfBirth: personalDetails?.dateOfBirth ?? "",
    nationality: personalDetails?.nationality ?? "",
  };

  const records =
    editedQualifications ??
    qualifications ??
    (qualificationsPreview ? [] : null);

  async function handleSaveDetails(values) {
    if (profilePreview) {
      setEditedDetails(values);
      setNotice("Personal details updated for this preview.");
      return;
    }

    const savedDetails = await onSavePersonalDetails(values);

    setEditedDetails(savedDetails ?? values);
    setNotice("Personal details saved.");
  }

  async function handleSaveQualification(values) {
    let savedRecord;

    if (qualificationsPreview) {
      savedRecord = {
        ...values,
        id: values.id ?? crypto.randomUUID(),
      };
    } else {
      const response = await onSaveQualification(values);

      if (
        !response ||
        !["string", "number"].includes(typeof response.id) ||
        response.id === ""
      ) {
        throw new Error("The saved qualification must include its ID.");
      }

      savedRecord = { ...values, ...response };
    }

    setEditedQualifications((current) => {
      const existing = current ?? records ?? [];

      const found = existing.some(
        (item) => String(item.id) === String(savedRecord.id)
      );

      return found
        ? existing.map((item) =>
            String(item.id) === String(savedRecord.id) ? savedRecord : item
          )
        : [...existing, savedRecord];
    });

    setNotice(
      qualificationsPreview
        ? "Qualification updated for this preview."
        : "Qualification saved."
    );
  }

  async function handleRemoveQualification(id) {
    if (!qualificationsPreview) {
      // Archive/soft-delete the record in the backend.
      await onRemoveQualification(id);
    }

    setEditedQualifications((current) =>
      (current ?? records ?? []).filter(
        (item) => String(item.id) !== String(id)
      )
    );

    setNotice(
      qualificationsPreview
        ? "Qualification removed from this preview."
        : "Qualification removed."
    );
  }

  const canRemoveQualification =
    qualificationsPreview || typeof onRemoveQualification === "function";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, md: 3 },
        minWidth: 0,
      }}
    >
      <StudentProfileHeader
        student={student}
        details={details}
        completedSections={profileProgress?.completedSections}
        totalSections={profileProgress?.totalSections ?? 7}
        loading={loading}
        onSave={handleSaveDetails}
        onSavePhoto={onSaveProfilePhoto}
        preview={profilePreview}
      />

      <StudentContactDetailsSection
        data={contactDetails}
        initialEmail={student?.email}
        onSave={onSaveContactDetails}
        loading={loading}
      />

      <StudentQualificationsSection
        records={records}
        loading={loading || qualificationsLoading}
        error={qualificationsError}
        onRetry={onRetryQualifications}
        onSave={handleSaveQualification}
        onRemove={
          canRemoveQualification ? handleRemoveQualification : undefined
        }
        preview={qualificationsPreview}
      />

      <StudentEnglishLanguageSection
        data={englishLanguage}
        onSave={onSaveEnglishLanguage}
        loading={loading || englishLanguageLoading}
        error={englishLanguageError}
        onRetry={onRetryEnglishLanguage}
      />

      <StudentEmploymentHistorySection
        data={employmentHistory}
        onSave={onSaveEmploymentHistory}
        loading={loading || employmentHistoryLoading}
        error={employmentHistoryError}
        onRetry={onRetryEmploymentHistory}
      />

      <StudentTravelHistorySection
        data={travelHistory}
        onSave={onSaveTravelHistory}
        loading={loading || travelHistoryLoading}
        error={travelHistoryError}
        onRetry={onRetryTravelHistory}
      />

      <StudentPriorRefusalsSection
        data={priorRefusals}
        groundOptions={refusalGroundOptions}
        onSave={onSavePriorRefusals}
        loading={loading}
      />

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4500}
        message={notice}
        onClose={(event, reason) => {
          if (reason !== "clickaway") setNotice("");
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

export default function StudentProfile(props) {
  const { student } = useOutletContext() ?? {};

  return (
    <ProfileContent
      {...props}
      key={student?.id ?? "student-preview"}
      student={student}
    />
  );
}