import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  GlobalStyles,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import StudentSidebar from "./StudentSidebar";
import StudentTopbar from "./StudentTopbar";

const SIDEBAR_WIDTH = 280;
const NAVIGATION_ID = "student-navigation";
const CONTENT_ID = "student-main-content";
const LAYOUT_ID = "student-dashboard-layout";

export default function StudentLayout({
  student = null,
  logoSrc = "/images/logo.png",
  notifications = [],
  notificationsLoading = false,
  notificationsError = false,
  onOpenAccountSettings,
  onSignOut,
  children,
}) {
  const theme = useTheme();
  const { pathname } = useLocation();

  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const [mobileOpen, setMobileOpen] = useState(false);

  const contentRef = useRef(null);
  const previousPathRef = useRef(pathname);

  const studentDetails = {
    ...student,
    name: student?.name?.trim() || "Afolarin Oluwasegun",
  };

  // Close the mobile drawer when navigating or changing layout mode.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, isDesktop]);

  // Start a different page at the top of the content area.
  // Query-string changes do not reset the scroll position.
  useEffect(() => {
    if (previousPathRef.current === pathname) return;

    previousPathRef.current = pathname;

    const frameId = window.requestAnimationFrame(() => {
      const content = contentRef.current;

      if (!content) return;

      content.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      content.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  function handleSkipToContent(event) {
    event.preventDefault();

    contentRef.current?.focus({ preventScroll: true });

    contentRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }

  return (
    <>
      {/* These rules apply only while the student layout is mounted. */}
      <GlobalStyles
        styles={{
          [`html:has(#${LAYOUT_ID})`]: {
            height: "100%",
            overflow: "hidden",
          },

          [`body:has(#${LAYOUT_ID})`]: {
            display: "block",
            width: "100%",
            height: "100%",
            minWidth: 0,
            margin: 0,
            padding: 0,
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          },

          [`#root:has(#${LAYOUT_ID})`]: {
            display: "block",
            width: "100%",
            height: "100%",
            minWidth: 0,
            maxWidth: "none",
            margin: 0,
            padding: 0,
            textAlign: "left",
          },

          [`#${LAYOUT_ID}, #${LAYOUT_ID} *, #${LAYOUT_ID} *::before, #${LAYOUT_ID} *::after`]:
            {
              boxSizing: "border-box",
            },
        }}
      />

      <Box
        id={LAYOUT_ID}
        sx={{
          display: "flex",
          width: "100%",
          height: "100vh",
          minWidth: 0,
          overflow: "hidden",
          bgcolor: "#FFFFFF",
          color: "text.primary",
          fontFamily: theme.typography.fontFamily,
          textAlign: "left",

          "@supports (height: 100dvh)": {
            height: "100dvh",
          },
        }}
      >
        {/* Keyboard accessibility */}
        <Box
          component="a"
          href={`#${CONTENT_ID}`}
          onClick={handleSkipToContent}
          sx={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: theme.zIndex.modal + 1,
            px: 2,
            py: 1.25,
            borderRadius: 1.5,
            bgcolor: "#FFFFFF",
            color: "text.primary",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-200%)",

            "&:focus": {
              transform: "translateY(0)",
              outline: `2px solid ${theme.palette.primary.dark}`,
              outlineOffset: 3,
            },
          }}
        >
          Skip to main content
        </Box>

        {/* Sidebar manages its own navigation scrolling. */}
        <StudentSidebar
          drawerWidth={SIDEBAR_WIDTH}
          navigationId={NAVIGATION_ID}
          isDesktop={isDesktop}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          logoSrc={logoSrc}
          studentName={studentDetails.name}
          reduceMotion={reduceMotion}
        />

        {/* Workspace beside the sidebar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 0%",
            width: 0,
            minWidth: 0,
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Stationary header */}
          <Box
            sx={{
              position: "relative",
              flexShrink: 0,
              zIndex: theme.zIndex.appBar,
              width: "100%",
              bgcolor: "#FFFFFF",
            }}
          >
            <StudentTopbar
              student={studentDetails}
              isDesktop={isDesktop}
              mobileOpen={mobileOpen}
              navigationId={NAVIGATION_ID}
              onOpenNavigation={() => setMobileOpen(true)}
              notifications={notifications}
              notificationsLoading={notificationsLoading}
              notificationsError={notificationsError}
              onOpenAccountSettings={onOpenAccountSettings}
              onSignOut={onSignOut}
              reduceMotion={reduceMotion}
            />
          </Box>

          {/* Page content scrolls independently of the header. */}
          <Box
            ref={contentRef}
            component="main"
            id={CONTENT_ID}
            tabIndex={-1}
            aria-label="Student dashboard content"
            sx={{
              flex: "1 1 0%",
              minWidth: 0,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "auto",
              overscrollBehavior: "contain",
              scrollBehavior: "auto",
              bgcolor: "#F7F9FC",
              outline: "none",
              scrollbarWidth: "thin",
              scrollbarColor: "#CBD5DF #F7F9FC",

              "&:focus-visible": {
                outline: `2px solid ${theme.palette.primary.dark}`,
                outlineOffset: -2,
              },

              "&::-webkit-scrollbar": {
                width: 7,
                height: 7,
              },

              "&::-webkit-scrollbar-track": {
                bgcolor: "#F7F9FC",
              },

              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#CBD5DF",
                borderRadius: 10,
                border: "2px solid #F7F9FC",
              },

              "&::-webkit-scrollbar-thumb:hover": {
                bgcolor: "#AAB8C5",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100%",
                width: "100%",
                minWidth: 0,
                px: { xs: 2, sm: 3, lg: 4 },
                pt: { xs: 2.5, sm: 3, lg: 3.5 },
                pb: { xs: 2, sm: 2.5 },
              }}
            >
              <Container
                maxWidth="xl"
                disableGutters
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  minWidth: 0,
                  width: "100%",
                }}
              >
                {/* Nested student page */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    width: "100%",
                  }}
                >
                  {children ?? (
                    <Outlet
                      context={{
                        student: studentDetails,
                      }}
                    />
                  )}
                </Box>

                {/* Footer stays after the page, never over its content. */}
                <Box
                  component="footer"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: { xs: 3, md: 4 },
                    pt: 2,
                    borderTop: "1px solid #E4EAF0",
                  }}
                >
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: 11,
                      lineHeight: 1.6,
                    }}
                  >
                    © {new Date().getFullYear()} Hi-Touch Global Ltd.
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: 11,
                      lineHeight: 1.6,
                    }}
                  >
                    Student portal
                  </Typography>
                </Box>
              </Container>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}