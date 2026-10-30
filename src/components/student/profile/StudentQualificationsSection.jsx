import { useId, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Skeleton,
  SvgIcon,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import StudentQualificationDialog from "./StudentQualificationDialog";

function QualificationIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="m2 8 10-5 10 5-10 5L2 8Zm4 3v6c4 3 8 3 12 0v-6M22 8v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function AddIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function qualificationTitle(record) {
  let title;

  if (record.type === "other") {
    title = record.title || "Other qualification";
  } else if (record.type === "degree") {
    title = "Degree";
  } else {
    title = record.type?.toUpperCase() || "Qualification";
  }

  return record.course ? `${title} · ${record.course}` : title;
}

function Detail({ label, value }) {
  return (
    <Box>
      <Typography
        component="dt"
        sx={{ fontSize: 11.5, color: "text.secondary", mb: 0.5 }}
      >
        {label}
      </Typography>

      <Typography
        component="dd"
        sx={{
          m: 0,
          fontSize: 13,
          fontWeight: value ? 500 : 400,
          color: value ? "text.primary" : "text.secondary",
          overflowWrap: "anywhere",
        }}
      >
        {value || "Not added"}
      </Typography>
    </Box>
  );
}

export default function StudentQualificationsSection({
  records = null,
  loading = false,
  error = false,
  onRetry,
  onSave,
  onRemove,
  preview = false,
}) {
  const id = useId();
  const [editor, setEditor] = useState(null);

  const available = Array.isArray(records);
  const canEdit =
    available && !loading && !error && typeof onSave === "function";

  return (
    <>
      <Paper
        id="student-qualifications"
        component="section"
        aria-labelledby={`${id}-heading`}
        aria-busy={loading}
        elevation={0}
        sx={{
          minWidth: 0,
          overflow: "hidden",
          bgcolor: "#FFFFFF",
          border: "1px solid #E2E8ED",
          borderRadius: 2,
          boxShadow: "0 4px 24px rgba(64, 64, 65, 0.025)",
        }}
      >
        <Box
          sx={{
            px: { xs: 2.5, sm: 4 },
            py: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                id={`${id}-heading`}
                component="h2"
                sx={{ fontSize: 18, fontWeight: 700, color: "text.primary" }}
              >
                Qualifications
              </Typography>

              {available && records.length > 0 && !loading && !error && (
                <Typography
                  sx={{ fontSize: 12, color: "text.secondary" }}
                >
                  {records.length} {records.length === 1 ? "record" : "records"}
                </Typography>
              )}
            </Box>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13,
                lineHeight: 1.7,
                color: "text.secondary",
              }}
            >
              Your secondary and higher education history.
            </Typography>
          </Box>

          <Button
            variant="contained"
            disableElevation
            disabled={!canEdit}
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={() => setEditor({ record: null })}
            sx={{
              alignSelf: { xs: "flex-start", sm: "center" },
              flexShrink: 0,
              minHeight: 44,
              px: 2,
              fontSize: 12.5,
              bgcolor: "primary.main",
              color: "#FFFFFF",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Add qualification
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 3 }}>
            {[0, 1].map((item) => (
              <Box key={item} sx={{ py: 2, borderTop: "1px solid #EDF1F4" }}>
                <Skeleton animation={false} width="45%" height={25} />
                <Skeleton animation={false} width="65%" />
                <Skeleton animation={false} width="30%" sx={{ mt: 1 }} />
              </Box>
            ))}
          </Box>
        ) : error || !available ? (
          <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 3 }}>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {error
                ? "We couldn't load your qualifications."
                : "Qualification information is not available yet."}
            </Typography>

            {error && typeof onRetry === "function" && (
              <Button onClick={onRetry} sx={{ mt: 1, minHeight: 44 }}>
                Try again
              </Button>
            )}
          </Box>
        ) : records.length === 0 ? (
          <Box
            sx={{
              mx: { xs: 2.5, sm: 4 },
              py: 3.5,
              borderTop: "1px solid #EDF1F4",
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: 1.5,
                bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, 0.07),
                color: "primary.main",
              }}
            >
              <QualificationIcon sx={{ fontSize: 24 }} />
            </Box>

            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                Add your academic background
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  maxWidth: 510,
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "text.secondary",
                }}
              >
                Start with your WAEC, OND, HND or degree. Add a separate
                record for each qualification you have completed or are
                currently studying.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
            {records.map((record) => {
              const ongoing = record.status === "in_progress";

              return (
                <Box
                  component="li"
                  key={record.id}
                  sx={{
                    px: { xs: 2.5, sm: 4 },
                    py: 2.75,
                    borderTop: "1px solid #EDF1F4",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        component="h3"
                        sx={{
                          fontSize: 15,
                          fontWeight: 600,
                          lineHeight: 1.6,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {qualificationTitle(record)}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.4,
                          fontSize: 13,
                          color: "text.secondary",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {record.institution}
                      </Typography>

                      <Typography
                        component="span"
                        sx={{
                          mt: 1.25,
                          px: 1,
                          py: 0.35,
                          display: "inline-block",
                          borderRadius: 1,
                          fontSize: 11,
                          fontWeight: 600,
                          color: "text.primary",
                          bgcolor: (theme) =>
                            alpha(
                              ongoing
                                ? theme.palette.secondary.main
                                : theme.palette.primary.main,
                              0.09
                            ),
                        }}
                      >
                        {ongoing
                          ? "In progress"
                          : record.status === "completed"
                            ? "Completed"
                            : "Status not added"}
                      </Typography>
                    </Box>

                    <Button
                      variant="outlined"
                      disabled={!canEdit}
                      onClick={() => setEditor({ record })}
                      aria-label={`Edit ${qualificationTitle(record)} at ${record.institution}`}
                      sx={{
                        minHeight: 40,
                        minWidth: 62,
                        px: 1.5,
                        flexShrink: 0,
                        fontSize: 12,
                        color: "text.primary",
                        borderColor: "#DCE3E9",
                        "&:hover": {
                          bgcolor: "#F8FAFB",
                          borderColor: "#BFCAD3",
                        },
                      }}
                    >
                      Edit
                    </Button>
                  </Box>

                  <Box
                    component="dl"
                    sx={{
                      m: 0,
                      mt: 2,
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 2,
                      maxWidth: 600,
                    }}
                  >
                    <Detail
                      label={ongoing ? "Expected completion" : "Completion year"}
                      value={record.year}
                    />

                    {!ongoing && (
                      <Detail label="Result / grade" value={record.result} />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {available && !loading && !error && (
          <Box
            sx={{
              px: { xs: 2.5, sm: 4 },
              py: 2,
              borderTop: "1px solid #EDF1F4",
            }}
          >
            <Typography
              sx={{ fontSize: 11.5, color: "text.secondary", lineHeight: 1.7 }}
            >
              Certificates and transcripts are managed in Documents.
              {preview && " Preview changes reset when you leave or refresh."}
            </Typography>
          </Box>
        )}
      </Paper>

      {editor && (
        <StudentQualificationDialog
          record={editor.record}
          onSave={onSave}
          onRemove={onRemove}
          onClose={() => setEditor(null)}
          preview={preview}
        />
      )}
    </>
  );
}