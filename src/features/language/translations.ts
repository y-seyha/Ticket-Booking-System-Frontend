import { LanguageCode } from "./language.store";

export const translations: Record<string, Record<LanguageCode, string>> = {
  searchMovies: { en: "Search Movies...", kh: "ស្វែងរកខ្សែភាពយន្ត..." },
  ticket: { en: "Ticket", kh: "សំបុត្រ" },
  joinNow: { en: "Join Now", kh: "ចុះឈ្មោះ" },
  profile: { en: "Profile", kh: "គណនី" },
  notifications: { en: "Notifications", kh: "ការជូនដំណឹង" },
  home: { en: "Home", kh: "ទំព័រដើម" },
  cinemas: { en: "Cinemas", kh: "រោងភាពយន្ត" },
  offers: { en: "Offers", kh: "ការផ្តល់ជូន" },
  fb: { en: "F&B", kh: "អាហារ និងភេសជ្ជៈ" },
  allCinemas: { en: "All Cinemas", kh: "រោងភាពយន្តទាំងអស់" },
  cinemaLocations: { en: "Cinema Locations", kh: "ទីតាំងរោងភាពយន្ត" },

  noSessionsTitle: {
    en: "No Sessions Available",
    kh: "មិនទាន់មានម៉ោងបញ្ចាំងនៅឡើយទេ",
  },
  noSessionsDescStart: {
    en: "No sessions found for ",
    kh: "មិនមានការបញ្ចាំងសម្រាប់ថ្ងៃទី ",
  },
  noSessionsDescEnd: {
    en: ". Try checking an adjacent date.",
    kh: " ឡើយ។ សូមសាកល្បងពិនិត្យមើលថ្ងៃផ្សេងទៀត។",
  },

  nowShowing: {
    en: "Now Showing",
    kh: "កំពុងបញ្ចាំង",
  },
  comingSoon: {
    en: "Coming Soon",
    kh: "ឆាប់ៗនេះ",
  },
  comingLabel: {
    en: "COMING",
    kh: "ជិតមកដល់",
  },

  //month
  jan: { en: "JAN", kh: "មករា" },
  feb: { en: "FEB", kh: "កុម្ភៈ" },
  mar: { en: "MAR", kh: "មីនា" },
  apr: { en: "APR", kh: "មេសា" },
  may: { en: "MAY", kh: "ឧសភា" },
  jun: { en: "JUN", kh: "មិថុនា" },
  jul: { en: "JUL", kh: "កក្កដា" },
  aug: { en: "AUG", kh: "សីហា" },
  sep: { en: "SEP", kh: "កញ្ញា" },
  oct: { en: "OCT", kh: "តុលា" },
  nov: { en: "NOV", kh: "វិច្ឆិកា" },
  dec: { en: "DEC", kh: "ធ្នូ" },

  //day
  sun: { en: "SUN", kh: "អាទិត្យ" },
  mon: { en: "MON", kh: "ច័ន្ទ" },
  tue: { en: "TUE", kh: "អង្គារ" },
  wed: { en: "WED", kh: "ពុធ" },
  thu: { en: "THU", kh: "ព្រហស្បតិ៍" },
  fri: { en: "FRI", kh: "សុក្រ" },
  sat: { en: "SAT", kh: "សៅរ៍" },

  // Cinema
  cinemasHeader: {
    en: "Cinemas",
    kh: "រោងភាពយន្ត",
  },
  cinemaFetchError: {
    en: "Failed to load cinema locations. Please try again later.",
    kh: "មិនអាចទាញយកទិន្នន័យទីតាំងរោងភាពយន្តបានទេ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
  },
  cinemaDetailError: {
    en: "Failed to load cinema details. Please try again later.",
    kh: "មិនអាចទាញយកព័ត៌មានលម្អិតរបស់រោងភាពយន្តបានទេ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
  },
  cinemaNotFound: {
    en: "Cinema location not found.",
    kh: "រកមិនឃើញទីតាំងរោងភាពយន្តឡើយ។",
  },
  loadingInteractiveDetails: {
    en: "Loading interactive details...",
    kh: "កំពុងផ្ទុកព័ត៌មានលម្អិត...",
  },
  showtime: {
    en: "Showtime",
    kh: "ម៉ោងបញ្ចាំង",
  },
  detail: {
    en: "Detail",
    kh: "ព័ត៌មានលម្អិត",
  },

  //offers or promotions
  promotionsTitle: {
    en: "Promotions",
    kh: "ការផ្តល់ជូនពិសេស",
  },
  seeMore: {
    en: "See More",
    kh: "មើលបន្ថែម",
  },
  seeLess: {
    en: "See Less",
    kh: "បង្ហាញតិច",
  },
  publishDateLabel: {
    en: "Publish Date:",
    kh: "កាលបរិច្ឆេទផ្សព្វផ្សាយ:",
  },
  promotionPeriodLabel: {
    en: "Promotion Period:",
    kh: "រយៈពេលផ្តល់ជូន:",
  },

  //location
  chooseCinema: {
    en: "Choose Cinema",
    kh: "ជ្រើសរើសរោងភាពយន្ត",
  },

  //about-us
  homeBreadcrumb: {
    en: "Home",
    kh: "ទំព័រដើម",
  },
  aboutLegendCinema: {
    en: "About Legend Cinema",
    kh: "អំពី រោងភាពយន្ត លីជិន (Legend Cinema)",
  },
  aboutSubtitle: {
    en: "About Legend Cinema Cambodia.",
    kh: "អំពី រោងភាពយន្ត លីជិន ប្រទេសកម្ពុជា។",
  },
  aboutParagraph1: {
    en: "Legend Cinema is the no. 1 and the first International Standard Cinema in Cambodia, created and operated by Khmer since 2011. Our rapid growth and expansion from 1 to 13 cinema locations in the past 12 years across the country, has shown our strength in delivery and influence in the film and entertainment industry.",
    kh: "រោងភាពយន្ត លីជិន គឺជារោងភាពយន្តលំដាប់ថ្នាក់អន្តរជាតិដំបូងគេបង្អស់ និងឈានមុខគេនៅក្នុងប្រទេសកម្ពុជា ដែលបង្កើតឡើង និងគ្រប់គ្រងទាំងស្រុងដោយជនជាតិខ្មែរ តាំងពីឆ្នាំ២០១១។ ការរីកចម្រើន និងការពង្រីកសាខាយ៉ាងលឿនរហ័សពី ១ រហូតដល់ ១៣ ទីតាំងរោងភាពយន្តក្នុងរយៈពេល ១២ ឆ្នាំកន្លងមកនេះនៅទូទាំងប្រទេស បានបង្ហាញពីភាពរឹងមាំក្នុងការផ្តល់ជូន និងឥទ្ធិពលយ៉ាងខ្លាំងក្លានៅក្នុងឧស្សាហកម្មភាពយន្ត និងការកម្សាន្ត។",
  },
  aboutParagraph2: {
    en: "Today, we have successfully implemented and deployed advanced cinema technologies and levelled up our offerings, beyond cinema norms. Our team is dedicated to providing top tier immersive cinema experience and excellent services with the essence of Khmer hospitality. With our new direction in place, we are determined to inspire, drive change and make an impact in the industry, and exceed expectations.",
    kh: "បច្ចុប្បន្ននេះ យើងបានដាក់ឱ្យដំណើរការដោយជោគជ័យនូវបច្ចេកវិទ្យារោងភាពយន្តដ៏ទំនើបៗ និងបានលើកកម្ពស់ការផ្តល់ជូនរបស់យើង ឱ្យលើសពីបទដ្ឋានរោងភាពយន្តធម្មតា។ ក្រុមការងាររបស់យើងប្តេជ្ញាចិត្តខ្ពស់ក្នុងការផ្តល់ជូននូវបទពិសោធន៍ទស្សនាភាពយន្តដ៏អស្ចារ្យ និងសេវាកម្មដ៏ល្អឥតខ្ចោះ ប្រកបដោយបដិសណ្ឋារកិច្ចដ៏កក់ក្តៅរបស់ខ្មែរ។ ជាមួយនឹងទិសដៅថ្មីរបស់យើង យើងប្ដេជ្ញាចិត្តក្នុងការបង្កើតការបំផុសគំនិត ជំរុញការផ្លាស់ប្តូរ និងបង្កើតឥទ្ធិពលវិជ្ជមាននៅក្នុងឧស្សាហកម្មនេះ ព្រមទាំងផ្តល់ឱ្យលើសពីការរំពឹងទុក។",
  },

  // Contact Us Page
  contactUs: {
    en: "Contact Us",
    kh: "ទាក់ទងមកយើង",
  },
  contactInfoTitle: {
    en: "Contact Info",
    kh: "ព័ត៌មានទំនាក់ទំនង",
  },
  hotlineLabel: {
    en: "Hotline",
    kh: "ខ្សែទូរស័ព្ទបន្ទាន់",
  },
  messengerLabel: {
    en: "Messenger",
    kh: "សារអេឡិចត្រូនិច (Messenger)",
  },
  advertisingLabel: {
    en: "Advertising & Partnership",
    kh: "ការផ្សាយពាណិជ្ជកម្ម និងកិច្ចសហការ",
  },

  // publication or news
  publicationsTitle: {
    en: "Publications",
    kh: "ព័ត៌មាន និងសកម្មភាព",
  },

  // Terms & Conditions Page General Layout
  termsAndConditions: {
    en: "Terms & Conditions",
    kh: "លក្ខខណ្ឌផ្សេងៗ",
  },
  jumpToLabel: {
    en: "Jump To:",
    kh: "រំលងទៅកាន់៖",
  },
  jumpToSectionLabel: {
    en: "Jump To Section",
    kh: "រំលងទៅផ្នែកផ្សេងៗ",
  },
  ticketRegsTab: {
    en: "Ticket Regulations",
    kh: "បទបញ្ញត្តិសំបុត្រ",
  },
  dxSafetyTab: {
    en: "4DX Safety Guidelines",
    kh: "ការណែនាំសុវត្ថិភាព 4DX",
  },

  // SECTION 1: Ticket Purchased Rules
  ticketRulesTitle: {
    en: "Ticket Purchased Rule and Regulation",
    kh: "ច្បាប់ និងបទបញ្ញត្តិនៃការទិញសំបុត្រ",
  },
  ticketRule1: {
    en: "Every movie tickets purchased via the Sale Channels are strictly non-refundable and are not available for exchange under whatever circumstances.",
    kh: "រាល់សំបុត្រកុនដែលបានទិញតាមរយៈបណ្តាញលក់ គឺមិនអាចប្តូរប្រាក់វិញបានទេ ហើយក៏មិនអាចផ្លាស់ប្តូរបានដែរ ទោះស្ថិតក្នុងកាលៈទេសៈណាក៏ដោយ។",
  },
  ticketRule2: {
    en: "Purchased tickets are not exchangeable for tickets at a different price, for another movie, or for another screening or day.",
    kh: "សំបុត្រដែលបានទិញរួចមិនអាចប្តូរយកសំបុត្រដែលមានតម្លៃខុសគ្នា សម្រាប់រឿងផ្សេង ឬសម្រាប់ការបញ្ចាំងនៅម៉ោងផ្សេង ឬថ្ងៃផ្សេងបានឡើយ។",
  },
  ticketRule3: {
    en: "Movie tickets purchased via the Sales Channels will be available for collection at the relevant cinema from the ticket counter or at our KIOSK machine (where available) by producing the booking numbers/reservation sent by email or as available under the purchased history feature in Legend Mobile application or any other means that shall be introduced by Legend Cinema from time time.",
    kh: "សំបុត្រកុនដែលបានទិញតាមរយៈបណ្តាញលក់ អាចមកទទួលយកបាននៅរោងកុនដែលពាក់ព័ន្ធពីបញ្ជរលក់សំបុត្រ ឬនៅម៉ាស៊ីន KIOSK (កន្លែងដែលមាន) ដោយបង្ហាញលេខកក់/ការកក់ដែលផ្ញើតាមអ៊ីមែល ឬដែលមាននៅក្នុងមុខងារប្រវត្តិនៃការទិញក្នុងកម្មវិធីទូរស័ព្ទ Legend ឬមធ្យោបាយផ្សេងទៀតដែលនឹងត្រូវដាក់ឱ្យប្រើប្រាស់ដោយ រោងភាពយន្ត លីជេន ពីពេលមួយទៅពេលមួយ។",
  },
  ticketRule4Part1: {
    en: "In case of any malfunctions of the reservation or purchase form placed on the website or mobile application, please contact us immediately at the following e-mail address",
    kh: "ក្នុងករណីមានដំណើរការខុសប្រក្រតីនៃទម្រង់កក់ ឬទិញនៅលើគេហទំព័រ ឬកម្មវិធីទូរស័ព្ទ សូមទាក់ទងមកយើងខ្ញុំជាបន្ទាន់តាមរយៈអាសយដ្ឋានអ៊ីមែលខាងក្រោម",
  },
  ticketRule4Part2: {
    en: "or contact our hotline",
    kh: "ឬទាក់ទងមកខ្សែទូរស័ព្ទបន្ទាន់របស់យើងខ្ញុំលេខ",
  },
  ticketRule4Part3: {
    en: "at least",
    kh: "យ៉ាងហោចណាស់",
  },
  ticketRule4Part4: {
    en: "minutes before the movie start. We would also like to inform you that it is the basis and condition for an effective complaint about the impossibility or difficulties in purchasing tickets online.",
    kh: "នាទីមុនពេលភាពយន្តចាប់ផ្តើម។ យើងខ្ញុំក៏សូមជម្រាបជូនផងដែរថា នេះជាមូលដ្ឋាន និងលក្ខខណ្ឌសម្រាប់ការប្តឹងតវ៉ាប្រកបដោយប្រសិទ្ធភាពអំពីភាពមិនអាចទៅរួច ឬការលំបាកក្នុងការទិញសំបុត្រតាមអ៊ីនធឺណិត។",
  },
  ticketRule5Part1: {
    en: "If the User fails to purchase a ticket for the screening for which he or she has reserved a seat in the Legend Cinema within the time limit specified in clause",
    kh: "ប្រសិនបើអ្នកប្រើប្រាស់មិនបានទិញសំបុត្រសម្រាប់ការបញ្ចាំងដែលខ្លួនបានកក់កៅអីនៅក្នុងរោងភាពយន្ត លីជេន ក្នុងកំឡុងពេលកំណត់ដែលបានបញ្ជាក់ក្នុងប្រការ",
  },
  ticketRule5Part2: {
    en: "above, the reservation of such a seat cannot be guaranteed.",
    kh: "ខាងលើ ការកក់ទុកកៅអីបែបនេះមិនអាចធានាបានឡើយ។",
  },
  ticketRule6: {
    en: "Movie tickets are made available subject to the classification of relevant film given by the Film Censorship Board of Cambodia. Legend Cinema has a legal obligation to refuse admission to a person, who in the opinion of its duty manager, is under the minimum age required for NC15 and R18 classified films (including children in arms). Proof of age may be required in certain instances.",
    kh: "សំបុត្រកុនត្រូវបានផ្តល់ជូនទៅតាមចំណាត់ថ្នាក់នៃខ្សែភាពយន្តដែលពាក់ព័ន្ធដែលផ្តល់ដោយគណៈកម្មការត្រួតពិនិត្យភាពយន្តនៃប្រទេសកម្ពុជា។ រោងភាពយន្ត លីជេន មានកាតព្វកិច្ចផ្លូវច្បាប់ក្នុងការបដិសេធការចូលទស្សនារបស់បុគ្គលណា ដែលតាមគំនិតរបស់អ្នកគ្រប់គ្រងវេន គឺមានអាយុក្រោមអាយុអប្បបរមាដែលតម្រូវសម្រាប់ខ្សែភាពយន្តចំណាត់ថ្នាក់ NC15 និង R18 (រួមទាំងកុមារនៅក្នុងដៃផងដែរ)។ ភស្តុតាងបញ្ជាក់អាយុអាចនឹងត្រូវតម្រូវក្នុងករណីខ្លះ។",
  },
  ticketRightsDisclaimer: {
    en: "Legend Cinema reserved the rights to have term and condition changed.",
    kh: "រោងភាពយន្ត លីជេន រក្សាសិទ្ធិក្នុងការផ្លាស់ប្តូរលក្ខខណ្ឌផ្សេងៗ។",
  },
  copyrightNotice: {
    en: "All rights reserved Legend Cinema Co, Ltd 2024.",
    kh: "រក្សាសិទ្ធិគ្រប់យ៉ាងដោយក្រុមហ៊ុន រោងភាពយន្ត លីជេន ឯ.ក ២០២៤។",
  },

  // SECTION 2: 4DX Safety Guidelines
  dxSafetyTitle: {
    en: "4DX Auditorium Safety Guideline & Advisory Notice",
    kh: "លក្ខខណ្ឌសុវត្ថិភាព និងការជូនដំណឹងណែនាំក្នុងសាល 4DX",
  },
  dxNoticeHeader: {
    en: "Important Notice to All Guests",
    kh: "ការជូនដំណឹងសំខាន់ដល់ភ្ញៀវទាំងអស់",
  },
  dxNoticeBody: {
    en: "The 4DX auditorium features advanced environmental effects including high-velocity motion-controlled seating, sudden pitching/rolling, vibrations, leg/back ticklers, water sprays, wind blasts, intense strobe lighting, fog, and artificial scents.",
    kh: "សាលចាក់កុន 4DX មានលក្ខណៈពិសេសនៃផលប៉ះពាល់បរិស្ថានកម្រិតខ្ពស់ រួមទាំងកៅអីដែលមានចលនាគ្រប់គ្រងដោយល្បឿនលឿន ការផ្អៀង/បង្វិលភ្លាមៗ ការញ័រ ឧបករណ៍ផ្ទុកជើង/ខ្នង ការបាញ់ទឹក កម្លាំងខ្យល់ ពន្លឺភ្លើងស្ត្រប៊ូសខ្លាំង អ័ព្ទ និងក្លិនសិប្បនិម្មិត។",
  },
  dxNoticeDisclaimer: {
    en: "By purchasing a ticket, you acknowledge and agree to adhere to the safety protocols detailed below. Admission is at your own risk.",
    kh: "តាមរយៈការទិញសំបុត្រ អ្នកទទួលស្គាល់ និងយល់ព្រមអនុវត្តតាមពិធីការសុវត្ថិភាពដែលមានលម្អិតខាងក្រោម។ ការចូលទស្សនាគឺស្ថិតនៅលើហានិភ័យផ្ទាល់ខ្លួនរបស់អ្នក។",
  },

  // Subsection 1: Admission Restrictions
  dxSub1Title: {
    en: "Critical Admission Restrictions",
    kh: "ការរឹតបន្តឹងសំខាន់ៗលើការចូលទស្សនា",
  },
  dxSub1Desc: {
    en: "Guests who do not meet the physical criteria below will be denied entry for mechanical safety and injury prevention:",
    kh: "ភ្ញៀវដែលមិនបំពេញតាមលក្ខណៈវិនិច្ឆ័យរាងកាយខាងក្រោមនឹងត្រូវបដិសេធមិនឱ្យចូល ដើម្បីសុវត្ថិភាពមេកានិច និងការពាររបួស៖",
  },
  dxHeightLabel: {
    en: "Minimum Height:",
    kh: "កម្ពស់អប្បបរមា៖",
  },
  dxHeightPart1: {
    en: "Must be at least",
    kh: "ត្រូវតែមានកម្ពស់យ៉ាងហោចណាស់",
  },
  dxHeightPart2: {
    en: "or",
    kh: "ឬ",
  },
  dxHeightPart3: {
    en: "tall.",
    kh: "ឡើងទៅ។",
  },
  dxAgeLabel: {
    en: "Minimum Age:",
    kh: "អាយុអប្បបរមា៖",
  },
  dxAgePart1: {
    en: "Must be at least",
    kh: "ត្រូវតែមានអាយុយ៉ាងហោចណាស់",
  },
  dxAgePart2: {
    en: "years old.",
    kh: "ឆ្នាំឡើងទៅ។",
  },
  dxWeightLabel: {
    en: "Maximum Weight:",
    kh: "ទម្ងន់អតិបរមា៖",
  },
  dxWeightPart1: {
    en: "Must not exceed",
    kh: "មិនត្រូវលើសពី",
  },
  dxWeightPart2: {
    en: "or",
    kh: "ឬ",
  },
  dxSupervisionLabel: {
    en: "Supervision:",
    kh: "ការត្រួតពិនិត្យ៖",
  },
  dxSupervisionPart1: {
    en: "Children aged",
    kh: "កុមារដែលមានអាយុចាប់ពី",
  },
  dxSupervisionPart2: {
    en: "to",
    kh: "ដល់",
  },
  dxSupervisionPart3: {
    en: "must be accompanied and directly supervised by an adult at all times.",
    kh: "ឆ្នាំ ត្រូវតែមានការកំដរ និងត្រួតពិនិត្យផ្ទាល់ពីមនុស្សពេញវ័យគ្រប់ពេលវេលា។",
  },
  dxSeatingLabel: {
    en: "Seating Configuration:",
    kh: "ទម្រង់នៃការអង្គុយ៖",
  },
  dxSeatingDesc: {
    en: "Lap-sitting is strictly prohibited. Every guest must occupy their own assigned seat. Child booster seats are forbidden as they interfere with the seat mechanics.",
    kh: "ការអង្គុយលើភ្លៅត្រូវបានហាមឃាត់ដាច់ខាត。 ភ្ញៀវម្នាក់ៗត្រូវតែអង្គុយលើកៅអីដែលបានកំណត់រៀងៗខ្លួន។ កៅអីកុមារជំនួយ (Booster seats) ត្រូវបានហាមឃាត់ ព្រោះវាទាស់នឹងប្រព័ន្ធមេកានិចរបស់កៅអី។",
  },

  // Subsection 2: Medical & Health Prohibitions
  dxSub2Title: {
    en: "Medical & Health Prohibitions",
    kh: "ការហាមឃាត់ផ្នែកវេជ្ជសាស្ត្រ និងសុខភាព",
  },
  dxSub2Desc: {
    en: "Entry is strictly prohibited or highly discouraged for individuals with the following medical conditions, as the intense physical environment may aggravate injuries or cause severe distress:",
    kh: "ការចូលទស្សនាត្រូវបានហាមឃាត់ដាច់ខាត ឬមិនណែនាំយ៉ាងខ្លាំងសម្រាប់បុគ្គលដែលមានស្ថានភាពវេជ្ជសាស្ត្រដូចខាងក្រោម ដោយសារបរិយាកាសរាងកាយខ្លាំងអាចធ្វើឱ្យរបួសធ្ងន់ធ្ងរ ឬបង្កឱ្យមានការឈឺចាប់ធ្ងន់ធ្ងរ៖",
  },
  dxMedicalCondition1: {
    en: "Expectant mothers (Pregnancy)",
    kh: "ស្ត្រីមានផ្ទៃពោះ",
  },
  dxMedicalCondition2: {
    en: "Individuals with chronic back, neck, or spinal injuries/conditions",
    kh: "បុគ្គលដែលមានរបួស/ស្ថានភាពរ៉ាំរ៉ៃ ខ្នង ក ឬឆ្អឹងខ្នង",
  },
  dxMedicalCondition3: {
    en: "Individuals with heart conditions, high blood pressure, or cardiovascular irregularities",
    kh: "បុគ្គលដែលមានស្ថានភាពបេះដូង សម្ពាធឈាមខ្ពស់ ឬភាពមិនប្រក្រតីនៃសរសៃឈាមបេះដូង",
  },
  dxMedicalCondition4: {
    en: "Individuals prone to epilepsy, photosensitive seizures, or severe migraines (due to strobe lights)",
    kh: "បុគ្គលដែលងាយនឹងកើតជំងឺឆ្កួតជ្រូក ជំងឺឆ្កួតជ្រូកដែលប្រតិកម្មនឹងពន្លឺ ឬការឈឺក្បាលប្រកាំងធ្ងន់ធ្ងរ (ដោយសារពន្លឺស្ត្រប៊ូស)",
  },
  dxMedicalCondition5: {
    en: "Individuals suffering from severe motion sickness, vertigo, or balance disorders",
    kh: "បុគ្គលដែលទទួលរងពីការវិលមុខខ្លាំង ជំងឺវិលមុខ (Vertigo) ឬបញ្ហាអតុល្យភាពរាងកាយ",
  },
  dxMedicalCondition6: {
    en: "Individuals who have recently undergone surgery or have limited physical mobility",
    kh: "បុគ្គលដែលទើបតែទទួលការវះកាត់ ឬមានកម្រិតក្នុងការធ្វើចលនារាងកាយ",
  },

  // Subsection 3: Ambient Effects
  dxSub3Title: {
    en: "Ambient Effects & Customer Uneasiness Warnings",
    kh: "ការព្រមានអំពីផលប៉ះពាល់បរិស្ថាន និងការមិនស្រណុកក្នុងខ្លួន",
  },
  dxSub3Desc: {
    en: "Even healthy guests may experience unexpected physical discomfort during the screening. Please note the following environmental factors:",
    kh: "សូម្បីតែភ្ញៀវដែលមានសុខភាពល្អក៏អាចជួបប្រទះនូវការមិនស្រណុកក្នុងខ្លួនដោយមិនបានរំពឹងទុកក្នុងអំឡុងពេលបញ្ចាំង។ សូមកត់សម្គាល់នូវកត្តាបរិស្ថានខាងក្រោម៖",
  },
  dxEffectsRespLabel: {
    en: "Respiratory & Scent Triggers:",
    kh: "ការប៉ះពាល់ផ្លូវដង្ហើម និងក្លិន៖",
  },
  dxEffectsRespDesc: {
    en: "The theater uses synthetic fragrances (e.g., smoke, gunpowder, floral scents) and artificial fog. Guests with severe asthma, respiratory issues, or chemical sensitivities may experience irritation.",
    kh: "រោងភាពយន្តប្រើប្រាស់ក្លិនសិប្បនិម្មិត (ឧទាហរណ៍ ផ្សែង ម្សៅកាំភ្លើង ក្លិនផ្កា) និងអ័ព្ទសិប្បនិម្មិត។ ភ្ញៀវដែលមានជំងឺហឺតធ្ងន់ធ្ងរ បញ្ហាផ្លូវដង្ហើម ឬប្រតិកម្មគីមី អាចមានអារម្មណ៍រំខាន ឬរលាកផ្លូវដង្ហើម។",
  },
  dxEffectsWaterLabel: {
    en: "Water Effects:",
    kh: "ផលប៉ះពាល់នៃទឹក៖",
  },
  dxEffectsWaterDesc: {
    en: "Water will be sprayed directly at your face from the seat ahead. While the water is purified, it may smudge makeup, spot eyewear, or damage delicate clothing (e.g., silk, suede, leather).",
    kh: "ទឹកនឹងត្រូវបាញ់ចំមុខរបស់អ្នកពីកៅអីខាងមុខ។ ទោះបីជាទឹកត្រូវបានចម្រោះស្អាតក៏ដោយ វាអាចធ្វើឱ្យខូចការផាត់មុខ ប្រឡាក់វ៉ែនតា ឬខូចខាតសម្លៀកបំពាក់ដែលងាយខូច (ដូចជា សូត្រ ស្បែកសត្វជាដើម)។",
  },
  dxEffectsWaterControl: {
    en: "Control Option: Guests may manually deactivate the water effects using the On/Off button located on their individual armrest.",
    kh: "ជម្រើសគ្រប់គ្រង៖ ភ្ញៀវអាចបិទមុខងារទឹកដោយដៃផ្ទាល់ ដោយប្រើប៊ូតុង បើក/បិទ (On/Off) ដែលមាននៅលើដៃកៅអីរៀងៗខ្លួន។",
  },
  dxEffectsStartleLabel: {
    en: "Startle Reflexes:",
    kh: "ប្រតិកម្មភ្ញាក់ផ្អើល៖",
  },
  dxEffectsStartleDesc: {
    en: "High-pressure air jets located near the headrest simulate projectiles passing close to the ears. This produces a sudden, loud hissing sound that can startle sensitive viewers.",
    kh: "បណ្តាញខ្យល់សម្ពាធខ្ពស់ដែលមានទីតាំងនៅជិតកន្លែងកល់ក្បាល ធ្វើត្រាប់តាមវត្ថុដែលហោះកាត់ជិតត្រចៀក។ វាបង្កើតសំឡេងខ្យល់បាញ់ខ្លាំងភ្លាមៗ ដែលអាចធ្វើឱ្យអ្នកទស្សនាដែលងាយភ្ញាក់ផ្អើលមានការភិតភ័យ។",
  },

  // Subsection 4: In-Theater Safety & Liability Rules
  dxSub4Title: {
    en: "In-Theater Safety & Liability Rules",
    kh: "ច្បាប់សុវត្ថិភាព និងការទទួលខុសត្រូវក្នុងសាល",
  },
  dxRulesSeatedLabel: {
    en: 'The "Stay Seated" Rule:',
    kh: 'ច្បាប់ "អង្គុយឱ្យនៅស្ងៀម"៖',
  },
  dxRulesSeatedDesc: {
    en: "Guests must remain fully seated with feet on the footrest throughout the duration of the movie. Do not stand or walk while the seats are in motion.",
    kh: "ភ្ញៀវត្រូវតែអង្គុយឱ្យជាប់លើកៅអី ដោយដាក់ជើងនៅលើទ្រនាប់ជើងពេញមួយកំឡុងពេលបញ្ចាំងកុន។ ហាមក្រោកឈរ ឬដើរនៅពេលកៅអីកំពុងមានចលនា។",
  },
  dxRulesLostLabel: {
    en: "Lost Items Hazard:",
    kh: "គ្រោះថ្នាក់នៃការបាត់បង់របស់របរ៖",
  },
  dxRulesLostDesc: {
    en: "If a personal item (phone, wallet, keys) falls beneath the seating platform, DO NOT attempt to retrieve it while the film is playing. The mechanical lift systems underneath the chairs move without warning and pose a severe crush hazard. Wait until the credits roll, the house lights turn on, and the seats completely power down, or alert a floor staff member.",
    kh: "ប្រសិនបើរបស់របរផ្ទាល់ខ្លួន (ទូរស័ព្ទ កាបូបលុយ សោ) ធ្លាក់នៅក្រោមវេទិកាកៅអី ហាមព្យាយាមយកវានៅពេលកុនកំពុងចាក់។ ប្រព័ន្ធលើកមេកានិចនៅក្រោមស្មាកៅអីធ្វើចលនាដោយគ្មានការព្រមានទុកជាមុន និងបង្កឱ្យមានគ្រោះថ្នាក់កំទេចម្រាមដៃ ឬដៃធ្ងន់ធ្ងរ។ សូមរង់ចាំរហូតដល់កុនចប់ ភ្លើងក្នុងសាលបើក និងកៅអីឈប់ដំណើរការទាំងស្រុង ឬរាយការណ៍ជូនបុគ្គលិកប្រចាំការ។",
  },
  dxRulesDrinksLabel: {
    en: "Hot Beverage Ban:",
    kh: "ការហាមឃាត់ភេសជ្ជៈក្តៅ៖",
  },
  dxRulesDrinksDesc: {
    en: "No hot drinks or open soup containers are permitted inside the auditorium to prevent severe spill or burn injuries during sudden seat movements. All cold beverages must be securely capped.",
    kh: "មិនត្រូវបានអនុញ្ញាតឱ្យយកភេសជ្ជៈក្តៅ ឬចានស៊ុបបើកចំហរចូលក្នុងសាលឡើយ ដើម្បីការពារការកំពប់ ឬរលាកធ្ងន់ធ្ងរអំឡុងពេលកៅអីកម្រើកភ្លាមៗ។ ភេសជ្ជៈត្រជាក់ទាំងអស់ត្រូវតែមានគម្របបិទជិត។",
  },
  dxRulesValuablesLabel: {
    en: "Valuables Protection:",
    kh: "ការការពាររបស់មានតម្លៃ៖",
  },
  dxRulesValuablesDesc: {
    en: "Secure all loose personal belongings, bags, and coats. The cinema is not liable for items damaged, wet, or lost due to motion and environmental effects.",
    kh: "សូមរក្សារបស់របរផ្ទាល់ខ្លួន កាបូប និងអាវធំឱ្យបានមានសុវត្ថិភាព។ រោងភាពយន្តមិនទទួលខុសត្រូវចំពោះរបស់របរដែលខូចខាត ទទឹក ឬបាត់បង់ដោយសារចលនា និងផលប៉ះពាល់បរិស្ថានឡើយ។",
  },

  // Privacy Policy Page
  privacyPolicy: {
    en: "Privacy Policy",
    kh: "គោលការណ៍ឯកជនភាព",
  },
  dataCollectionTab: {
    en: "Data Collection",
    kh: "ការប្រមូលទិន្នន័យ",
  },
  dataUsageTab: {
    en: "Data Usage",
    kh: "ការប្រើប្រាស់ទិន្នន័យ",
  },
  dataSecurityTab: {
    en: "Security & Contact",
    kh: "សុវត្ថិភាព និងទំនាក់ទំនង",
  },
  dataCollectionTitle: {
    en: "Information We Collect",
    kh: "ព័ត៌មានដែលយើងប្រមូលប្រភព",
  },
  dataCollectionIntro: {
    en: "We collect information to provide better services to all our users. This tracking happens in three key areas:",
    kh: "យើងប្រមូលព័ត៌មានដើម្បីផ្តល់សេវាកម្មកាន់តែប្រសើរដល់អ្នកប្រើប្រាស់របស់យើងទាំងអស់។ ការតាមដាននេះកើតឡើងលើបីផ្នែកសំខាន់ៗ៖",
  },
  personalDataLabel: {
    en: "Personal Data:",
    kh: "ទិន្នន័យផ្ទាល់ខ្លួន៖",
  },
  personalDataDesc: {
    en: "This includes identification details you provide when registering, such as your full name, phone number, and email address.",
    kh: "នេះរួមបញ្ចូលទាំងព័ត៌មានលម្អិតអត្តសញ្ញាណដែលអ្នកបានផ្តល់នៅពេលចុះឈ្មោះ ដូចជាឈ្មោះពេញ លេខទូរស័ព្ទ និងអាសយដ្ឋានអ៊ីមែលរបស់អ្នក។",
  },
  usageDataLabel: {
    en: "Usage Data:",
    kh: "ទិន្នន័យប្រើប្រាស់៖",
  },
  usageDataDesc: {
    en: "Automated tracking logs representing how you interact with the application layout, selected showtimes, and movie views.",
    kh: "កំណត់ត្រាតាមដានស្វ័យប្រវត្តដែលបង្ហាញពីរបៀបដែលអ្នកធ្វើអន្តរកម្មជាមួយកម្មវិធី ម៉ោងបញ្ចាំងដែលបានជ្រើសរើស និងការមើលភាពយន្ត។",
  },
  cookiesLabel: {
    en: "Cookies & Sessions:",
    kh: "ឃុកឃី និងវគ្គប្រើប្រាស់៖",
  },
  cookiesDesc: {
    en: "Essential analytical session properties tracked to retain your authentication states, preferences, and language toggles.",
    kh: "លក្ខណៈសម្បត្តិវគ្គវិភាគសំខាន់ៗដែលត្រូវបានតាមដានដើម្បីរក្សាស្ថានភាពផ្ទៀងផ្ទាត់ ចំណូលចិត្ត និងការប្តូរភាសារបស់អ្នក។",
  },
  dataUsageTitle: {
    en: "How We Use Your Information",
    kh: "របៀបដែលយើងប្រើប្រាស់ព័ត៌មានរបស់អ្នក",
  },
  dataUsageIntro: {
    en: "The data processed serves dedicated purposes to secure runtime architecture efficiency and provide personalized entertainment discovery channels:",
    kh: "ទិន្នន័យដែលបានដំណើរការបម្រើគោលបំណងជាក់លាក់ដើម្បីធានាបាននូវប្រសិទ្ធភាពរចនាសម្ព័ន្ធដំណើរការ និងផ្តល់នូវបណ្តាញស្វែងរកការកម្សាន្តផ្ទាល់ខ្លួន៖",
  },
  useCaseServiceTitle: {
    en: "Core Service Provision",
    kh: "ការផ្តល់សេវាកម្មស្នូល",
  },
  useCaseServiceDesc: {
    en: "Processing ticket reservations, validating dynamic QR codes, and processing secure structural payment flows seamlessly.",
    kh: "ដំណើរការការកក់សំបុត្រ ការផ្ទៀងផ្ទាត់កូដ QR ឌីណាមិក និងដំណើរការលំហូរទូទាត់ប្រាក់ដែលមានសុវត្ថិភាពដោយរលូន។",
  },
  useCaseCommTitle: {
    en: "System Communication",
    kh: "ការទំនាក់ទំនងប្រព័ន្ធ",
  },
  useCaseCommDesc: {
    en: "Dispatching updates regarding dynamic schedule adjustments, runtime system warnings, and direct ticket confirmation status updates.",
    kh: "ការបញ្ជូនព័ត៌មានថ្មីៗទាក់ទងនឹងការកែសម្រួលកាលវិភាគ ការព្រមានអំពីប្រព័ន្ធដំណើរការ និងការធ្វើបច្ចុប្បន្នភាពស្ថានភាពបញ្ជាក់សំបុត្រផ្ទាល់។",
  },
  useCaseSafetyTitle: {
    en: "Fraud & Safety Audits",
    kh: "ការត្រួតពិនិត្យការក្លែងបន្លំ និងសុវត្ថិភាព",
  },
  useCaseSafetyDesc: {
    en: "Enforcing modern tracking profiles to suppress malicious behaviors, bot interaction traces, and seat scalping events.",
    kh: "ការអនុវត្តទម្រង់តាមដានទំនើប ដើម្បីទប់ស្កាត់អាកប្បកិរិយាព្យាបាទ ស្នាមអន្តរកម្មរបស់ Bot និងព្រឹត្តិការណ៍កក់កៅអីមិនប្រក្រតី។",
  },
  useCaseImproveTitle: {
    en: "Experience Optimization",
    kh: "ការបង្កើនប្រសិទ្ធភាពបទពិសោធន៍",
  },
  useCaseImproveDesc: {
    en: "Analyzing customer behavior patterns to fine-tune visual interface features, system layouts, and core platform reliability properties.",
    kh: "ការវិភាគគំរូអាកប្បកិរិយារបស់អតិថិជនដើម្បីកែសម្រួលមុខងារចំណុចប្រទាក់ចាក់កុន ប្លង់ប្រព័ន្ធ និងលក្ខណៈសម្បត្តិភាពជឿជាក់នៃប្រព័ន្ធស្នូល។",
  },
  dataSecurityTitle: {
    en: "Data Security and Compliance",
    kh: "សុវត្ថិភាពទិន្នន័យ និងការអនុលោមតាមច្បាប់",
  },
  securityHeader: {
    en: "Encrypted Data Transmission Policies",
    kh: "គោលការណ៍បញ្ជូនទិន្នន័យដែលបានកូដនីយកម្ម (Encryption)",
  },
  securityBody: {
    en: "We deploy industrial standard TLS transport encryption configurations alongside robust structural database parameters. However, no digital transport medium provides perfect immunity; absolute safety metrics cannot be fundamentally guaranteed.",
    kh: "យើងដាក់ឱ្យដំណើរការការកំណត់កូដនីយកម្មការដឹកជញ្ជូន TLS តាមស្តង់ដារឧស្សាហកម្ម រួមជាមួយប៉ារ៉ាម៉ែត្រមូលដ្ឋានទិន្នន័យរចនាសម្ព័ន្ធដ៏រឹងមាំ។ ទោះជាយ៉ាងណាក៏ដោយ គ្មានប្រព័ន្ធឌីជីថលណាដែលអាចផ្តល់នូវភាពស៊ាំល្អឥតខ្ចោះនោះទេ  מדדיםសុវត្ថិភាពដាច់ខាតមិនអាចធានាបានជាដាច់ខាតឡើយ។",
  },
  securityContactText: {
    en: "For explicit privacy queries or structural records erasure requests, please open an investigation profile with our support infrastructure via email at",
    kh: "សម្រាប់សំណួរអំពីឯកជនភាពច្បាស់លាស់ ឬសំណើលុបកំណត់ត្រារចនាសម្ព័ន្ធ សូមផ្ញើសំណើមកកាន់ហេដ្ឋារចនាសម្ព័ន្ធគាំទ្ររបស់យើងតាមរយៈអ៊ីមែល ",
  },
  securityContactOr: {
    en: "or phone line",
    kh: "ឬប្រព័ន្ធទូរស័ព្ទ ",
  },
  privacyRightsDisclaimer: {
    en: "Legend Cinema reserves all programmatic rights to adjust tracking metrics without advance advisory distribution.",
    kh: "រោងភាពយន្ត លីជេន រក្សាសិទ្ធិកម្មវិធីទាំងអស់ក្នុងការកែសម្រួលរង្វាស់តាមដានដោយមិនចាំបាច់ចែកចាយការណែនាំជាមុន។",
  },

  availableShowtimes: {
    en: "Available Showtimes",
    kh: "ម៉ោងបញ្ចាំងដែលមាន",
  },
  synopsis: {
    en: "Synopsis",
    kh: "សង្ខេបភាពយន្ត",
  },
  noShowtimes: {
    en: "No showtimes available",
    kh: "មិនមានម៉ោងបញ្ចាំងទេ",
  },

 
};

export const footerTranslations: Record<
  string,
  Record<LanguageCode, string>
> = {
  company: {
    en: "Company",
    kh: "ក្រុមហ៊ុន",
  },
  aboutUs: {
    en: "About Us",
    kh: "អំពីយើង",
  },
  contactUs: {
    en: "Contact Us",
    kh: "ទំនាក់ទំនងយើង",
  },
  cinemas: {
    en: "Cinemas",
    kh: "រោងភាពយន្ត",
  },
  more: {
    en: "More",
    kh: "បន្ថែម",
  },
  promotions: {
    en: "Promotions",
    kh: "ការផ្តល់ជូនពិសេស",
  },
  newsActivity: {
    en: "News & Activity",
    kh: "ព័ត៌មាន និងសកម្មភាព",
  },
  myTickets: {
    en: "My Tickets",
    kh: "សំបុត្ររបស់ខ្ញុំ",
  },
  termsConditions: {
    en: "Terms & Conditions",
    kh: "លក្ខខណ្ឌផ្សេងៗ",
  },
  privacyPolicy: {
    en: "Privacy Policy",
    kh: "គោលការណ៍ឯកជនភាព",
  },
  downloadApp: {
    en: "Download Our App",
    kh: "ទាញយកកម្មវិធីរបស់យើង",
  },
  followSocials: {
    en: "Follow Our Social Media",
    kh: "តាមដានបណ្តាញសង្គមរបស់យើង",
  },
  payment: {
    en: "Payment",
    kh: "ការទូទាត់ប្រាក់",
  },
  copyright: {
    en: "Ticket Booking System. All rights reserved.",
    kh: "ប្រព័ន្ធកក់សំបុត្រ។ រក្សាសិទ្ធិគ្រប់យ៉ាង។",
  },
};
