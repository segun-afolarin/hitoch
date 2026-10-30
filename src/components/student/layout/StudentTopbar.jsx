import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

import {
  Alert,
  AppBar,
  Autocomplete,
  Avatar,
  Badge,
  Box,
  ButtonBase,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Menu,
  MenuItem,
  Popover,
  Snackbar,
  SvgIcon,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

const ICON_PATHS = {
  search:
    "M21 21l-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  menu: "M4 6h16M4 12h16M4 18h16",
  bell:
    "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  chevron: "m6 9 6 6 6-6",
  profile:
    "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-2a8 8 0 0 1 16 0v2",
  settings:
    "M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6",
  logout: "M9 3H4v18h5M13 7l5 5-5 5M8 12h13",
  close: "M6 6l12 12M6 18 18 6",
};

const EMPTY_SEARCH_ITEMS = [];

const DEFAULT_SEARCH_ITEMS = [
  {
    title: "Overview",
    description: "Return to your dashboard",
    to: "/student",
    keywords: ["home", "dashboard"],
  },
  {
    title: "My profile",
    description: "View and update your information",
    to: "/student/profile",
    keywords: ["personal", "details", "account"],
  },
];

function HeaderIcon({ name, ...props }) {
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

function StudentAvatarIcon() {
  return (
    <SvgIcon
      viewBox="0 0 64 64"
      sx={{ width: "100%", height: "100%" }}
    >
      <rect
        width="64"
        height="64"
        rx="20"
        fill="#F0F9FD"
      />

      <path
        d="M10 60c1-13 9-21 22-21s21 8 22 21v4H10z"
        fill="#00AEEF"
      />

      <path
        d="M26 34h12v10c-3 4-9 4-12 0z"
        fill="#B97853"
      />

      <path
        d="m24 42 8 7-6 6-6-11z"
        fill="#FFFFFF"
      />

      <path
        d="m40 42-8 7 6 6 6-11z"
        fill="#FFFFFF"
      />

      <ellipse
        cx="20"
        cy="27"
        rx="3"
        ry="5"
        fill="#CC8D65"
      />

      <ellipse
        cx="44"
        cy="27"
        rx="3"
        ry="5"
        fill="#CC8D65"
      />

      <path
        d="M20 22c0-9 5-14 12-14s12 5 12 14v8c0 9-6 15-12 15s-12-6-12-15z"
        fill="#D99B73"
      />

      <path
        d="M19 25v-7C19 9 24 5 32 5c9 0 14 5 14 13v8l-5-5-1-7c-6 4-12 4-17 3l-1 7z"
        fill="#29323A"
      />

      <circle
        cx="27"
        cy="27"
        r="1.4"
        fill="#29323A"
      />

      <circle
        cx="37"
        cy="27"
        r="1.4"
        fill="#29323A"
      />

      <path
        d="M32 28v5h2"
        fill="none"
        stroke="#B97853"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

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

function formatNotificationDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isSearchDestination(value) {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !/[\\\u0000-\u001f]/.test(value)
  );
}

function filterSearchOptions(options, { inputValue }) {
  const terms = normalizeSearch(inputValue)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return options
    .filter((option) =>
      terms.every((term) =>
        option.searchText.includes(term),
      ),
    )
    .slice(0, 8);
}

function NotificationItem({ notification, onNavigate }) {
  const timestamp = formatNotificationDate(
    notification.createdAt,
  );

  return (
    <ListItem disablePadding divider>
      <Box
        component={notification.to ? RouterLink : "div"}
        to={notification.to || undefined}
        onClick={notification.to ? onNavigate : undefined}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          width: "100%",
          px: 2.5,
          py: 2,
          color: "text.primary",
          textDecoration: "none",
          bgcolor: notification.read
            ? "#FFFFFF"
            : "#F4FBFE",

          ...(notification.to && {
            "&:hover": {
              bgcolor: "#EDF8FD",
            },

            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.dark",
              outlineOffset: -2,
            },
          }),
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 7,
            height: 7,
            mt: 0.8,
            flexShrink: 0,
            borderRadius: "50%",
            bgcolor: notification.read
              ? "transparent"
              : "#00AEEF",
          }}
        />

        <Box
          sx={{
            minWidth: 0,
            overflowWrap: "anywhere",
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              lineHeight: 1.5,
              fontWeight: notification.read ? 500 : 700,
            }}
          >
            {notification.title}
          </Typography>

          {notification.message && (
            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
                fontSize: 12,
                lineHeight: 1.7,
              }}
            >
              {notification.message}
            </Typography>
          )}

          {timestamp && (
            <Typography
              component="time"
              dateTime={new Date(
                notification.createdAt,
              ).toISOString()}
              color="text.secondary"
              sx={{
                display: "block",
                mt: 1,
                fontSize: 10.5,
              }}
            >
              {timestamp}
            </Typography>
          )}
        </Box>
      </Box>
    </ListItem>
  );
}

function StudentHeaderSearch({
  items = EMPTY_SEARCH_ITEMS,
  notifications = EMPTY_SEARCH_ITEMS,
  reduceMotion = false,
}) {
  const navigate = useNavigate();
  const id = useId();

  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const isMobile = useMediaQuery(
    "(max-width: 599px)",
  );

  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  const motionDisabled =
    reduceMotion || prefersReducedMotion;

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false);
  const [shortcut, setShortcut] = useState("Ctrl K");

  const options = useMemo(() => {
    const pages = new Map();

    [...DEFAULT_SEARCH_ITEMS, ...items].forEach(
      (item) => {
        const title = item.title || item.label;

        if (
          !title ||
          !isSearchDestination(item.to)
        ) {
          return;
        }

        pages.set(item.to, {
          ...item,
          title,
          key: `page:${item.to}`,
          group: "Pages",
        });
      },
    );

    const updates = notifications
      .filter(
        (item) =>
          item.title &&
          isSearchDestination(item.to),
      )
      .map((item, index) => ({
        key: `update:${item.id ?? index}`,
        title: item.title,
        description:
          item.message || "Open this update",
        to: item.to,
        group: "Updates",
      }));

    return [
      ...pages.values(),
      ...updates,
    ].map((item) => ({
      ...item,
      searchText: normalizeSearch(
        [
          item.title,
          item.description,
          item.keywords,
        ]
          .flat()
          .filter(Boolean)
          .join(" "),
      ),
    }));
  }, [items, notifications]);

  useEffect(() => {
    const platform =
      navigator.userAgentData?.platform ||
      navigator.platform;

    setShortcut(
      /Mac|iPhone|iPad/i.test(platform)
        ? "⌘ K"
        : "Ctrl K",
    );

    function handleShortcut(event) {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        !(event.ctrlKey || event.metaKey) ||
        event.key.toLowerCase() !== "k"
      ) {
        return;
      }

      const activeModal =
        document.querySelector(
          '[aria-modal="true"]',
        );

      if (activeModal && !mobileSearchOpen) {
        return;
      }

      event.preventDefault();

      if (isMobile || mobileSearchOpen) {
        setMobileSearchOpen(true);
        mobileInputRef.current?.focus();
      } else {
        desktopInputRef.current?.focus();
        desktopInputRef.current?.select();
      }

      setOpen(true);
    }

    window.addEventListener(
      "keydown",
      handleShortcut,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleShortcut,
      );
    };
  }, [isMobile, mobileSearchOpen]);

  function closeSearch() {
    setOpen(false);
    setMobileSearchOpen(false);
  }

  function openResult(event, option) {
    if (!option) return;

    closeSearch();
    setQuery("");
    navigate(option.to);
  }

  function renderSearchField(inDialog = false) {
    return (
      <Box
        component="form"
        role="search"
        onSubmit={(event) =>
          event.preventDefault()
        }
      >
        <Autocomplete
          id={`${id}-${
            inDialog ? "mobile" : "desktop"
          }`}
          options={options}
          value={null}
          inputValue={query}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onInputChange={(
            event,
            value,
            reason,
          ) => {
            if (
              reason === "input" ||
              reason === "clear"
            ) {
              setQuery(value);
            }
          }}
          onChange={openResult}
          getOptionLabel={(option) =>
            option.title
          }
          groupBy={(option) => option.group}
          filterOptions={filterSearchOptions}
          openOnFocus
          autoHighlight
          clearOnBlur={false}
          clearOnEscape
          blurOnSelect
          forcePopupIcon={false}
          disablePortal={inDialog}
          clearText="Clear search"
          clearIcon={
            <HeaderIcon
              name="close"
              sx={{ fontSize: 17 }}
            />
          }
          noOptionsText={
            <Box
              sx={{
                py: 2,
                textAlign: "center",
              }}
            >
              <HeaderIcon
                name="search"
                sx={{
                  fontSize: 28,
                  mb: 1,
                  color: "#8B9AA5",
                }}
              />

              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#404041",
                }}
              >
                No results found
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12,
                  color: "#6F7C86",
                }}
              >
                Try another page name or keyword.
              </Typography>
            </Box>
          }
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                borderRadius: 2.5,
                border:
                  "1px solid #E5EBF0",
                boxShadow:
                  "0 18px 50px rgba(28, 47, 62, 0.12)",
                bgcolor: "#FFFFFF",
                backgroundImage: "none",
              },
            },

            listbox: {
              sx: {
                p: 0.75,
                maxHeight: inDialog
                  ? "calc(100dvh - 180px)"
                  : "min(380px, 60vh)",
                overscrollBehavior: "contain",

                "& .MuiAutocomplete-option": {
                  borderRadius: 1.5,
                  minHeight: 62,
                  gap: 1.5,
                  px: 1.5,
                  py: 1.25,
                },

                "& .MuiAutocomplete-option.Mui-focused":
                  {
                    bgcolor: "#EFF9FE",
                  },
              },
            },
          }}
          renderGroup={(group) => (
            <li key={group.key}>
              <Typography
                component="div"
                sx={{
                  px: 1.5,
                  py: 1.25,
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#7A8893",
                }}
              >
                {group.group}
              </Typography>

              <Box
                component="ul"
                sx={{
                  m: 0,
                  p: 0,
                  listStyle: "none",
                }}
              >
                {group.children}
              </Box>
            </li>
          )}
          renderOption={(
            { key, ...optionProps },
            option,
          ) => (
            <Box
              component="li"
              key={option.key || key}
              {...optionProps}
            >
              <Box
                aria-hidden="true"
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 34,
                  height: 34,
                  flexShrink: 0,
                  borderRadius: 1.25,
                  bgcolor:
                    option.group === "Updates"
                      ? "#FFF4EA"
                      : "#EAF7FD",
                  color:
                    option.group === "Updates"
                      ? "#A85B22"
                      : "#006B8E",
                }}
              >
                <HeaderIcon
                  name={
                    option.group === "Updates"
                      ? "bell"
                      : option.to ===
                          "/student/profile"
                        ? "profile"
                        : "menu"
                  }
                  sx={{ fontSize: 18 }}
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontSize: 13,
                    fontWeight: 650,
                    color: "#404041",
                  }}
                >
                  {option.title}
                </Typography>

                {option.description && (
                  <Typography
                    noWrap
                    sx={{
                      mt: 0.25,
                      fontSize: 11.5,
                      color: "#6F7C86",
                    }}
                  >
                    {option.description}
                  </Typography>
                )}
              </Box>

              <HeaderIcon
                name="arrow"
                sx={{
                  fontSize: 16,
                  color: "#8A9AA6",
                  flexShrink: 0,
                }}
              />
            </Box>
          )}
          renderInput={(params) => {
            const inputSlot =
              params.slotProps?.input ??
              params.InputProps;

            const htmlInputSlot =
              params.slotProps?.htmlInput ??
              params.inputProps;

            return (
              <TextField
                {...params}
                inputRef={
                  inDialog
                    ? mobileInputRef
                    : desktopInputRef
                }
                autoFocus={inDialog}
                placeholder="Search pages and updates..."
                slotProps={{
                  ...params.slotProps,

                  input: {
                    ...inputSlot,

                    startAdornment: (
                      <>
                        <HeaderIcon
                          name="search"
                          sx={{
                            fontSize: 21,
                            color: "#81919C",
                            mr: 1,
                          }}
                        />

                        {
                          inputSlot?.startAdornment
                        }
                      </>
                    ),

                    endAdornment: (
                      <>
                        {!inDialog &&
                          !query && (
                            <Box
                              component="kbd"
                              aria-hidden="true"
                              sx={{
                                display: {
                                  xs: "none",
                                  lg: "inline-flex",
                                },
                                alignItems:
                                  "center",
                                flexShrink: 0,
                                whiteSpace:
                                  "nowrap",
                                px: 0.8,
                                height: 23,
                                borderRadius:
                                  0.75,
                                border:
                                  "1px solid #DFE6EC",
                                bgcolor:
                                  "#FFFFFF",
                                fontFamily:
                                  "inherit",
                                fontSize: 10.5,
                                color:
                                  "#87939E",
                              }}
                            >
                              {shortcut}
                            </Box>
                          )}

                        {
                          inputSlot?.endAdornment
                        }
                      </>
                    ),
                  },

                  htmlInput: {
                    ...htmlInputSlot,
                    "aria-label":
                      "Search pages and updates",
                    autoComplete: "off",
                    enterKeyHint: "go",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    minHeight: 48,
                    py: "4px !important",
                    pl: "14px !important",
                    borderRadius: "12px",
                    bgcolor: "#F6F8FA",
                    transition: motionDisabled
                      ? "none"
                      : "background-color 160ms ease, box-shadow 160ms ease",

                    "& fieldset": {
                      borderColor: "#E6EBF0",
                    },

                    "&:hover fieldset": {
                      borderColor: "#C6D7E2",
                    },

                    "&.Mui-focused": {
                      bgcolor: "#FFFFFF",
                      boxShadow:
                        "0 0 0 4px rgba(0, 174, 239, 0.09)",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: "#00AEEF",
                      borderWidth: 1,
                    },
                  },

                  "& .MuiInputBase-input": {
                    fontSize: inDialog
                      ? 16
                      : 13,
                    color: "#404041",

                    "&::placeholder": {
                      color: "#7A8893",
                      opacity: 1,
                    },
                  },
                }}
              />
            );
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        mr: {
          xs: 0,
          sm: 2,
          lg: 4,
        },
      }}
    >
      <Box sx={{ maxWidth: 560 }}>
        {isMobile || mobileSearchOpen ? (
          <ButtonBase
            onClick={() => {
              setMobileSearchOpen(true);
              setOpen(true);
            }}
            aria-label="Open search"
            aria-haspopup="dialog"
            aria-expanded={mobileSearchOpen}
            sx={{
              width: "100%",
              minWidth: 44,
              height: 44,
              px: 1.5,
              gap: 1,
              justifyContent: "flex-start",
              border: "1px solid #E6EBF0",
              borderRadius: "11px",
              bgcolor: "#F6F8FA",
              color: "#6F7C86",

              "&:hover": {
                bgcolor: "#EFF9FE",
              },

              "&.Mui-focusVisible": {
                outline: "2px solid #00AEEF",
                outlineOffset: 3,
              },
            }}
          >
            <HeaderIcon
              name="search"
              sx={{ fontSize: 20 }}
            />

            <Typography sx={{ fontSize: 13 }}>
              Search
            </Typography>
          </ButtonBase>
        ) : (
          renderSearchField()
        )}
      </Box>

      <Dialog
        fullScreen
        open={mobileSearchOpen}
        onClose={closeSearch}
        aria-labelledby={`${id}-title`}
        transitionDuration={
          motionDisabled ? 0 : 160
        }
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#F7F9FC",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            bgcolor: "#FFFFFF",
            borderBottom:
              "1px solid #E8EDF1",
          }}
        >
          <Typography
            id={`${id}-title`}
            component="h2"
            sx={{
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Search
          </Typography>

          <IconButton
            onClick={closeSearch}
            aria-label="Close search"
            sx={{
              width: 44,
              height: 44,
            }}
          >
            <HeaderIcon
              name="close"
              sx={{ fontSize: 21 }}
            />
          </IconButton>
        </Box>

        <Box sx={{ px: 2, pt: 2 }}>
          {renderSearchField(true)}
        </Box>
      </Dialog>
    </Box>
  );
}

export default function StudentTopbar({
  student = null,
  isDesktop = false,
  mobileOpen = false,
  navigationId = "student-navigation",
  onOpenNavigation,
  searchItems = EMPTY_SEARCH_ITEMS,
  notifications = [],
  notificationsLoading = false,
  notificationsError = false,
  onOpenAccountSettings,
  onSignOut,
  reduceMotion = false,
}) {
  const id = useId();

  const [accountAnchor, setAccountAnchor] =
    useState(null);

  const [
    notificationAnchor,
    setNotificationAnchor,
  ] = useState(null);

  const [signingOut, setSigningOut] =
    useState(false);

  const [signOutError, setSignOutError] =
    useState(false);

  const accountOpen = Boolean(accountAnchor);

  const notificationsOpen = Boolean(
    notificationAnchor,
  );

  const studentName =
    student?.name?.trim() ||
    "Afolarin Oluwasegun";

  const unreadCount = notifications.filter(
    (item) => !item.read,
  ).length;

  const accountButtonId =
    `${id}-account-button`;

  const accountMenuId =
    `${id}-account-menu`;

  const notificationPanelId =
    `${id}-notification-panel`;

  const notificationTitleId =
    `${id}-notification-title`;

  const closeAccount = () =>
    setAccountAnchor(null);

  const closeNotifications = () =>
    setNotificationAnchor(null);

  async function handleSignOut() {
    if (
      typeof onSignOut !== "function" ||
      signingOut
    ) {
      return;
    }

    setSigningOut(true);
    setSignOutError(false);

    try {
      await onSignOut();
      closeAccount();
    } catch {
      setSignOutError(true);
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      <AppBar
        component="header"
        position="sticky"
        elevation={0}
        color="inherit"
        sx={{
          top: 0,
          bgcolor: "#FFFFFF",
          backgroundImage: "none",
          borderBottom:
            "1px solid #E8EDF1",
          boxShadow: "none",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: {
              xs: 72,
              md: 84,
            },
            px: {
              xs: 2,
              sm: 3,
              lg: 4,
            },
            gap: {
              xs: 1,
              sm: 2,
            },
          }}
        >
          {/* Mobile navigation */}
          {!isDesktop && (
            <IconButton
              onClick={onOpenNavigation}
              aria-label="Open student navigation"
              aria-controls={navigationId}
              aria-expanded={mobileOpen}
              sx={{
                width: 44,
                height: 44,
                ml: -0.75,
                flexShrink: 0,
                color: "text.primary",
                borderRadius: 1.5,

                "&:hover": {
                  bgcolor: "#F3F8FB",
                },
              }}
            >
              <HeaderIcon
                name="menu"
                sx={{ fontSize: 23 }}
              />
            </IconButton>
          )}

          {/* Search */}
          <StudentHeaderSearch
            items={searchItems}
            notifications={notifications}
            reduceMotion={reduceMotion}
          />

          {/* Notifications and account */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: {
                xs: 1,
                sm: 2,
              },
              flexShrink: 0,
            }}
          >
            <Tooltip title="Notifications">
              <IconButton
                onClick={(event) =>
                  setNotificationAnchor(
                    event.currentTarget,
                  )
                }
                aria-label={
                  unreadCount > 0
                    ? `Notifications, ${unreadCount} unread`
                    : "Notifications"
                }
                aria-haspopup="dialog"
                aria-expanded={
                  notificationsOpen
                }
                aria-controls={
                  notificationsOpen
                    ? notificationPanelId
                    : undefined
                }
                sx={{
                  width: 42,
                  height: 42,
                  border:
                    "1px solid #E8EDF1",
                  borderRadius: 1.75,
                  bgcolor: notificationsOpen
                    ? "#F0FAFE"
                    : "#FFFFFF",
                  color: "text.primary",

                  "&:hover": {
                    bgcolor: "#F0FAFE",
                    borderColor: "#C9EAF8",
                  },
                }}
              >
                <Badge
                  badgeContent={unreadCount}
                  invisible={
                    unreadCount === 0
                  }
                  max={99}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      minWidth: 17,
                      height: 17,
                      px: 0.5,
                      border:
                        "2px solid #FFFFFF",
                      fontSize: 9,
                      fontWeight: 700,
                    },
                  }}
                >
                  <HeaderIcon
                    name="bell"
                    sx={{ fontSize: 21 }}
                  />
                </Badge>
              </IconButton>
            </Tooltip>

            <Box
              aria-hidden="true"
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
                height: 32,
                borderLeft:
                  "1px solid #E8EDF1",
              }}
            />

            <ButtonBase
              id={accountButtonId}
              onClick={(event) =>
                setAccountAnchor(
                  event.currentTarget,
                )
              }
              aria-label={`Open account menu for ${studentName}`}
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              aria-controls={
                accountOpen
                  ? accountMenuId
                  : undefined
              }
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                p: 0.5,
                borderRadius: 1.5,
                textAlign: "left",

                "&:hover": {
                  bgcolor: "#F7FAFC",
                },

                "&.Mui-focusVisible": {
                  outline: "2px solid",
                  outlineColor:
                    "primary.dark",
                  outlineOffset: 3,
                },
              }}
            >
              <Avatar
                src={
                  student?.avatarUrl ||
                  undefined
                }
                alt={studentName}
                variant="rounded"
                sx={{
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  borderRadius: 1.75,
                  bgcolor: "#F0F9FD",
                  border:
                    "1px solid #E3EEF4",
                }}
              >
                <StudentAvatarIcon />
              </Avatar>

              <Box
                sx={{
                  display: {
                    xs: "none",
                    md: "block",
                  },
                  maxWidth: 190,
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    lineHeight: 1.5,
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

              <HeaderIcon
                name="chevron"
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                  fontSize: 16,
                  ml: 0.5,
                  color: "text.secondary",
                  transform: accountOpen
                    ? "rotate(180deg)"
                    : "none",
                  transition: reduceMotion
                    ? "none"
                    : "transform 160ms ease",
                }}
              />
            </ButtonBase>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Account menu */}
      <Menu
        id={accountMenuId}
        anchorEl={accountAnchor}
        open={accountOpen}
        onClose={closeAccount}
        transitionDuration={
          reduceMotion ? 0 : 160
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          list: {
            "aria-labelledby":
              accountButtonId,
            sx: {
              py: 0.75,
            },
          },

          paper: {
            sx: {
              mt: 1.5,
              width: 250,
              maxWidth:
                "calc(100vw - 32px)",
              borderRadius: 2,
              bgcolor: "#FFFFFF",
              backgroundImage: "none",
              border:
                "1px solid #E8EDF1",
              boxShadow:
                "0 12px 40px rgba(30, 45, 55, 0.10)",
            },
          },
        }}
      >
        <MenuItem
          component={RouterLink}
          to="/student/profile"
          onClick={closeAccount}
          sx={{
            minHeight: 46,
            fontSize: 13,
            mx: 0.75,
            borderRadius: 1,
          }}
        >
          <ListItemIcon>
            <HeaderIcon
              name="profile"
              fontSize="small"
            />
          </ListItemIcon>

          My profile
        </MenuItem>

        {typeof onOpenAccountSettings ===
          "function" && (
          <MenuItem
            onClick={() => {
              closeAccount();
              onOpenAccountSettings();
            }}
            sx={{
              minHeight: 46,
              fontSize: 13,
              mx: 0.75,
              borderRadius: 1,
            }}
          >
            <ListItemIcon>
              <HeaderIcon
                name="settings"
                fontSize="small"
              />
            </ListItemIcon>

            Account settings
          </MenuItem>
        )}

        {typeof onSignOut === "function" && (
          <Divider />
        )}

        {typeof onSignOut === "function" && (
          <MenuItem
            disabled={signingOut}
            onClick={handleSignOut}
            sx={{
              minHeight: 46,
              mx: 0.75,
              borderRadius: 1,
              fontSize: 13,
              color: "error.main",
            }}
          >
            <ListItemIcon
              sx={{ color: "inherit" }}
            >
              {signingOut ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <HeaderIcon
                  name="logout"
                  fontSize="small"
                />
              )}
            </ListItemIcon>

            {signingOut
              ? "Signing out…"
              : "Sign out"}
          </MenuItem>
        )}
      </Menu>

      {/* Notifications panel */}
      <Popover
        open={notificationsOpen}
        anchorEl={notificationAnchor}
        onClose={closeNotifications}
        transitionDuration={
          reduceMotion ? 0 : 160
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        marginThreshold={16}
        slotProps={{
          paper: {
            id: notificationPanelId,
            role: "dialog",
            "aria-modal": true,
            "aria-labelledby":
              notificationTitleId,
            sx: {
              mt: 1.5,
              width: 380,
              maxWidth:
                "calc(100vw - 32px)",
              borderRadius: 2,
              bgcolor: "#FFFFFF",
              border:
                "1px solid #E8EDF1",
              boxShadow:
                "0 12px 40px rgba(30, 45, 55, 0.10)",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 1.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderBottom:
              "1px solid #E8EDF1",
          }}
        >
          <Box>
            <Typography
              id={notificationTitleId}
              component="h2"
              sx={{
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Notifications
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.25,
                fontSize: 11.5,
              }}
            >
              Updates about your student journey
            </Typography>
          </Box>

          <IconButton
            autoFocus
            onClick={closeNotifications}
            aria-label="Close notifications"
            sx={{
              width: 40,
              height: 40,
            }}
          >
            <HeaderIcon
              name="close"
              sx={{ fontSize: 19 }}
            />
          </IconButton>
        </Box>

        <Box
          sx={{
            maxHeight:
              "min(440px, 65vh)",
            overflowY: "auto",
            overscrollBehavior: "contain",
          }}
        >
          {notificationsLoading ? (
            <Box
              role="status"
              sx={{
                py: 5,
                px: 3,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CircularProgress size={26} />

              <Typography
                color="text.secondary"
                sx={{ fontSize: 12 }}
              >
                Loading notifications…
              </Typography>
            </Box>
          ) : notificationsError ? (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">
                Notifications could not be loaded.
                Please try again later.
              </Alert>
            </Box>
          ) : notifications.length === 0 ? (
            <Box
              sx={{
                px: 3,
                py: 5,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: "#F0FAFE",
                  color: "primary.dark",
                }}
              >
                <HeaderIcon
                  name="bell"
                  sx={{ fontSize: 27 }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                No notifications to display
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  maxWidth: 270,
                  mx: "auto",
                  fontSize: 12.5,
                  lineHeight: 1.75,
                }}
              >
                Updates about your applications,
                documents and deadlines will
                appear here.
              </Typography>
            </Box>
          ) : (
            <List
              disablePadding
              aria-label="Notifications"
            >
              {notifications.map(
                (notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onNavigate={
                      closeNotifications
                    }
                  />
                ),
              )}
            </List>
          )}
        </Box>
      </Popover>

      {/* Sign-out error */}
      <Snackbar
        open={signOutError}
        autoHideDuration={6000}
        onClose={() =>
          setSignOutError(false)
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() =>
            setSignOutError(false)
          }
        >
          We couldn&apos;t sign you out.
          Please try again.
        </Alert>
      </Snackbar>
    </>
  );
}