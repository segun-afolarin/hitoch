import { useState } from "react";
import { Link as RouterLink, NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  SvgIcon,
  Typography,
} from "@mui/material";

const ACTIVE_BLUE = "#00AEEF";
const SIDEBAR_BACKGROUND = "#FFFFFF";

const ICON_PATHS = {
  home:
    "M3 10 12 3l9 7M5 9v11h5v-6h4v6h5V9",
  profile:
    "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-2a8 8 0 0 1 16 0v2",
  applications:
    "M8 4H5a2 2 0 0 0-2 2v14h18V6a2 2 0 0 0-2-2h-3M8 3h8v4H8zM7 12h10M7 16h6",
  documents:
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5",
  shortlist:
    "M6 3h12v18l-6-4-6 4z",
  explore:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M16 8l-3 5-5 3 3-5z",
  visa:
    "M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6zM8 12l3 3 5-6",
  forms:
    "M8 4H5a2 2 0 0 0-2 2v14h18V6a2 2 0 0 0-2-2h-3M8 3h8v4H8zM7 12l1 1 2-2M13 12h4M7 17l1 1 2-2M13 17h4",
  messages:
    "M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5M7 10h10M7 14h6",
  fees:
    "M3 5h18v14H3zM3 10h18M7 15h3M14 15h3",
  services:
    "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  resources:
    "M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1zM12 5v15",
  close:
    "M6 6l12 12M6 18 18 6",
  chevron:
    "m9 5 7 7-7 7",
};

const NAVIGATION_GROUPS = [
  {
    label: "My space",
    items: [
      {
        label: "What's next",
        to: "/student",
        icon: "home",
        end: true,
      },
      {
        label: "My profile",
        to: "/student/profile",
        icon: "profile",
      },
    ],
  },
  {
    label: "Study journey",
    items: [
      {
        label: "Applications",
        to: "/student/applications",
        icon: "applications",
      },
      {
        label: "Documents",
        to: "/student/documents",
        icon: "documents",
      },
      {
        label: "My shortlist",
        to: "/student/shortlist",
        icon: "shortlist",
      },
      {
        label: "Explore programs",
        to: "/student/explore-programs",
        icon: "explore",
      },
    ],
  },
  {
    label: "Visa",
    items: [
      {
        label: "Study permit",
        to: "/student/study-permit",
        icon: "visa",
      },
      {
        label: "Forms",
        to: "/student/forms",
        icon: "forms",
      },
    ],
  },
  {
    label: "Support & payments",
    items: [
      {
        label: "Messages",
        to: "/student/messages",
        icon: "messages",
      },
      {
        label: "Fees",
        to: "/student/fees",
        icon: "fees",
      },
      {
        label: "Additional services",
        to: "/student/services",
        icon: "services",
      },
      {
        label: "Resources",
        to: "/student/resources",
        icon: "resources",
      },
    ],
  },
];

function NavigationIcon({ name, ...props }) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path
        d={ICON_PATHS[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function StudentAvatar() {
  return (
    <SvgIcon
      viewBox="0 0 64 64"
      aria-hidden="true"
      sx={{
        width: 48,
        height: 48,
        display: "block",
        flexShrink: 0,
      }}
    >
      {/* Background */}
      <rect
        x="1"
        y="1"
        width="62"
        height="62"
        rx="19"
        fill="#FFFFFF"
        stroke="#E5EBEF"
        strokeWidth="2"
      />

      {/* Shirt */}
      <path
        d="M10 58c1-12 9-19 22-19s21 7 22 19v3H10z"
        fill="#00AEEF"
      />

      {/* Neck */}
      <path
        d="M26 34h12v10c-3 4-9 4-12 0z"
        fill="#B97853"
      />

      {/* Shirt collar */}
      <path
        d="m24 42 8 7-6 6-6-11z"
        fill="#FFFFFF"
      />
      <path
        d="m40 42-8 7 6 6 6-11z"
        fill="#FFFFFF"
      />

      {/* Ears */}
      <ellipse cx="20" cy="27" rx="3" ry="5" fill="#CC8D65" />
      <ellipse cx="44" cy="27" rx="3" ry="5" fill="#CC8D65" />

      {/* Face */}
      <path
        d="M20 22c0-9 5-14 12-14s12 5 12 14v8c0 9-6 15-12 15s-12-6-12-15z"
        fill="#D99B73"
      />

      {/* Hair */}
      <path
        d="M19 25v-7C19 9 24 5 32 5c9 0 14 5 14 13v8l-5-5-1-7c-6 4-12 4-17 3l-1 7z"
        fill="#29323A"
      />

      {/* Eyes */}
      <circle cx="27" cy="27" r="1.4" fill="#29323A" />
      <circle cx="37" cy="27" r="1.4" fill="#29323A" />

      {/* Nose */}
      <path
        d="M32 28v5h2"
        fill="none"
        stroke="#B97853"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Smile */}
      <path
        d="M28 36c2.5 2 5.5 2 8 0"
        fill="none"
        stroke="#874B36"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

export default function StudentSidebar({
  drawerWidth = 272,
  navigationId = "student-navigation",
  isDesktop = false,
  mobileOpen = false,
  onClose,
  logoSrc = "/images/logo.png",
  studentName = "Afolarin Oluwasegun",
  reduceMotion = false,
}) {
  const [failedLogo, setFailedLogo] = useState(null);

  const showLogo = Boolean(logoSrc) && failedLogo !== logoSrc;

  return (
    <Box
      component="aside"
      sx={{
        width: { lg: drawerWidth },
        flexShrink: 0,
      }}
    >
      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={isDesktop || mobileOpen}
        onClose={onClose}
        transitionDuration={reduceMotion ? 0 : 220}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            id: navigationId,
            role: isDesktop ? undefined : "dialog",
            "aria-modal": isDesktop ? undefined : true,
            "aria-label": "Student navigation",
            sx: {
              width: drawerWidth,
              maxWidth: "calc(100vw - 24px)",
              height: "100%",
              boxSizing: "border-box",
              overflow: "hidden",
              bgcolor: SIDEBAR_BACKGROUND,
              backgroundImage: "none",
              borderRight: "1px solid #E8EDF1",
              boxShadow: isDesktop
                ? "none"
                : "8px 0 32px rgba(0, 0, 0, 0.08)",
            },
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            bgcolor: SIDEBAR_BACKGROUND,
          }}
        >
          {/* Larger logo area */}
          <Box
            sx={{
              position: "relative",
              minHeight: 124,
              flexShrink: 0,
              px: 2.5,
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid #E8EDF1",
              bgcolor: SIDEBAR_BACKGROUND,
            }}
          >
            <Box
              component={RouterLink}
              to="/student"
              onClick={onClose}
              aria-label="Hi-Touch Global student home"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                minWidth: 0,
                maxWidth: 216,
                color: "inherit",
                textDecoration: "none",
                borderRadius: 1,

                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.dark",
                  outlineOffset: 4,
                },
              }}
            >
              {showLogo ? (
                <Box
                  component="img"
                  src={logoSrc}
                  alt="Hi-Touch Global"
                  onError={() => setFailedLogo(logoSrc)}
                  sx={{
                    display: "block",
                    width: "100%",
                    height: 72,
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                />
              ) : (
                <Box sx={{ py: 1.5, textAlign: "center" }}>
                  <Typography
                    component="span"
                    sx={{
                      display: "block",
                      fontSize: 25,
                      lineHeight: 1.2,
                      fontWeight: 800,
                      letterSpacing: "-0.9px",
                      color: "text.primary",
                    }}
                  >
                    HI-TOUCH
                  </Typography>

                  <Typography
                    component="span"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "5px",
                      color: "primary.dark",
                    }}
                  >
                    GLOBAL
                  </Typography>
                </Box>
              )}

              <Typography
                component="span"
                sx={{
                  display: "block",
                  mt: 0.75,
                  fontSize: 9.5,
                  fontWeight: 700,
                  lineHeight: 1.5,
                  letterSpacing: "1.8px",
                  textTransform: "uppercase",
                  color: "text.secondary",
                }}
              >
                Student portal
              </Typography>
            </Box>
          </Box>

          {/* Mobile close control */}
          {!isDesktop && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                px: 1.5,
                pt: 0.75,
                bgcolor: SIDEBAR_BACKGROUND,
              }}
            >
              <IconButton
                onClick={onClose}
                aria-label="Close navigation"
                sx={{
                  width: 40,
                  height: 40,
                  color: "text.primary",
                }}
              >
                <NavigationIcon name="close" fontSize="small" />
              </IconButton>
            </Box>
          )}

          {/* Scrollable navigation */}
          <Box
            component="nav"
            aria-label="Student portal"
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overscrollBehavior: "contain",
              px: 1.75,
              py: 2,
              bgcolor: SIDEBAR_BACKGROUND,
              scrollbarWidth: "thin",
              scrollbarColor: "#DCE3E8 #FFFFFF",

              "&::-webkit-scrollbar": {
                width: 4,
              },

              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#DCE3E8",
                borderRadius: 10,
              },

              "&::-webkit-scrollbar-track": {
                bgcolor: SIDEBAR_BACKGROUND,
              },
            }}
          >
            {NAVIGATION_GROUPS.map((group, groupIndex) => (
              <Box
                key={group.label}
                sx={{ mt: groupIndex === 0 ? 0 : 2.5 }}
              >
                <Typography
                  component="p"
                  sx={{
                    px: 1.5,
                    mb: 1,
                    fontSize: 10,
                    lineHeight: 1.5,
                    fontWeight: 700,
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  {group.label}
                </Typography>

                <List disablePadding aria-label={group.label}>
                  {group.items.map((item) => (
                    <ListItem
                      key={item.to}
                      disablePadding
                      sx={{ mb: 0.5 }}
                    >
                      <ListItemButton
                        component={NavLink}
                        to={item.to}
                        end={item.end}
                        onClick={onClose}
                        sx={(theme) => ({
                          minHeight: 46,
                          px: 1.75,
                          py: 1.25,
                          borderRadius: 1.5,
                          bgcolor: SIDEBAR_BACKGROUND,
                          color: "text.primary",
                          transition: reduceMotion
                            ? "none"
                            : theme.transitions.create(
                                ["background-color", "color"],
                                { duration: 160 },
                              ),

                          "&:hover": {
                            bgcolor: "#F3F8FB",
                          },

                          "&.active, &.active:hover": {
                              bgcolor: ACTIVE_BLUE,
                              color: "#FFFFFF",

                            "& .student-navigation-label": {
                             color: "#FFFFFF",
                              fontWeight: 700,
                           },
 
                            "& .MuiListItemIcon-root": {
                               color: "#FFFFFF",
                                 },
                                  },

                          "&.Mui-focusVisible": {
                            outline: `2px solid ${theme.palette.primary.dark}`,
                            outlineOffset: -2,
                          },
                        })}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 35,
                            color: "text.secondary",
                          }}
                        >
                          <NavigationIcon
                            name={item.icon}
                            sx={{ fontSize: 21 }}
                          />
                        </ListItemIcon>

                        <Typography
                          component="span"
                          className="student-navigation-label"
                          sx={{
                            fontSize: 13.5,
                            lineHeight: 1.5,
                            fontWeight: 500,
                          }}
                        >
                          {item.label}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box>

          {/* Student profile footer */}
          <Box
            sx={{
              flexShrink: 0,
              p: 1.75,
              borderTop: "1px solid #E8EDF1",
              bgcolor: SIDEBAR_BACKGROUND,
            }}
          >
            <Box
              component={RouterLink}
              to="/student/profile"
              onClick={onClose}
              aria-label={`View ${studentName}'s profile`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                minHeight: 64,
                px: 0.75,
                py: 1,
                borderRadius: 1.5,
                color: "text.primary",
                textDecoration: "none",

                "&:hover": {
                  bgcolor: "#F7FAFC",
                },

                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.dark",
                  outlineOffset: -2,
                },
              }}
            >
              <StudentAvatar />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    fontWeight: 700,
                    overflowWrap: "break-word",
                  }}
                >
                  {studentName}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.25,
                    fontSize: 11,
                    lineHeight: 1.5,
                  }}
                >
                  Student account
                </Typography>
              </Box>

              <NavigationIcon
                name="chevron"
                sx={{
                  fontSize: 16,
                  flexShrink: 0,
                  color: "text.secondary",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}