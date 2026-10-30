import {
  Box,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

function Metric({
  label,
  value,
  loading,
  accent = false,
}) {
  const valid = Number.isSafeInteger(value) && value >= 0;

  return (
    <Box sx={{ minWidth: 0 }}>
      {loading ? (
        <Skeleton
          animation={false}
          width={48}
          height={44}
        />
      ) : (
        <Typography
          component="p"
          aria-label={
            valid ? undefined : `${label}: not available`
          }
          sx={{
            m: 0,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-1px",
            fontVariantNumeric: "tabular-nums",
            color: "text.primary",
          }}
        >
          {valid ? value.toLocaleString() : "—"}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          mt: 1,
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            flexShrink: 0,
            bgcolor: accent
              ? "secondary.main"
              : "primary.main",
          }}
        />

        <Typography
          sx={{
            fontSize: 12,
            lineHeight: 1.5,
            color: "text.secondary",
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

export default function StudentApplicationsHeader({
  totalApplications = null,
  attentionCount = null,
  loading = false,
}) {
  return (
    <Paper
      component="header"
      variant="outlined"
      aria-busy={loading}
      sx={{
        containerType: "inline-size",
        containerName: "applications-header",
        minWidth: 0,
        bgcolor: "#FFFFFF",
        borderColor: "#E5EAEE",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(64,64,65,0.025)",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: 3,
          p: { xs: 2.5, sm: 3.5 },

          "@container applications-header (min-width: 720px)": {
            gridTemplateColumns: "minmax(0, 1fr) auto",
            alignItems: "center",
            gap: 4,
          },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1.5,
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 20,
                height: 3,
                borderRadius: 2,
                bgcolor: "secondary.main",
              }}
            />

            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "1.4px",
                color: "text.secondary",
                textTransform: "uppercase",
              }}
            >
              Study journey
            </Typography>
          </Box>

          <Typography
            component="h1"
            sx={{
              m: 0,
              fontSize: { xs: 28, sm: 34 },
              fontWeight: 700,
              letterSpacing: "-1px",
              lineHeight: 1.2,
              color: "text.primary",
            }}
          >
            My applications
          </Typography>

          <Typography
            sx={{
              mt: 1.25,
              maxWidth: 470,
              fontSize: 14,
              lineHeight: 1.8,
              color: "text.secondary",
            }}
          >
            Keep track of your study plans and see which
            applications need your attention.
          </Typography>
        </Box>

        <Box
          sx={(theme) => ({
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: 2.5,
            pt: 2.5,
            borderTop: "1px solid #EDF0F3",

            "& > :last-child": {
              pl: 2.5,
              borderLeft: "1px solid #E5EAEE",
            },

            "@container applications-header (min-width: 720px)": {
              minWidth: 260,
              p: 2.5,
              borderTop: 0,
              bgcolor: alpha(
                theme.palette.primary.main,
                0.035,
              ),
              borderRadius: "12px",
            },
          })}
        >
          <Metric
            label="Applications"
            value={totalApplications}
            loading={loading}
          />

          <Metric
            label="Need attention"
            value={attentionCount}
            loading={loading}
            accent
          />
        </Box>
      </Box>
    </Paper>
  );
}