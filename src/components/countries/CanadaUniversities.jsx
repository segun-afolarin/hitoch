import UniversitySearch from "./UniversitySearch";

const DEGREE_LEVELS = [
  "Bachelor’s",
  "Master’s",
  "Doctoral (PhD)",
];

function campusPhoto(path, credit, license, alt) {
  const filename = path.split("/").pop();

  const licensePath = {
    CC0: "publicdomain/zero/1.0/",
    "CC BY 2.0": "licenses/by/2.0/",
    "CC BY-SA 2.0": "licenses/by-sa/2.0/",
    "CC BY-SA 3.0": "licenses/by-sa/3.0/",
    "CC BY-SA 4.0": "licenses/by-sa/4.0/",
  }[license];

  return {
    src: `https://thumb.wikimedia.org/wikipedia/commons/thumb/${path}/960px-${filename}`,
    source: `https://commons.wikimedia.org/wiki/File:${filename}`,
    credit,
    license,
    alt,
    licenseUrl: licensePath
      ? `https://creativecommons.org/${licensePath}`
      : undefined,
  };
}

// Institution listings; this does not claim a Hitouch partnership.
const canadaUniversities = [
  {
    id: "utoronto",
    name: "University of Toronto",
    city: "Greater Toronto Area",
    region: "Ontario",
    aliases: ["U of T", "UofT", "undergraduate", "postgraduate"],
    description:
      "Explore undergraduate and graduate study across three campuses in the Greater Toronto Area, with subjects spanning engineering, business, arts and sciences.",
    campuses: [
      "St. George · Toronto",
      "Mississauga",
      "Scarborough",
    ],
    studyAreas: [
      "Engineering",
      "Business & management",
      "Arts & sciences",
      "Architecture & design",
    ],
    planningNote:
      "Choose your program and campus together, then check the requirements and deadline for that option.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "f/f2/Sir_Daniel_Wilson_Quadrangle_-_St._George_Campus%2C_Toronto%2C_Canada.jpg",
      "Victoria Heath vheath",
      "CC0",
      "Sir Daniel Wilson Quadrangle at the University of Toronto, St. George campus",
    ),
    // https://www.utoronto.ca/academics/academic-units
  },
  {
    id: "uottawa",
    name: "University of Ottawa",
    city: "Ottawa",
    region: "Ontario",
    aliases: [
      "uOttawa",
      "Université d’Ottawa",
      "undergraduate",
      "postgraduate",
    ],
    description:
      "An English–French bilingual university in Canada’s capital, with undergraduate and graduate options in engineering, management, health and social sciences.",
    campuses: ["Ottawa, Ontario"],
    studyAreas: [
      "Engineering",
      "Business & management",
      "Health sciences",
      "Social sciences",
    ],
    planningNote:
      "Confirm the teaching language and language requirements of your chosen program.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "a/a7/Tabaret_Hall_-_02.jpg",
      "Jeangagnon",
      "CC BY-SA 4.0",
      "Tabaret Hall at the University of Ottawa",
    ),
    // https://www.uottawa.ca/about-us/faculties
  },
  {
    id: "mcgill",
    name: "McGill University",
    city: "Montréal",
    region: "Quebec",
    aliases: [
      "Université McGill",
      "undergraduate",
      "postgraduate",
    ],
    description:
      "Discover study options across McGill’s downtown Montréal and Macdonald campuses, including engineering, management, science and environmental subjects.",
    campuses: [
      "Downtown · Montréal",
      "Macdonald · Sainte-Anne-de-Bellevue",
    ],
    studyAreas: [
      "Engineering",
      "Business & management",
      "Science",
      "Agricultural & environmental sciences",
    ],
    planningNote:
      "Check your program’s campus before choosing accommodation; Macdonald is outside downtown Montréal.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "d/df/Arts_Building%2C_McGill_University%2C_Aug_31_2022.jpg",
      "D. Benjamin Miller",
      "CC0",
      "The Arts Building at McGill University",
    ),
    // https://www.mcgill.ca/about/quickfacts
  },
  {
    id: "ubc",
    name: "University of British Columbia",
    city: "Vancouver & Kelowna",
    region: "British Columbia",
    aliases: ["UBC", "Okanagan", "undergraduate", "postgraduate"],
    description:
      "UBC offers undergraduate and graduate study at its Vancouver and Okanagan campuses, with options across engineering, business, science and the arts.",
    campuses: ["Vancouver", "Okanagan · Kelowna"],
    studyAreas: [
      "Engineering",
      "Business & management",
      "Science",
      "Arts",
    ],
    planningNote:
      "Compare the Vancouver and Okanagan options: program availability differs between campuses.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "e/e7/Irving_K._Barber_UBC_02.jpg",
      "Xicotencatl",
      "CC BY-SA 4.0",
      "Irving K. Barber Learning Centre and clock tower at UBC in Vancouver",
    ),
    // https://www.ubc.ca/academics/
  },
  {
    id: "alberta",
    name: "University of Alberta",
    city: "Edmonton & Camrose",
    region: "Alberta",
    aliases: [
      "UAlberta",
      "U of A",
      "undergraduate",
      "postgraduate",
    ],
    description:
      "Explore engineering, business, science and arts at a university with study locations in Edmonton and Camrose, including the French-language Campus Saint-Jean.",
    campuses: [
      "North Campus · Edmonton",
      "Augustana · Camrose",
      "Campus Saint-Jean · Edmonton",
    ],
    studyAreas: [
      "Engineering",
      "Business & management",
      "Science",
      "Arts",
    ],
    planningNote:
      "Check your program’s campus and teaching language before preparing your application.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "d/da/University_of_Alberta%27s_Old_Arts_Building%2C_August_2024.jpg",
      "Ansony89",
      "CC BY-SA 4.0",
      "The Old Arts Building at the University of Alberta",
    ),
    // https://www.ualberta.ca/en/faculties/index.html
  },
  {
    id: "waterloo",
    name: "University of Waterloo",
    city: "Waterloo",
    region: "Ontario",
    aliases: ["UWaterloo", "undergraduate", "postgraduate"],
    description:
      "Explore programs in mathematics, computing, engineering and environmental subjects, with co-op study options available in a range of undergraduate programs.",
    campuses: ["Waterloo, Ontario"],
    studyAreas: [
      "Computer science",
      "Engineering",
      "Mathematics",
      "Environmental studies",
    ],
    planningNote:
      "Check whether your chosen program offers regular study, co-op, or both.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "3/39/University_of_Waterloo_%28Waterloo_Campus%29_-_Waterloo%2C_Ontario.jpg",
      "JFVoll",
      "CC BY-SA 4.0",
      "University of Waterloo campus in Waterloo, Ontario",
    ),
    // https://uwaterloo.ca/future-students/programs
  },
  {
    id: "mcmaster",
    name: "McMaster University",
    city: "Hamilton",
    region: "Ontario",
    aliases: ["Mac", "undergraduate", "postgraduate"],
    description:
      "A Hamilton-based university with study options across engineering, business, health sciences, humanities, science and social sciences.",
    campuses: ["Hamilton, Ontario"],
    studyAreas: [
      "Engineering",
      "Business & management",
      "Health sciences",
      "Social sciences",
    ],
    planningNote:
      "Review the program’s admission steps, including any required supplementary application.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "b/b7/McMaster_University_-_University_Hall_tower_and_archway.jpg",
      "Mathew Ingram",
      "CC BY 2.0",
      "University Hall at McMaster University in Hamilton",
    ),
    // https://future.mcmaster.ca/programs/
  },
  {
    id: "calgary",
    name: "University of Calgary",
    city: "Calgary",
    region: "Alberta",
    aliases: [
      "UCalgary",
      "U of C",
      "undergraduate",
      "postgraduate",
    ],
    description:
      "Explore undergraduate and graduate pathways in Calgary, with subjects including engineering, business, science, arts, education and nursing.",
    campuses: ["Calgary, Alberta"],
    studyAreas: [
      "Engineering",
      "Business & management",
      "Science",
      "Education",
    ],
    planningNote:
      "Review the subject prerequisites and documents required for your chosen degree.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "5/55/Taylor_Family_Digital_Library_-_University_of_Calgary_-_DSC00189.JPG",
      "Daderot",
      "CC0",
      "Taylor Family Digital Library at the University of Calgary",
    ),
    // https://www.ucalgary.ca/future-students/undergraduate/programs
  },
  {
    id: "western",
    name: "Western University",
    city: "London",
    region: "Ontario",
    aliases: [
      "University of Western Ontario",
      "UWO",
      "undergraduate",
      "postgraduate",
    ],
    description:
      "Study in London, Ontario, with options across engineering, computing, health sciences and social sciences, alongside a range of graduate programs.",
    campuses: ["London, Ontario"],
    studyAreas: [
      "Engineering",
      "Computer science",
      "Health sciences",
      "Social sciences",
    ],
    planningNote:
      "Check whether your chosen program admits students directly or requires prior university study.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "8/8c/Fall_ColoursatWestern.jpg",
      "Theworldbeckons D. Keddy",
      "CC BY-SA 3.0",
      "University College surrounded by autumn trees at Western University",
    ),
    // https://welcome.uwo.ca/what-can-i-study/index.html
  },
  {
    id: "queens",
    name: "Queen’s University",
    city: "Kingston",
    region: "Ontario",
    aliases: ["Queens", "Queen’s", "undergraduate", "postgraduate"],
    description:
      "Explore undergraduate and graduate options in Kingston, with academic areas including engineering, business, arts and science, and health sciences.",
    campuses: ["Kingston, Ontario"],
    studyAreas: [
      "Engineering",
      "Business & management",
      "Arts & sciences",
      "Health sciences",
    ],
    planningNote:
      "Check the admission requirements for the specific faculty and program you plan to apply to.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "e/ee/Grant_Hall_%28Queen%27s_University_at_Kingston%29.jpg",
      "Takipoint123",
      "CC BY-SA 4.0",
      "Grant Hall at Queen’s University in Kingston",
    ),
    // https://www.queensu.ca/academics/programs
  },
  {
    id: "dalhousie",
    name: "Dalhousie University",
    city: "Halifax & Truro area",
    region: "Nova Scotia",
    aliases: ["Dal", "undergraduate", "postgraduate"],
    description:
      "Discover programs across Dalhousie’s Halifax campuses and Agricultural Campus near Truro, including computing, engineering, management and agriculture.",
    campuses: [
      "Halifax",
      "Agricultural Campus · Truro area",
    ],
    studyAreas: [
      "Computer science",
      "Engineering",
      "Business & management",
      "Agriculture",
    ],
    planningNote:
      "Confirm your study location before making housing or travel plans.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "7/7e/Henri_Hicks_Building%2C_Dalhousie_University.jpg",
      "mricon",
      "CC BY-SA 2.0",
      "Henry Hicks Academic Building at Dalhousie University",
    ),
    // https://www.dal.ca/study/programs.html
  },
  {
    id: "manitoba",
    name: "University of Manitoba",
    city: "Winnipeg",
    region: "Manitoba",
    aliases: ["UM", "U of M", "undergraduate", "postgraduate"],
    description:
      "Explore undergraduate and graduate study in Winnipeg, including engineering, business, science, agriculture and health-related disciplines.",
    campuses: [
      "Fort Garry · Winnipeg",
      "Bannatyne · Winnipeg",
    ],
    studyAreas: [
      "Engineering",
      "Business & management",
      "Science",
      "Agricultural & food sciences",
    ],
    planningNote:
      "Check which campus hosts your program when comparing study and accommodation options.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "a/ae/U_of_M_Administration_Building.JPG",
      "Teles",
      "CC BY-SA 3.0",
      "Administration Building at the University of Manitoba",
    ),
    // https://umanitoba.ca/academics
  },
];

export default function CanadaUniversities() {
  return (
    <UniversitySearch
      countryName="Canada"
      countrySlug="canada"
      universities={canadaUniversities}
    />
  );
}