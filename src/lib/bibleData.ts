export type Testament = "OT" | "NT";

export interface BibleBook {
  name: string;
  chapters: number;
  testament: Testament;
}

export interface SkippedBook {
  name: string;
  chapters: number;
  reason: string;
}

export interface ThemeSegment {
  bookName: string;
  fromChapter: number;
  toChapter: number;
  theme: string;
}

export const CORE_BOOKS: BibleBook[] = [
  { name: "Genesis", chapters: 50, testament: "OT" },
  { name: "Exodus", chapters: 40, testament: "OT" },
  { name: "Deuteronomy", chapters: 34, testament: "OT" },
  { name: "Joshua", chapters: 24, testament: "OT" },
  { name: "Judges", chapters: 21, testament: "OT" },
  { name: "Ruth", chapters: 4, testament: "OT" },
  { name: "1 Samuel", chapters: 31, testament: "OT" },
  { name: "2 Samuel", chapters: 24, testament: "OT" },
  { name: "1 Kings", chapters: 22, testament: "OT" },
  { name: "2 Kings", chapters: 25, testament: "OT" },
  { name: "Ezra", chapters: 10, testament: "OT" },
  { name: "Nehemiah", chapters: 13, testament: "OT" },
  { name: "Esther", chapters: 10, testament: "OT" },
  { name: "Job", chapters: 42, testament: "OT" },
  { name: "Proverbs", chapters: 31, testament: "OT" },
  { name: "Ecclesiastes", chapters: 12, testament: "OT" },
  { name: "Isaiah", chapters: 66, testament: "OT" },
  { name: "Jeremiah", chapters: 52, testament: "OT" },
  { name: "Ezekiel", chapters: 48, testament: "OT" },
  { name: "Daniel", chapters: 12, testament: "OT" },
  { name: "Hosea", chapters: 14, testament: "OT" },
  { name: "Joel", chapters: 3, testament: "OT" },
  { name: "Amos", chapters: 9, testament: "OT" },
  { name: "Obadiah", chapters: 1, testament: "OT" },
  { name: "Jonah", chapters: 4, testament: "OT" },
  { name: "Micah", chapters: 7, testament: "OT" },
  { name: "Nahum", chapters: 3, testament: "OT" },
  { name: "Habakkuk", chapters: 3, testament: "OT" },
  { name: "Zephaniah", chapters: 3, testament: "OT" },
  { name: "Haggai", chapters: 2, testament: "OT" },
  { name: "Zechariah", chapters: 14, testament: "OT" },
  { name: "Malachi", chapters: 4, testament: "OT" },
  { name: "Matthew", chapters: 28, testament: "NT" },
  { name: "Mark", chapters: 16, testament: "NT" },
  { name: "Luke", chapters: 24, testament: "NT" },
  { name: "John", chapters: 21, testament: "NT" },
  { name: "Acts", chapters: 28, testament: "NT" },
  { name: "Romans", chapters: 16, testament: "NT" },
  { name: "1 Corinthians", chapters: 16, testament: "NT" },
  { name: "2 Corinthians", chapters: 13, testament: "NT" },
  { name: "Galatians", chapters: 6, testament: "NT" },
  { name: "Ephesians", chapters: 6, testament: "NT" },
  { name: "Philippians", chapters: 4, testament: "NT" },
  { name: "Colossians", chapters: 4, testament: "NT" },
  { name: "1 Thessalonians", chapters: 5, testament: "NT" },
  { name: "2 Thessalonians", chapters: 3, testament: "NT" },
  { name: "1 Timothy", chapters: 6, testament: "NT" },
  { name: "2 Timothy", chapters: 4, testament: "NT" },
  { name: "Titus", chapters: 3, testament: "NT" },
  { name: "Philemon", chapters: 1, testament: "NT" },
  { name: "Hebrews", chapters: 13, testament: "NT" },
  { name: "James", chapters: 5, testament: "NT" },
  { name: "1 Peter", chapters: 5, testament: "NT" },
  { name: "2 Peter", chapters: 3, testament: "NT" },
  { name: "1 John", chapters: 5, testament: "NT" },
  { name: "2 John", chapters: 1, testament: "NT" },
  { name: "3 John", chapters: 1, testament: "NT" },
  { name: "Jude", chapters: 1, testament: "NT" },
  { name: "Revelation", chapters: 22, testament: "NT" },
];

export const SKIPPED_BOOKS: SkippedBook[] = [
  {
    name: "Leviticus",
    chapters: 27,
    reason: "Ceremonial & sacrificial law (unpacked theologically in Hebrews)",
  },
  {
    name: "Numbers",
    chapters: 36,
    reason: "Census records and wilderness wandering logistics",
  },
  {
    name: "1 Chronicles",
    chapters: 29,
    reason: "Repeats Samuel with genealogies",
  },
  {
    name: "2 Chronicles",
    chapters: 36,
    reason: "Repeats Kings — read Kings and you have it",
  },
  {
    name: "Psalms",
    chapters: 150,
    reason: "Devotional poetry — best read slowly over months",
  },
  {
    name: "Song of Songs",
    chapters: 8,
    reason: "Allegorical love poetry",
  },
  {
    name: "Lamentations",
    chapters: 5,
    reason: "Poetic grief over Jerusalem's fall",
  },
];

export const TOTAL_CORE_CHAPTERS = CORE_BOOKS.reduce(
  (sum, b) => sum + b.chapters,
  0
); // 898

export const TOTAL_SKIPPED_CHAPTERS = SKIPPED_BOOKS.reduce(
  (sum, b) => sum + b.chapters,
  0
); // 291

export const THEME_SEGMENTS: ThemeSegment[] = [
  // Genesis
  { bookName: "Genesis", fromChapter: 1, toChapter: 11, theme: "Creation & Fall" },
  { bookName: "Genesis", fromChapter: 12, toChapter: 36, theme: "Patriarchs" },
  { bookName: "Genesis", fromChapter: 37, toChapter: 50, theme: "Joseph in Egypt" },
  // Exodus
  { bookName: "Exodus", fromChapter: 1, toChapter: 15, theme: "Exodus from Egypt" },
  { bookName: "Exodus", fromChapter: 16, toChapter: 24, theme: "Sinai & Covenant" },
  { bookName: "Exodus", fromChapter: 25, toChapter: 40, theme: "Tabernacle Built" },
  // Deuteronomy
  { bookName: "Deuteronomy", fromChapter: 1, toChapter: 34, theme: "Moses' Farewell" },
  // Joshua
  { bookName: "Joshua", fromChapter: 1, toChapter: 12, theme: "Conquest Begins" },
  { bookName: "Joshua", fromChapter: 13, toChapter: 24, theme: "Land Divided" },
  // Judges
  { bookName: "Judges", fromChapter: 1, toChapter: 12, theme: "Early Judges" },
  { bookName: "Judges", fromChapter: 13, toChapter: 21, theme: "Samson & Chaos" },
  // Ruth
  { bookName: "Ruth", fromChapter: 1, toChapter: 4, theme: "Ruth & Redemption" },
  // 1 Samuel
  { bookName: "1 Samuel", fromChapter: 1, toChapter: 15, theme: "Samuel & Saul" },
  { bookName: "1 Samuel", fromChapter: 16, toChapter: 31, theme: "Rise of David" },
  // 2 Samuel
  { bookName: "2 Samuel", fromChapter: 1, toChapter: 12, theme: "David's Triumphs" },
  { bookName: "2 Samuel", fromChapter: 13, toChapter: 24, theme: "David's Troubles" },
  // 1 Kings
  { bookName: "1 Kings", fromChapter: 1, toChapter: 11, theme: "Solomon's Kingdom" },
  { bookName: "1 Kings", fromChapter: 12, toChapter: 22, theme: "Kingdom Divided" },
  // 2 Kings
  { bookName: "2 Kings", fromChapter: 1, toChapter: 17, theme: "Israel's Decline" },
  { bookName: "2 Kings", fromChapter: 18, toChapter: 25, theme: "Judah Falls" },
  // Ezra
  { bookName: "Ezra", fromChapter: 1, toChapter: 10, theme: "Return from Exile" },
  // Nehemiah
  { bookName: "Nehemiah", fromChapter: 1, toChapter: 13, theme: "Jerusalem Rebuilt" },
  // Esther
  { bookName: "Esther", fromChapter: 1, toChapter: 10, theme: "Esther's Courage" },
  // Job
  { bookName: "Job", fromChapter: 1, toChapter: 14, theme: "Job's Suffering" },
  { bookName: "Job", fromChapter: 15, toChapter: 31, theme: "Friends' Counsel" },
  { bookName: "Job", fromChapter: 32, toChapter: 42, theme: "God Answers Job" },
  // Proverbs
  { bookName: "Proverbs", fromChapter: 1, toChapter: 9, theme: "Wisdom's Call" },
  { bookName: "Proverbs", fromChapter: 10, toChapter: 31, theme: "Solomon's Proverbs" },
  // Ecclesiastes
  { bookName: "Ecclesiastes", fromChapter: 1, toChapter: 12, theme: "Life's Meaning" },
  // Isaiah
  { bookName: "Isaiah", fromChapter: 1, toChapter: 12, theme: "Isaiah's Warnings" },
  { bookName: "Isaiah", fromChapter: 13, toChapter: 27, theme: "Nations Judged" },
  { bookName: "Isaiah", fromChapter: 28, toChapter: 39, theme: "Woe & Deliverance" },
  { bookName: "Isaiah", fromChapter: 40, toChapter: 55, theme: "Comfort & Hope" },
  { bookName: "Isaiah", fromChapter: 56, toChapter: 66, theme: "New Creation" },
  // Jeremiah
  { bookName: "Jeremiah", fromChapter: 1, toChapter: 10, theme: "Jeremiah's Call" },
  { bookName: "Jeremiah", fromChapter: 11, toChapter: 25, theme: "Covenant Broken" },
  { bookName: "Jeremiah", fromChapter: 26, toChapter: 38, theme: "Prophet Under Fire" },
  { bookName: "Jeremiah", fromChapter: 39, toChapter: 52, theme: "Jerusalem Falls" },
  // Ezekiel
  { bookName: "Ezekiel", fromChapter: 1, toChapter: 11, theme: "Ezekiel's Vision" },
  { bookName: "Ezekiel", fromChapter: 12, toChapter: 24, theme: "Signs of Judgment" },
  { bookName: "Ezekiel", fromChapter: 25, toChapter: 32, theme: "Nations Judged" },
  { bookName: "Ezekiel", fromChapter: 33, toChapter: 48, theme: "Restoration Vision" },
  // Daniel
  { bookName: "Daniel", fromChapter: 1, toChapter: 6, theme: "Daniel in Babylon" },
  { bookName: "Daniel", fromChapter: 7, toChapter: 12, theme: "Apocalyptic Visions" },
  // Minor Prophets
  { bookName: "Hosea", fromChapter: 1, toChapter: 14, theme: "Hosea & Unfaithfulness" },
  { bookName: "Joel", fromChapter: 1, toChapter: 3, theme: "Day of the Lord" },
  { bookName: "Amos", fromChapter: 1, toChapter: 9, theme: "Amos & Justice" },
  { bookName: "Obadiah", fromChapter: 1, toChapter: 1, theme: "Obadiah" },
  { bookName: "Jonah", fromChapter: 1, toChapter: 4, theme: "Jonah's Mission" },
  { bookName: "Micah", fromChapter: 1, toChapter: 7, theme: "Micah's Plea" },
  { bookName: "Nahum", fromChapter: 1, toChapter: 3, theme: "Nineveh Falls" },
  { bookName: "Habakkuk", fromChapter: 1, toChapter: 3, theme: "Habakkuk's Faith" },
  { bookName: "Zephaniah", fromChapter: 1, toChapter: 3, theme: "Zephaniah's Warning" },
  { bookName: "Haggai", fromChapter: 1, toChapter: 2, theme: "Haggai Rebuilds" },
  { bookName: "Zechariah", fromChapter: 1, toChapter: 8, theme: "Zechariah's Visions" },
  { bookName: "Zechariah", fromChapter: 9, toChapter: 14, theme: "Messianic Prophecies" },
  { bookName: "Malachi", fromChapter: 1, toChapter: 4, theme: "Malachi's Rebuke" },
  // New Testament
  { bookName: "Matthew", fromChapter: 1, toChapter: 7, theme: "Jesus' Birth & Teaching" },
  { bookName: "Matthew", fromChapter: 8, toChapter: 16, theme: "Miracles & Parables" },
  { bookName: "Matthew", fromChapter: 17, toChapter: 28, theme: "Jerusalem & Passion" },
  { bookName: "Mark", fromChapter: 1, toChapter: 8, theme: "Mark's Gospel Begins" },
  { bookName: "Mark", fromChapter: 9, toChapter: 16, theme: "Mark's Passion Week" },
  { bookName: "Luke", fromChapter: 1, toChapter: 9, theme: "Luke's Early Ministry" },
  { bookName: "Luke", fromChapter: 10, toChapter: 19, theme: "Journey to Jerusalem" },
  { bookName: "Luke", fromChapter: 20, toChapter: 24, theme: "Luke's Passion Week" },
  { bookName: "John", fromChapter: 1, toChapter: 6, theme: "Signs & Discourses" },
  { bookName: "John", fromChapter: 7, toChapter: 12, theme: "Opposition to Jesus" },
  { bookName: "John", fromChapter: 13, toChapter: 21, theme: "Upper Room & Resurrection" },
  { bookName: "Acts", fromChapter: 1, toChapter: 12, theme: "Church in Jerusalem" },
  { bookName: "Acts", fromChapter: 13, toChapter: 28, theme: "Paul's Missions" },
  { bookName: "Romans", fromChapter: 1, toChapter: 16, theme: "The Gospel Explained" },
  { bookName: "1 Corinthians", fromChapter: 1, toChapter: 16, theme: "Church Problems" },
  { bookName: "2 Corinthians", fromChapter: 1, toChapter: 13, theme: "Paul's Defense" },
  { bookName: "Galatians", fromChapter: 1, toChapter: 6, theme: "Freedom in Christ" },
  { bookName: "Ephesians", fromChapter: 1, toChapter: 6, theme: "The Church United" },
  { bookName: "Philippians", fromChapter: 1, toChapter: 4, theme: "Joy in Christ" },
  { bookName: "Colossians", fromChapter: 1, toChapter: 4, theme: "Christ's Supremacy" },
  { bookName: "1 Thessalonians", fromChapter: 1, toChapter: 5, theme: "Second Coming" },
  { bookName: "2 Thessalonians", fromChapter: 1, toChapter: 3, theme: "Perseverance" },
  { bookName: "1 Timothy", fromChapter: 1, toChapter: 6, theme: "Church Order" },
  { bookName: "2 Timothy", fromChapter: 1, toChapter: 4, theme: "Timothy's Charge" },
  { bookName: "Titus", fromChapter: 1, toChapter: 3, theme: "Sound Doctrine" },
  { bookName: "Philemon", fromChapter: 1, toChapter: 1, theme: "Forgiveness & Grace" },
  { bookName: "Hebrews", fromChapter: 1, toChapter: 7, theme: "Christ Greater Than All" },
  { bookName: "Hebrews", fromChapter: 8, toChapter: 13, theme: "Better Covenant" },
  { bookName: "James", fromChapter: 1, toChapter: 5, theme: "Faith in Action" },
  { bookName: "1 Peter", fromChapter: 1, toChapter: 5, theme: "Suffering & Hope" },
  { bookName: "2 Peter", fromChapter: 1, toChapter: 3, theme: "Guard Against Error" },
  { bookName: "1 John", fromChapter: 1, toChapter: 5, theme: "Love & Truth" },
  { bookName: "2 John", fromChapter: 1, toChapter: 1, theme: "Walk in Truth" },
  { bookName: "3 John", fromChapter: 1, toChapter: 1, theme: "Faithful Hospitality" },
  { bookName: "Jude", fromChapter: 1, toChapter: 1, theme: "Contend for Faith" },
  { bookName: "Revelation", fromChapter: 1, toChapter: 3, theme: "Letters to Churches" },
  { bookName: "Revelation", fromChapter: 4, toChapter: 11, theme: "Seals & Trumpets" },
  { bookName: "Revelation", fromChapter: 12, toChapter: 22, theme: "Final Victory" },
];
