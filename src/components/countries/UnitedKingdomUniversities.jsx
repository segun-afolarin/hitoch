
import UniversitySearch from "./UniversitySearch";

const DEGREE_LEVELS = [
  "Bachelor’s",
  "Master’s",
  "Doctoral (PhD)",
];

// Wikimedia Commons university photographs.
function campusPhoto(filename, alt) {
  const encoded = encodeURIComponent(filename);

  return {
    src: `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=960`,
    source: `https://commons.wikimedia.org/wiki/File:${encoded}`,
    credit: "Wikimedia Commons",
    license: "See file page",
    alt,
  };
}

// Institution listings; this does not claim a Hitouch partnership.
const unitedKingdomUniversities = [
  {
    id: "oxford",
    name: "University of Oxford",
    city: "Oxford",
    region: "England",
    aliases: ["Oxford", "Oxon", "undergraduate", "postgraduate"],
    description:
      "A collegiate university in Oxford with undergraduate and graduate study across humanities, social sciences, mathematical, physical and life sciences, and medical sciences.",
    campuses: ["Oxford, England"],
    studyAreas: [
      "Humanities",
      "Social sciences",
      "Mathematical, physical & life sciences",
      "Medical sciences",
    ],
    planningNote:
      "Check the course requirements, any admissions test and the college application process before you apply.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "Radcliffe_Camera,_Oxford_-_Oct_2006.jpg",
      "The Radcliffe Camera at the University of Oxford"
    ),
    // https://www.ox.ac.uk/admissions
  },
  {
    id: "cambridge",
    name: "University of Cambridge",
    city: "Cambridge",
    region: "England",
    aliases: ["Cambridge", "Cantab", "undergraduate", "postgraduate"],
    description:
      "A collegiate university in Cambridge with options across arts and humanities, sciences, engineering, technology and social sciences.",
    campuses: ["Cambridge, England"],
    studyAreas: [
      "Engineering",
      "Natural sciences",
      "Arts & humanities",
      "Social sciences",
    ],
    planningNote:
      "Check the course requirements, any admissions assessment and how college applications work before you apply.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "Kings_College_Chapel_Cambridge.JPG",
      "King’s College Chapel at the University of Cambridge"
    ),
    // https://www.undergraduate.study.cam.ac.uk/courses
  },
  {
    id: "imperial",
    name: "Imperial College London",
    city: "London",
    region: "England",
    aliases: ["Imperial", "ICL", "undergraduate", "postgraduate"],
    description:
      "A London university focused on science, engineering, medicine and business, with study options across several campuses in the city.",
    campuses: [
      "South Kensington · London",
      "White City · London",
      "Hammersmith · London",
    ],
    studyAreas: [
      "Engineering",
      "Science",
      "Medicine",
      "Business",
    ],
    planningNote:
      "Check which campus hosts your department, and confirm any admissions test or interview for your course.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "Queen's_Tower,_Imperial_College_London.jpg",
      "Queen’s Tower at Imperial College London"
    ),
    // https://www.imperial.ac.uk/study/
  },
  {
    id: "ucl",
    name: "University College London",
    city: "London",
    region: "England",
    aliases: ["UCL", "undergraduate", "postgraduate"],
    description:
      "A large London university with study options across engineering, architecture, social sciences, health, arts and humanities.",
    campuses: [
      "Bloomsbury · London",
      "UCL East · Queen Elizabeth Olympic Park",
    ],
    studyAreas: [
      "Engineering",
      "Architecture & built environment",
      "Social sciences",
      "Arts & humanities",
    ],
    planningNote:
      "Check where your programme is taught before you choose accommodation in London.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "UCL_2_Wilkins_building_(32371569506).jpg",
      "The Main Quad and Wilkins Building at University College London"
    ),
    // https://www.ucl.ac.uk/prospective-students
  },
  {
    id: "edinburgh",
    name: "University of Edinburgh",
    city: "Edinburgh",
    region: "Scotland",
    aliases: ["Edinburgh", "Ed Uni", "undergraduate", "postgraduate"],
    description:
      "A university in Scotland’s capital with study options across arts, humanities, science, engineering, medicine and social sciences.",
    campuses: [
      "Central Area · Edinburgh",
      "King’s Buildings · Edinburgh",
      "Easter Bush · Midlothian",
    ],
    studyAreas: [
      "Informatics & computing",
      "Engineering",
      "Arts & humanities",
      "Medicine & veterinary",
    ],
    planningNote:
      "Check the programme length: many Scottish undergraduate degrees take four years.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "Old_College,_University_of_Edinburgh.JPG",
      "Old College at the University of Edinburgh"
    ),
    // https://www.ed.ac.uk/studying
  },
  {
    id: "manchester",
    name: "University of Manchester",
    city: "Manchester",
    region: "England",
    aliases: ["Manchester", "UoM", "undergraduate", "postgraduate"],
    description:
      "A city-centre university with undergraduate and graduate options across engineering, business, humanities, life sciences and medicine.",
    campuses: ["Oxford Road · Manchester"],
    studyAreas: [
      "Engineering",
      "Business & management",
      "Life sciences",
      "Humanities",
    ],
    planningNote:
      "Check the entry requirements for your course, including any subject prerequisites.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "University_of_Manchester_Whitworth_Hall_and_Whitworth_Building_-_geograph.org.uk_-_1963609.jpg",
      "Whitworth Hall and the Whitworth Building at the University of Manchester"
    ),
    // https://www.manchester.ac.uk/study/
  },
  {
    id: "kcl",
    name: "King’s College London",
    city: "London",
    region: "England",
    aliases: [
      "KCL",
      "King's",
      "Kings College London",
      "undergraduate",
      "postgraduate",
    ],
    description:
      "A central London university with options across law, humanities, health, life sciences, social sciences and engineering.",
    campuses: [
      "Strand · London",
      "Guy’s · London",
      "Waterloo · London",
      "Denmark Hill · London",
    ],
    studyAreas: [
      "Law",
      "Health & life sciences",
      "Humanities",
      "Social sciences",
    ],
    planningNote:
      "King’s teaches across several London campuses, so confirm your course location early.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "Strand_Building,_King's_College_London.jpg",
      "The Strand campus of King’s College London"
    ),
    // https://www.kcl.ac.uk/study
  },
  {
    id: "lse",
    name: "London School of Economics and Political Science",
    city: "London",
    region: "England",
    aliases: ["LSE", "undergraduate", "postgraduate"],
    description:
      "A London university specialising in social sciences, with study options in economics, law, politics, management and international relations.",
    campuses: ["Houghton Street · London"],
    studyAreas: [
      "Economics",
      "Law",
      "Politics & international relations",
      "Management",
    ],
    planningNote:
      "Check the subject requirements and any quantitative prerequisites for your chosen programme.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "The_Marshall_Building_Campus,_London_School_of_Economics.jpg",
      "The Marshall Building at the London School of Economics"
    ),
    // https://www.lse.ac.uk/study-at-lse
  },
  {
    id: "bristol",
    name: "University of Bristol",
    city: "Bristol",
    region: "England",
    aliases: ["Bristol", "undergraduate", "postgraduate"],
    description:
      "A university in Bristol with undergraduate and graduate options across engineering, science, social sciences, arts, law and health.",
    campuses: ["Bristol, England"],
    studyAreas: [
      "Engineering",
      "Science",
      "Social sciences",
      "Arts",
    ],
    planningNote:
      "Review the entry requirements and any additional documents for your chosen course.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "Wills_Memorial_Building,_Bristol_University_(2316).jpg",
      "The Wills Memorial Building at the University of Bristol"
    ),
    // https://www.bristol.ac.uk/study/
  },
  {
    id: "warwick",
    name: "University of Warwick",
    city: "Coventry",
    region: "England",
    aliases: ["Warwick", "undergraduate", "postgraduate"],
    description:
      "A campus university near Coventry with study options across business, engineering, sciences, social sciences and the arts.",
    campuses: ["Main campus · Coventry"],
    studyAreas: [
      "Business & management",
      "Engineering",
      "Science",
      "Social sciences",
    ],
    planningNote:
      "Warwick has a self-contained campus, so compare travel time to Coventry and nearby cities when planning accommodation.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "Warwick_Arts_Centre,_University_of_Warwick,_Coventry_UK.jpg",
      "The Arts Centre at the University of Warwick"
    ),
    // https://warwick.ac.uk/study/
  },
  {
    id: "glasgow",
    name: "University of Glasgow",
    city: "Glasgow",
    region: "Scotland",
    aliases: ["Glasgow", "UofG", "undergraduate", "postgraduate"],
    description:
      "A Scottish university with study options across engineering, science, arts, social sciences, medicine and veterinary studies.",
    campuses: [
      "Gilmorehill · Glasgow",
      "Garscube · Glasgow",
    ],
    studyAreas: [
      "Engineering",
      "Science",
      "Arts & humanities",
      "Medicine & veterinary",
    ],
    planningNote:
      "Check the programme length: many Scottish undergraduate degrees take four years.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "University_of_Glasgow,_Scotland.jpg",
      "The Gilbert Scott Building at the University of Glasgow"
    ),
    // https://www.gla.ac.uk/study/
  },
  {
    id: "durham",
    name: "Durham University",
    city: "Durham",
    region: "England",
    aliases: ["Durham", "undergraduate", "postgraduate"],
    description:
      "A collegiate university in Durham with options across sciences, arts and humanities, social sciences, business and law.",
    campuses: ["Durham, England"],
    studyAreas: [
      "Science",
      "Arts & humanities",
      "Business & law",
      "Social sciences",
    ],
    planningNote:
      "Check how the college system works and which college preferences you can make when you apply.",
    studyLevels: DEGREE_LEVELS,
    image: campusPhoto(
      "Durham_Cathedral_and_Castle.jpg",
      "Durham Castle and Cathedral beside Durham University"
    ),
    // https://www.durham.ac.uk/study/
  },
];

export default function UnitedKingdomUniversities() {
  return (
    <UniversitySearch
      countryName="the United Kingdom"
      countrySlug="united-kingdom"
      universities={unitedKingdomUniversities}
    />
  );
}
