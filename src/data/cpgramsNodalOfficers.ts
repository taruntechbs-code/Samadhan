/**
 * SAMADHAN — Verified CPGRAMS Nodal Public Grievance Officer Intelligence (Phase 14.7)
 * Official statutory directory of designated Central Ministries, Departments, and State/UT Nodal Officers.
 *
 * OFFICIAL DATA SOURCES:
 * 1. Central Ministries / Departments / Organisations:
 *    https://pgportal.gov.in/Home/NodalPgOfficers
 * 2. States / Union Territories:
 *    https://pgportal.gov.in/Home/NodalPgOfficersState
 *
 * DATA INTEGRITY GUARANTEE:
 * - Deterministic, zero-fabrication directory.
 * - Sourced strictly from verified official CPGRAMS web portals.
 * - Display emails normalized from '[at]'/'[dot]' notation with preserved raw audit values.
 * - Bundled static dataset with provenance and verification metadata.
 */

export type NodalOfficerSourceType = 'CENTRAL' | 'STATE_UT';

export interface NodalGrievanceOfficer {
  organisation: string;
  name: string;
  designation: string;
  address?: string;
  phone?: string;
  fax?: string;
  email?: string;
  rawEmail?: string;
  sourceUrl: string;
  sourceType: NodalOfficerSourceType;
  verifiedAt: string;
}

export interface NodalOfficerMatchResult {
  officer: NodalGrievanceOfficer | null;
  matchType: 'EXACT' | 'ALIAS' | 'STATE_ESCALATION' | 'NONE';
  matchedOrganisation?: string;
  isAvailable: boolean;
  unavailableMessage?: string;
}

export const CPGRAMS_CENTRAL_NODAL_OFFICERS: NodalGrievanceOfficer[] = [
  {
    "organisation": "Administrative Reforms and Public Grievances - PG Division",
    "name": "Sardendu Kumar Pandey",
    "designation": "Director",
    "address": "5th Floor Sardar Patel Bhawan Sansad Marg, New Delhi",
    "phone": "01123401455",
    "email": "Director-pg@gov.in",
    "rawEmail": "Director-pg[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Agriculture and Farmers Welfare",
    "name": "Shri Rajesh Kumar",
    "designation": "Deputy Secretary PG",
    "address": "Room No. 434 Krishi Bhavan New Delhi",
    "phone": "01123074238",
    "email": "rajesh.kumar67@nic.in",
    "rawEmail": "rajesh.kumar67[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Agriculture Research and Education",
    "name": "Narendra Kumar",
    "designation": "Deputy Secretary",
    "address": "R No. 207, Krishi Bhawan, New Delhi",
    "phone": "01123046678",
    "email": "narendra.kumar74@nic.in",
    "rawEmail": "narendra.kumar74[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Animal Husbandry, Dairying",
    "name": "RPS Rathore",
    "designation": "Director",
    "address": "Room No. 297, 2nd Floor, Krishi Bhavan, New Delhi",
    "phone": "01123385797",
    "email": "r.rathore@gov.in",
    "rawEmail": "r.rathore[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Atomic Energy",
    "name": "Shri K.V. Madhavadas",
    "designation": "Deputy Secretary",
    "address": "D/o Atomic Energy, Anushakti Bhavan, 3rd Floor, C S M Marg, MUMBAI",
    "phone": "02222862516",
    "email": "dsscs@dae.gov.in",
    "rawEmail": "dsscs[at]dae.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Ayush",
    "name": "Dr Srinivas Rao Chinta",
    "designation": "Joint Adviser",
    "address": "AYUSH BHAWAN, GPO COMPLEX,B BLOCK,INA ,NEW DELHI",
    "phone": "01124656948",
    "email": "ayush-cdn@gov.in",
    "rawEmail": "ayush-cdn[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Bio Technology",
    "name": "Rajesh Kumar Singh",
    "designation": "Director",
    "address": "Room No. 504, Block No. 3, 5th Floor, CGO Complex, Lodi Road, New Delhi",
    "phone": "01124363656",
    "email": "rajesh.kumar@gov.in",
    "rawEmail": "rajesh.kumar[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Central Board of Direct Taxes (Income Tax)",
    "name": "Swapna Devireddy",
    "designation": "Addl. Director of Income Tax TPS-II",
    "address": "4th Floor, Mayur Bhawan, Connaught Circus, New Delhi",
    "phone": "01123416133",
    "email": "delhi.addldit.eservices@incometax.gov.in",
    "rawEmail": "delhi.addldit.eservices[at]incometax.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Central Board of Excise and Customs",
    "name": "Ms. Ranjana Chaudhary",
    "designation": "Joint Director",
    "address": "Directorate General of Taxpayer Services, Room no 168, Ist Floor, Central Revenue Building, I.P. Es tate, New Delhi",
    "phone": "01123370576",
    "email": "ranjana.chaudhary@gov.in",
    "rawEmail": "ranjana.chaudhary[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Chemicals and Petrochemicals",
    "name": "Shri. Chitvan Singh Dhillon",
    "designation": "Deputy Director",
    "address": "Room No. 223 A , Shastri Bhavan, New Delhi",
    "phone": "01123386083",
    "email": "chitvan.dhillon@gov.in",
    "rawEmail": "chitvan.dhillon[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Civil Aviation",
    "name": "Shri Sudhansu Sekhar Mishra",
    "designation": "Deputy Secretary and PGO",
    "address": "Room. No.C-27, Ground Floor, B-Block, Rajiv Gandhi Bhawan, Safdarjung Airport, New Delhi",
    "phone": "01124610364",
    "email": "ss.mishra@nic.in",
    "rawEmail": "ss.mishra[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Coal",
    "name": "Smt Chetna Shukla",
    "designation": "Deputy Director General",
    "address": "Ministry of Coal, 5rd Floor, Lok Nayak Bhawan, New Delhi",
    "phone": "01124699948",
    "email": "chetna.shukla@nic.in",
    "rawEmail": "chetna.shukla[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Commerce",
    "name": "Shri Govind Mishra",
    "designation": "Deputy Secretary",
    "address": "Vanijya Bhavan, New Delhi",
    "phone": "01123038552",
    "email": "jspg-doc@gov.in",
    "rawEmail": "jspg-doc[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Consumer Affairs",
    "name": "Shri Prashant Dubey",
    "designation": "Director",
    "address": "Room No.372 - B Krishi Bhavan New Delhi",
    "phone": "01123384390",
    "email": "dspg-ca@gov.in",
    "rawEmail": "dspg-ca[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Cooperation",
    "name": "Shri Goonjan Kumar",
    "designation": "Joint  Director",
    "address": "Atal Akshay Urja Bhawan, CGO Complex, Lodhi Road, New Delhi",
    "phone": "01120849009",
    "email": "dir.cd3-coop@gov.in",
    "rawEmail": "dir.cd3-coop[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Corporate Affairs",
    "name": "C.M. Karlmarx",
    "designation": "Joint Director",
    "address": "Kota House, New Delhi",
    "phone": "01123385285",
    "email": "cm.karlmarx@gov.in",
    "rawEmail": "cm.karlmarx[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Culture",
    "name": "Randheep Thakur",
    "designation": "Director",
    "address": "Room No. 220075, Kartavya Bhawan-II, Ministry of Culture, New Delhi",
    "phone": "01124014233",
    "email": "randheep.thakur@nic.in",
    "rawEmail": "randheep.thakur[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Defence",
    "name": "Shri Manish Tripathi",
    "designation": "JS MIS",
    "address": "Room No. 198A, South Block New Delhi",
    "phone": "01123017828",
    "email": "usdpg-mod@gov.in",
    "rawEmail": "usdpg-mod[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Defence Finance",
    "name": "Dr. Ishita Ganguli Tripathy",
    "designation": "Addl. Financial Advisor and Joint Secretary",
    "address": "Room No 26039, 6th Floor Kartavya Bhawan-2, New Delhi",
    "phone": "01124014414",
    "email": "addl.fa1-dad@gov.in",
    "rawEmail": "addl.fa1-dad[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Defence Production",
    "name": "Dr. Meetu Agarwal",
    "designation": "Director Coord DDP",
    "address": "Room No. 25103, Kartavya Bhawan- 2, New Delhi",
    "phone": "01124015526",
    "email": "dir-coord@ddpmod.gov.in",
    "rawEmail": "dir-coord[at]ddpmod.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Defence Research and Development",
    "name": "Dr. Sanjai Kumar Dwivedi",
    "designation": "Sc G and Director Human Resource & Vigilance",
    "address": "DRDO HQrs, Min of Defence, Room No. 217, DRDO Bhawan, Rajaji Marg, New Delhi",
    "phone": "01123007218",
    "email": "director-dhrv@gov.in",
    "rawEmail": "director-dhrv[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Development of North Eastern Region",
    "name": "Shri Jitendra R. Gaikwad",
    "designation": "Joint Secretary",
    "address": "Room No. 11 Block- 12A Jodhpur Officers Hostel, Pandara Park",
    "phone": "01121411638",
    "email": "JR.Gaikwad@nic.in",
    "rawEmail": "JR.Gaikwad[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Drinking Water and Sanitation",
    "name": "Shri Arun Kumar Kembhavi",
    "designation": "Director",
    "address": "4th Floor, Pt. Deendayal Antyodhya Bhawan, CGO Complex,",
    "phone": "01124364112",
    "email": "arunkumar.kembhavi@gov.in",
    "rawEmail": "arunkumar.kembhavi[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Earth Sciences",
    "name": "RAJENDRA KUMAR KUMHAR",
    "designation": "Director",
    "address": "Room No. 305 3rd Floor, Prithvi Bhawan Opp. India Habitat Centre, Lodi Road, New Delhi",
    "phone": "01124669718",
    "email": "rajendrakumhar@ord.gov.in",
    "rawEmail": "rajendrakumhar[at]ord.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Economic Affairs",
    "name": "Mr. Sourabh Kumar",
    "designation": "Under Secretary",
    "address": "Room No. 15051 Work Hall, 5th Floor, A - Wing, Kartavya Bhavan - 1, New Delhi-110001",
    "phone": "01124012870",
    "email": "sourabhkumar3.pb@nic.in",
    "rawEmail": "sourabhkumar3.pb[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Electronics & Information Technology",
    "name": "Sudeep Shrivastava",
    "designation": "Joint Secretary and GC",
    "address": "6, CGO Complex, Electronics Niketan, New Delhi",
    "phone": "01124301815",
    "email": "js.ssoffice@meity.gov.in",
    "rawEmail": "js.ssoffice[at]meity.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Empowerment of Persons with Disabilities",
    "name": "Ipsita Mitra",
    "designation": "Deputy Secretary",
    "address": "5th Floor, Pt. Deendayal Antyodaya Bhawan, CGO Complex, Lodhi Road, New Delhi",
    "phone": "01124369066",
    "email": "cpgramsdepwd@gmail.com",
    "rawEmail": "cpgramsdepwd[at]gmail[dot]com",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Environment, Forest and Climate Change",
    "name": "Shri Debabrata Das",
    "designation": "Deputy Secretary",
    "address": "3rd Floor, Jal Wing, Indira Paryavaran Bhavan, Jor Bagh New Delhi",
    "phone": "01120819284",
    "email": "debabrata.d13@nic.in",
    "rawEmail": "debabrata.d13[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Ex Servicemen Welfare",
    "name": "Brig IP Singh",
    "designation": "Brig ESW",
    "address": "6th Floor, Kartavya Bhavan-2, New Delhi",
    "phone": "01124014705",
    "email": "ds-pg@desw.gov.in",
    "rawEmail": "ds-pg[at]desw.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Expenditure",
    "name": "Shri Sunil Kumar",
    "designation": "Deputy Secretary",
    "address": "Room No. 48E, North Block, New Delhi",
    "phone": "01123095705",
    "email": "sunilkumar0970@nic.in",
    "rawEmail": "sunilkumar0970[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "External Affairs",
    "name": "Ms. Esha Srivastava",
    "designation": "Joint Secretary",
    "address": "CPV Division, Patiala House Annexe, Tilak Marg, New Delhi",
    "phone": "01123384529",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Fertilizers",
    "name": "Mohan Lal Meena",
    "designation": "DS  Coordination",
    "address": "Shastri Bhawan, New Delhi",
    "phone": "01123388064",
    "email": "mohanlal.meena70@nic.in",
    "rawEmail": "mohanlal.meena70[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Financial Services (Banking Division)",
    "name": "SHRI SWAPNIL AGRAWAL",
    "designation": "DIRECTOR",
    "address": "3RD Floor, Jeevan Deep Building Building, Sansad Marg New Delhi",
    "phone": "01123346785",
    "email": "dir.sa-dfs@gov.in",
    "rawEmail": "dir.sa-dfs[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Financial Services (Insurance Division)",
    "name": "Sh SWAPNIL AGRAWAL",
    "designation": "DIRECTOR",
    "address": "3RD Floor,Jeevan Deep Building Building, Sansad Marg New Delhi",
    "phone": "01123346785",
    "email": "dir.sa-dfs@gov.in",
    "rawEmail": "dir.sa-dfs[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Financial Services (Pension Reforms)",
    "name": "Shri. Swapnil Agrawal",
    "designation": "Director",
    "address": "3rd Floor, Jeevandeep Building New Delhi",
    "phone": "01123748786",
    "email": "dir.sa-dfs@gov.in",
    "rawEmail": "dir.sa-dfs[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Fisheries",
    "name": "Pumzalal Pulamte",
    "designation": "Deputy Secretary",
    "address": "First floor Chanderlok Building, Janpath New Delhi",
    "phone": "01123710006",
    "email": "p.pulamte@nic.in",
    "rawEmail": "p.pulamte[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Food and Public Distribution",
    "name": "Ms. Nandita Mishra",
    "designation": "Senior  Economic Adviser",
    "address": "Room No. 194 Krishi Bhavan New Delhi",
    "phone": "01123070371",
    "email": "nandita.mishra@nic.in",
    "rawEmail": "nandita.mishra[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Food Processing Industries",
    "name": "Shri. Preetpal Singh",
    "designation": "Joint Secretary",
    "address": "Panchsheel Bhawan, August Kranti Marg, New Delhi",
    "phone": "01126492476",
    "email": "preetpal.singh@nic.in",
    "rawEmail": "preetpal.singh[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Health & Family Welfare",
    "name": "Ashok Kumar Gupta",
    "designation": "Director",
    "address": "Room No. 110050",
    "phone": "01124013421",
    "email": "ashok.kgupta@nic.in",
    "rawEmail": "ashok.kgupta[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Health Research",
    "name": "Shri Pradyumn Kumar",
    "designation": "Under Secretary",
    "address": "Room No. Indian Red Cross Society Building, 1, Red Cross Road, NEW DELHI",
    "phone": "01123736218",
    "email": "pradyumn.kumar@nic.in",
    "rawEmail": "pradyumn.kumar[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Heavy Industry",
    "name": "Brijesh Kumar",
    "designation": "Joint Director",
    "address": "GPOA-3, R. No. 2519, Neta ji Nagar, New Delhi",
    "phone": "01126112329",
    "email": "jd.pg.mhi@gov.in",
    "rawEmail": "jd.pg.mhi[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Higher Education",
    "name": "Dharmendra Kr Himanshu",
    "designation": "DS",
    "address": "Room No. 6,West Block 1,wing 6, R K Puram, 2nd Flo or,D/o Higher Education,Ministry of Education, New Delhi",
    "phone": "01123384721",
    "email": "dk.himanshu@nic.in",
    "rawEmail": "dk.himanshu[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Home Affairs",
    "name": "DS Coord",
    "designation": "DS coord",
    "address": "5th Floor, Media Wing, NDCC - II Building New Delhi",
    "phone": "01123438002",
    "email": "dircoord-mha@nic.in",
    "rawEmail": "dircoord-mha[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Housing and Urban Affairs",
    "name": "Sh. SHANKAR PRASAD CHOUDHARY",
    "designation": "DEPUTY SECRETARY",
    "address": "Room No. 0816, 8th Floor, Sankalp Bhawan",
    "phone": "01123783000",
    "email": "shankar.pc@nic.in",
    "rawEmail": "shankar.pc[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Information and Broadcasting",
    "name": "Suresh Kumar Meena",
    "designation": "Deputy Secretary",
    "address": "Room No. 22067, Kartavya Bhawan 2, New Delhi",
    "phone": "01124015833",
    "email": "suresh.kumar150873@gov.in",
    "rawEmail": "suresh.kumar150873[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Investment & Public Asset Management",
    "name": "Shri Sudhir Shyam",
    "designation": "Economic Adviser",
    "address": "Room No. 520, 5th Floor Block No.14 CGO Complex, Lodhi Road New Delhi",
    "phone": "01124368037",
    "email": "sudhir.s@nic.in",
    "rawEmail": "sudhir.s[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Justice",
    "name": "G MUthuraja",
    "designation": "JS",
    "address": "Jaisalmer House, Mansingh Road, New Delhi",
    "phone": "01123070673",
    "email": "drj1-doj@gov.in",
    "rawEmail": "drj1-doj[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Labour and Employment",
    "name": "Shri G. Sajith Kumar",
    "designation": "Deputy Secretary and Nodal PGO",
    "address": "Room No. 505, Fifth Floor, Shram Shakti Bhavan, Rafi Marg, New Delhi.",
    "phone": "01123719054",
    "email": "sajith.edu@nic.in",
    "rawEmail": "sajith.edu[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Land Resources",
    "name": "Vivek Narayan",
    "designation": "Deputy Secretary",
    "address": "Work Hall No.32007, 2nd Floor, Kartavya Bhawan-3, New Delhi-110001",
    "phone": "01124011524",
    "email": "vivek.narayan14@nic.in",
    "rawEmail": "vivek.narayan14[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Legal Affairs",
    "name": "Devanshu Kumar",
    "designation": "Public Grievance Officer",
    "address": "4th Floor, A-Wing, Shastri Bhawan, Dr. Rajendra Prasad Rd. New Delhi",
    "phone": "01123383634",
    "email": "pgcell.dla@gov.in",
    "rawEmail": "pgcell.dla[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Legislative Department",
    "name": "Rajesh Kumar",
    "designation": "Deputy Secretary",
    "address": "Room No.24050, 4th Floor, Kartavya Bhavan-2, New Delhi",
    "phone": "01124016043",
    "email": "admin1ld@nic.in",
    "rawEmail": "admin1ld[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Micro Small and Medium Enterprises",
    "name": "Md. Salik Parwaiz",
    "designation": "Director",
    "address": "32063, Kartavya Bhavan 3, 2nd Floor, New Delhi",
    "phone": "01124011292",
    "email": "salik.parwaiz@nic.in",
    "rawEmail": "salik.parwaiz[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Military Affairs",
    "name": "Parag Kabat",
    "designation": "Director Coord",
    "address": "Room No 143 Sena Bhawan New Delhi",
    "phone": "01123013416",
    "email": "dircoord.ec-dma@gov.in",
    "rawEmail": "dircoord.ec-dma[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Mines",
    "name": "Shri Rajesh Kumar Ner",
    "designation": "Section Officer - PG&PI",
    "address": "Zone 3, 4th Floor, GPOA-3 Building, Netaji Nagar, New Delhi",
    "phone": "01126773646",
    "email": "pgpi-mom@gov.in",
    "rawEmail": "pgpi-mom[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Minority Affairs",
    "name": "Shri T.K. Das",
    "designation": "Deputy Secretary",
    "address": "Pt. Deendayal Antyodaya Bhawan, 11th Floor,CGO Complex, Lodhi Road, New Delhi",
    "phone": "01124364277",
    "email": "dsrti-mma@gov.in",
    "rawEmail": "dsrti-mma[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "New and Renewable Energy",
    "name": "Mr. M. Mukherjee",
    "designation": "Director",
    "address": "Room No. 309, Atal Akshaya Urja Bhavan, Opp. CGO Complex, Lodi Road, N Delhi",
    "phone": "01124303164",
    "email": "m.mukerjee@gov.in",
    "rawEmail": "m.mukerjee[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "NITI Aayog",
    "name": "VINOD KUMAR",
    "designation": "DS",
    "address": "Room No. 404, NITI Aayog, Sansad Marg, New Delhi",
    "phone": "01123042475",
    "email": "vinod.kumar@nic.in",
    "rawEmail": "vinod.kumar[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "O/o the Comptroller & Auditor General of India",
    "name": "Sumeet Kumar",
    "designation": "Assistant Comptroller and Auditor General",
    "address": "9, Deen Dayal Upadhayaya Marg, New Delhi",
    "phone": "01123509303",
    "email": "acn@cag.gov.in",
    "rawEmail": "acn[at]cag.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Official Language",
    "name": "Satinder Kaur",
    "designation": "Deputy Secretary",
    "address": "NDCC-II Bhawan, Jai Singh Road New Delhi",
    "phone": "01123438155",
    "email": "s.kaur68@nic.in",
    "rawEmail": "s.kaur68[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Panchayati Raj",
    "name": "Shri Prashant Kumar",
    "designation": "Under Secretary",
    "address": "Ministry of Panchayati Raj, Tower II, 9th Floor, Jeevan Bharti Building, New Delhi",
    "phone": "01123725314",
    "email": "prashant.rth@nic.in",
    "rawEmail": "prashant.rth[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Parliamentary Affairs",
    "name": "S. S. Patra",
    "designation": "Deputy Secretary",
    "address": "S-59, Parliament House, New Delhi",
    "phone": "01123083876",
    "email": "ss.patra@nic.in",
    "rawEmail": "ss.patra[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Pensions and Pensioners Welfare",
    "name": "Sanjay Bharti",
    "designation": "Under Secretary CPENGRAMS",
    "address": "3rd Floor, Lok Nayak Bhawan, Khan Market",
    "phone": "01124644632",
    "email": "sanjay.bharti84@gov.in",
    "rawEmail": "sanjay.bharti84[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Personnel and Training",
    "name": "Dilip Kumar Jha",
    "designation": "Deputy Secretary",
    "address": "31010 , DOPT, Kartavya Bhavan - 03, New Delhi",
    "phone": "01124010499",
    "email": "dk.jha@nic.in",
    "rawEmail": "dk.jha[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Petroleum and Natural Gas",
    "name": "Shri Aditya Shekhar Singh",
    "designation": "Deputy Secretary",
    "address": "Room No. FF 31112 Kartavya Bhawan 3 New Delhi",
    "phone": "01124011194",
    "email": "aditya.singh@nic.in",
    "rawEmail": "aditya.singh[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Pharmaceutical",
    "name": "Vijay Kumar Srivastava",
    "designation": "Director",
    "address": "Janpath Bhawan",
    "phone": "01123327718",
    "email": "vijayk.srivastava25@nic.in",
    "rawEmail": "vijayk.srivastava25[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Posts",
    "name": "Shri Rupesh Pal",
    "designation": "ADG PG",
    "address": "Room No. 236H1, Dak Bhavan, Parliament Street New Delhi",
    "phone": "01123096087",
    "email": "ddgpgq@indiapost.gov.in",
    "rawEmail": "ddgpgq[at]indiapost.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Power",
    "name": "Amarjit Singh",
    "designation": "Director - Public Grievance and RTI",
    "address": "2nd Floor, F Wing, Nirman Bhawan, Maulana Azad Rd, Rajpath Area, New Delhi",
    "phone": "011230633454",
    "email": "singh.amarjit@gov.in",
    "rawEmail": "singh.amarjit[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Promotion of Industry and Internal Trade",
    "name": "DALIP KUMAR CHAWLA",
    "designation": "Deputy Secretary",
    "address": "Room No. 226, ,Department for Promotion of Industry and Internal Trade, Udyog Bhavan, New Delhi",
    "phone": "01123062947",
    "email": "dalip.chawla@gov.in",
    "rawEmail": "dalip.chawla[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Public Enterprises",
    "name": "Muni Ram Meena",
    "designation": "Director",
    "address": "Room No. 422, Block No. 14, Public Enterprises Bhawan, CGO Complex, Lodhi Road, New Delhi",
    "phone": "01124362770",
    "email": "munirammeena@ord.gov.in",
    "rawEmail": "munirammeena[at]ord.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Railways, ( Railway Board)",
    "name": "RATNESH KUMAR JHA",
    "designation": "EXECUTIVE DIRECTOR PG",
    "address": "ROOM NO. 509 RAIL BHAVAN RAISINA ROAD NEW DELHI",
    "phone": "01123386203",
    "email": "edpg@rb.railnet.gov.in",
    "rawEmail": "edpg[at]rb.railnet.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Revenue",
    "name": "Shri Manu J Vattickan",
    "designation": "Director Coord",
    "address": "Kartavya bhawan 1, C wing",
    "phone": "01124012460",
    "email": "dir-coord-dor@gov.in",
    "rawEmail": "dir-coord-dor[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Road Transport and Highways",
    "name": "Shri Lalit Kumar",
    "designation": "Director",
    "address": "Room No. 239,Transport Bhawan, Sansad Marg New Delhi",
    "phone": "01123710211",
    "email": "lalit.kr@nic.in",
    "rawEmail": "lalit.kr[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Rural Development",
    "name": "Shri Prabhat Kumar",
    "designation": "Deputy Secretary",
    "address": "Inadia Habitat Centre Core 5A, 2nd Floor, New Delhi",
    "phone": "01124360565",
    "email": "prabhat.kmr@nic.in",
    "rawEmail": "prabhat.kmr[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "School Education and Literacy",
    "name": "Shri Subhankar Mishra",
    "designation": "Joint Director",
    "address": "Room No. 101-D Wing, Department of School Educatio n and Literacy, Ministry of Human Resource Develo pment,Shastri Bhawan New Delhi",
    "phone": "01123073542",
    "email": "mishra.edu@gov.in",
    "rawEmail": "mishra.edu[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Science and Technology",
    "name": "Sumona Bhattacharya",
    "designation": "Under Secretary PG",
    "address": "Department of Science and Technology, Technology Bhavan, New Mehrauli Road, New Delhi",
    "phone": "01126590462",
    "email": "sumona.bhattacharya@gov.in",
    "rawEmail": "sumona.bhattacharya[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Scientific & Industrial Research",
    "name": "Sh. Sanjeev Jain",
    "designation": "Deputy Secretary",
    "address": "Technology Bhawan, New Mehrauli Road, New Delhi",
    "phone": "01126962185",
    "email": "sanjeev.jain@nic.in",
    "rawEmail": "sanjeev.jain[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Shipping",
    "name": "Sh. Mrityunjay Jha",
    "designation": "Director",
    "address": "Room No. 545,Parivahan Bhavan, 1, Sansad Marg New Delhi",
    "phone": "01123313948",
    "email": "mrityunjay.jha@nic.in",
    "rawEmail": "mrityunjay.jha[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Skill Development and Entrepreneurship",
    "name": "Shri Khamchin Naulak",
    "designation": "Deputy Secretary",
    "address": "2nd Floor, Kaushal Bhawan, New Moti Bagh, New Delhi",
    "phone": "01123465915",
    "email": "k.naulak@nic.in",
    "rawEmail": "k.naulak[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Social Justice and Empowerment",
    "name": "Shri Awdhesh Kumar Mehta",
    "designation": "Deputy Secretary",
    "address": "Pt. Deendayal Antyodaya Bhawan, CGO Complex, New Delhi.",
    "phone": "01124369837",
    "email": "ds-stats-dosje@gov.in",
    "rawEmail": "ds-stats-dosje[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Space",
    "name": "Padma Jyothi S",
    "designation": "Deputy Secretary",
    "address": "Antariksh Bhavan, New B.E.L. Road, Bengaluru",
    "phone": "08022172402",
    "email": "pgdos@isro.gov.in",
    "rawEmail": "pgdos[at]isro.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Sports",
    "name": "K.M. Harilal",
    "designation": "Director",
    "address": "Room No. 7403, 7th Floor, GPOA-03, Netaji Nagar, New Delhi - 110023",
    "phone": "01123385101",
    "email": "km.harilal@nic.in",
    "rawEmail": "km.harilal[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Staff Selection Commission",
    "name": "Shri Varinder Singh",
    "designation": "Deputy Secretary",
    "address": "Staff Selection Commission, Block No. 12, CGO Complex, Lodhi Road, New Delhi-110003 i",
    "phone": "01124364795",
    "email": "vsingh.71@gov.in",
    "rawEmail": "vsingh.71[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Statistics and Programme Implementation",
    "name": "Shri Mahesh Chand Beniwal",
    "designation": "Deputy Secretary",
    "address": "Room No. 13, Khurshid Lal Bhawan, Ministry of Stat istics and Programme Implementaion,Janpath, New De lhi",
    "phone": "01123455750",
    "email": "mc.beniwal@gov.in",
    "rawEmail": "mc.beniwal[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Steel",
    "name": "Ms.  Gurpreet Gadhok",
    "designation": "Director",
    "address": "Room No. 63, Udyog Bhavan, New Delhi",
    "phone": "01123063355",
    "email": "gurpreet.gadhok@nic.in",
    "rawEmail": "gurpreet.gadhok[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Telecommunications",
    "name": "Sh. B M Patel",
    "designation": "Director MOC PG",
    "address": "Room No.605, 6th Floor Mahanagar Doorsanchar Bhawa n Near Zakir Hussain College Old Minto Road New De lhi",
    "phone": "01123220537",
    "email": "dirpg.hq-dot@gov.in",
    "rawEmail": "dirpg.hq-dot[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Textiles",
    "name": "Shri Rajeev Ranjan Kumar",
    "designation": "Director",
    "address": "Udyog Bhavan, New Delhi",
    "phone": "01123061142",
    "email": "rajeevkumar.dad@gov.in",
    "rawEmail": "rajeevkumar.dad[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Tourism",
    "name": "B.H.T. Vaiphei",
    "designation": "Under Secretary",
    "address": "Transport Bhawan, 1, Sansad Marg, New Delhi, Delhi",
    "phone": "01123713521",
    "email": "bht.vaiphei@nic.in",
    "rawEmail": "bht.vaiphei[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Tribal Affairs",
    "name": "Randhir Kumar B. Patel",
    "designation": "Director",
    "address": "Ministry of Tribal Affairs, Jeewan Tara Building",
    "phone": "01123343303",
    "email": "randhir.patel@nic.in",
    "rawEmail": "randhir.patel[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Unique Identification Authority of India",
    "name": "Neeraj Kumar",
    "designation": "Director",
    "address": "Unique Identification Authority of India, HQ 6th F loor, Bangla Sahib Road Behind Kali Mandir, New De lhi",
    "phone": "01123478453",
    "email": "dir.crm-hq@uidai.net.in",
    "rawEmail": "dir.crm-hq[at]uidai.net[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Water Resources, River Development & Ganga Rejuvenuation,",
    "name": "Sankha Roy",
    "designation": "Director Coord",
    "address": "Room No 210 Ground Floor Shastri Bhawan New Delhi",
    "phone": "01123382448",
    "email": "dsea-mowr@nic.in",
    "rawEmail": "dsea-mowr[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Women and Child Development",
    "name": "Shri Aujender Singh",
    "designation": "Director",
    "address": "Room No. 641-A, 6th Floor, A Wing, Shastri Bhawan, New Delhi",
    "phone": "01123380547",
    "email": "aujender.singh@nic.in",
    "rawEmail": "aujender.singh[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Youth Affairs",
    "name": "Madhavi Mohan",
    "designation": "Deputy Secretary",
    "address": "Room No. 6107, 6th Floor, Zone-1 GPOA-3 Netaji Nagar, Bhikaji Cama Place, New Delhi",
    "phone": "01124113206",
    "email": "manoj.manu@nic.in",
    "rawEmail": "manoj.manu[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficers",
    "sourceType": "CENTRAL",
    "verifiedAt": "2026-08-26"
  }
];

export const CPGRAMS_STATE_NODAL_OFFICERS: NodalGrievanceOfficer[] = [
  {
    "organisation": "Andhra Pradesh",
    "name": "Chinna Rao",
    "designation": "CGO-CMO",
    "address": "Public Grievance Redressal Cell, CMO Block-01, Gro und Floor, A.P. State Secretariat, Velagapudi, Ama ravathi",
    "phone": "09154267973",
    "email": "pgrs-helpdesk@ap.gov.in",
    "rawEmail": "pgrs-helpdesk[at]ap.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Arunachal Pradesh",
    "name": "Shri Mari Angu",
    "designation": "Joint Secretary",
    "address": "Civil Secretariat Block No. 04, Floor No. 05, Room No.08, Itanagar",
    "phone": "03602222222",
    "email": "mari.angu@gov.in",
    "rawEmail": "mari.angu[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Assam",
    "name": "Shri Utpal Borah ACS",
    "designation": "State Nodal Officer",
    "address": "Joint Secretary to the Govt. of Assam, Administrat ive Reforms, Training, Pension and Public Grievanc es Department, Assam Secretariat",
    "phone": "03612237323",
    "email": "artassamdept@gmail.com",
    "rawEmail": "artassamdept[at]gmail[dot]com",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Bihar",
    "name": "Miss Vineeta",
    "designation": "DS",
    "address": "General Administration Department, Patna",
    "phone": "06122215409",
    "email": "publicgrievances-bih@gov.in",
    "rawEmail": "publicgrievances-bih[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Chattisgarh",
    "name": "Shri HEMANT KUMAR PANDEY",
    "designation": "UNDER SECRETARY",
    "address": "Public Grievance Redressal Department, Mantralaya Mahanadi Bhavan Nava Raipur Atal nagar",
    "phone": "07712510974",
    "email": "pgc-gad.cg@gov.in",
    "rawEmail": "pgc-gad.cg[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Goa",
    "name": "DIksha N Tari",
    "designation": "Under Secretary PG",
    "address": "2nd Floor, Secretariat, Porvorim Goa",
    "phone": "08322419864",
    "email": "us-pgc.goa@nic.in",
    "rawEmail": "us-pgc.goa[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Gujarat",
    "name": "Shri Hareet Shukla",
    "designation": "Principal Secretary",
    "address": "General Administration Department Block No. 7/3, 3rd Floor, Sachivalaya, Gandhi Nagar",
    "phone": "07923255969",
    "email": "secartd@gujarat.gov.in",
    "rawEmail": "secartd[at]gujarat.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Haryana",
    "name": "VACANT",
    "designation": "Nodal Officer CPGRAMS",
    "address": "Chandigarh",
    "phone": "01722740226",
    "email": "supdt.cpgrams22@gmail.com",
    "rawEmail": "supdt.cpgrams22[at]gmail[dot]com",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Himachal Pradesh",
    "name": "Shainamol A",
    "designation": "Secretary - AR RPG Training and FA Ayush",
    "address": "Secretary RPG to the Govt. of HP. Shimla-2.",
    "phone": "01772620560",
    "email": "rpgsecy-hp@nic.in",
    "rawEmail": "rpgsecy-hp[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Jharkhand",
    "name": "Md. Asif Hassan",
    "designation": "Joint Secretary",
    "address": "Personnel, Administrative Reforms and Rajhbhasha Department, Jharkhand, Ranchi",
    "phone": "18003456568",
    "email": "pgportal.jhr@gmail.com",
    "rawEmail": "pgportal.jhr[at]gmail[dot]com",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Karnataka",
    "name": "Suma.S",
    "designation": "Under Secretary",
    "address": "Room 211, 2nd Floor, 3rd Gate, M S Building, Beng aluru, G RIEVANCE STATUS LINK https ipgrs.karnataka.gov.in",
    "phone": "08022032214",
    "email": "us2dpar-js@karnataka.gov.in",
    "rawEmail": "us2dpar-js[at]karnataka.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Kerala",
    "name": "Sajid M",
    "designation": "Under Secretary",
    "address": "Chief Minister s Computer Cell, 4th Floor, North Block, Government Secretariat, Thiruvananthapura m, Kerala",
    "phone": "04712703002",
    "email": "priority.cmo@kerala.gov.in",
    "rawEmail": "priority.cmo[at]kerala.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Madhya Pradesh",
    "name": "Sandeep Asthana",
    "designation": "Director CM Helpline",
    "address": "CM Helpline Office, Bhopal, M.P.",
    "phone": "07556680020",
    "email": "cmhelpline@mp.gov.in",
    "rawEmail": "cmhelpline[at]mp.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Maharashtra",
    "name": "Mr.Hemant Anant Mahajan",
    "designation": "Deputy Secretary",
    "address": "General Administration Department ,3rd Floor, Mantralaya Mail Building, Mantralaya, Mumbai",
    "phone": "02222025101",
    "email": "hemant.mahajan@nic.in",
    "rawEmail": "hemant.mahajan[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Manipur",
    "name": "K.H. Leiyaphy Rita",
    "designation": "Joint Secretary AR",
    "address": "Old Sectt., North Block, Imphal",
    "phone": "119402882539",
    "email": "leiyaphi.kh@gov.in",
    "rawEmail": "leiyaphi.kh[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Meghalaya",
    "name": "Shri Cyril Diengdoh IAS",
    "designation": "Commissioner and Secretary Personnel and A.R.",
    "address": "Meghalaya Civil Sectt, Room 403, Additional Building, Shillong, Meghalaya",
    "phone": "03642500165",
    "email": "cyril.diengdoh@gov.in",
    "rawEmail": "cyril.diengdoh[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Mizoram",
    "name": "Isaac C. Lalrempuia",
    "designation": "Nodal Officer Deptt. of Personnel and Administrative Reforms Good Governance Cell",
    "address": "Mizoram Secretariat, MINECO, Aizawl",
    "phone": "03892335713",
    "email": "ggcmiz@gmail.com",
    "rawEmail": "ggcmiz[at]gmail[dot]com",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Nagaland",
    "name": "Shri Vechovo Tetseo",
    "designation": "Senior Research Officer  and State Nodal Officer",
    "address": "Nagaland Civil Secretariat, Kohima Kohima",
    "phone": "03700000000",
    "email": "vechovo.tetseo@nic.in",
    "rawEmail": "vechovo.tetseo[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "NCT of Delhi",
    "name": "Sh. Upender",
    "designation": "Section Officer",
    "address": "Public Grievances CommissionM Block Vikas Bhawan I P EstateNew Delhi",
    "phone": "01123379900",
    "email": "paditi@gmail.com",
    "rawEmail": "paditi[at]gmail[dot]com",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Odisha",
    "name": "Deputy Secretary",
    "designation": "Deputy Secretary to Government",
    "address": "General Administration and Public Grievance Deptt., Odisha Sectt., Bhubaneshwar",
    "phone": "06742395760",
    "email": "gapgpublicgrievance@gmail.com",
    "rawEmail": "gapgpublicgrievance[at]gmail[dot]com",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Punjab",
    "name": "IAS",
    "designation": "Additional Chief Secretary",
    "address": "Removal Of Grievances Punjab Civil Sectt-1",
    "phone": "01722740611",
    "email": "grievanceredressal2@gmail.com",
    "rawEmail": "grievanceredressal2[at]gmail[dot]com",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Rajasthan",
    "name": "Mr Jagdish Lal Meena",
    "designation": "Deputy Secretary",
    "address": "Room No. 8129, 1st floor, North Western Building, Secretariat Jaipur",
    "phone": "01412922825",
    "email": "DS.RPG@RAJASTHAN.GOV.IN",
    "rawEmail": "DS.RPG[at]RAJASTHAN.GOV[dot]IN",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Sikkim",
    "name": "Shri. Santosh Pradhan",
    "designation": "Joint Secretary",
    "address": "Department of Personnel, Tashiling, Secretariat",
    "phone": "035922000000",
    "email": "gos.dopart@gmail.com",
    "rawEmail": "gos.dopart[at]gmail[dot]com",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Tamil Nadu",
    "name": "T. Jeya Sheela B.E MBA",
    "designation": "Special Officer",
    "address": "Chief Ministers Special Cell, Fort St. George, Secretariat Chennai",
    "phone": "04425671012",
    "email": "cmcell@tn.gov.in",
    "rawEmail": "cmcell[at]tn.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Telangana",
    "name": "J.ARUN KUMAR",
    "designation": "Additional Secretary to GAD",
    "address": "Dr. B.R. Ambedkar Telangana Secretariat",
    "phone": "04023452888",
    "email": "dysecy-pgr-gad@telangana.gov.in",
    "rawEmail": "dysecy-pgr-gad[at]telangana.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Tripura",
    "name": "Smt. Debjani Deb TCS Gr-I",
    "designation": "Joint Secretary to the Govt. of Tripura",
    "address": "GAAR Department, Secretariat, New Capital Complex, Kunjaban, Agartala.",
    "phone": "03812416040",
    "email": "gaar.agt-tr@nic.in",
    "rawEmail": "gaar.agt-tr[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Union Territory of Andaman & Nicobar",
    "name": "Smti. B Ganga Ratnam",
    "designation": "Assistant Secretary of A.R. Wing and Public Grievances",
    "address": "Public Grievance Cell A and N Administration, Secretariat, Sri Vijaya Puram",
    "phone": "03192232803",
    "email": "asar-trg@and.nic.in",
    "rawEmail": "asar-trg[at]and.nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Union Territory of Chandigarh",
    "name": "Amit Kumar DANICS",
    "designation": "Additional Secretary Home",
    "address": "Union Territory Secretariat, Deluxe Building, Sector-9 Chandigarh",
    "phone": "01722994524",
    "email": "ashome-chd@chd.gov.in",
    "rawEmail": "ashome-chd[at]chd.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Union Territory of Dadra & Nagar Haveli",
    "name": "Dr. Sunabh Singh",
    "designation": "Deputy Director-cum-Deputy Secretary",
    "address": "Department of Public Grievances, Secretariat, Vidyut Bhawan, Kachigam, Nani Daman",
    "phone": "02602230460",
    "email": "dshome-dd@ddd.gov.in",
    "rawEmail": "dshome-dd[at]ddd.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Union Territory of Daman & Diu",
    "name": "Dr. Sunabh Singh",
    "designation": "Deputy Director-cum-Deputy Secretary",
    "address": "Department of Public Grievances, Secretariat, Vidyut Bhawan, Kachigam, Nani Daman",
    "phone": "02602230460",
    "email": "dshome-dd@ddd.gov.in",
    "rawEmail": "dshome-dd[at]ddd.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Union Territory of Jammu and Kashmir",
    "name": "Azeeta Qureshi",
    "designation": "Under Secretary",
    "address": "H 8 Church Lane, Sonwar Srinagar",
    "phone": "01942483236",
    "email": "qureshi.azee@jk.gov.in",
    "rawEmail": "qureshi.azee[at]jk.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Union Territory of Ladakh",
    "name": "Dorjay Gailson JKAS",
    "designation": "Nodal Officer for CPGRMS",
    "address": "UT Secretariat Ladakh",
    "phone": "01982257561",
    "email": "gad.utladakh@ladakh.gov.in",
    "rawEmail": "gad.utladakh[at]ladakh.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Union Territory of Lakshadweep",
    "name": "Mukund Vallabh Joshi DANICS",
    "designation": "Director",
    "address": "Department of Planning, Statistics and TaxationSecretariat, UT of Lakshadweep,Kavaratti, Island",
    "phone": "04896262274",
    "email": "lak-adps@nic.in",
    "rawEmail": "lak-adps[at]nic[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Union Territory of Puducherry",
    "name": "Sivakumar S",
    "designation": "Under Secretary ARW",
    "address": "AR Wing,B Block, 2nd Floor, Chief Sectt., Goubert Avenue, Beach Road,Puducherry",
    "phone": "04132233361",
    "email": "usar@py.gov.in",
    "rawEmail": "usar[at]py.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Uttar Pradesh",
    "name": "Shri Bhaskar Chandra Kandpal",
    "designation": "Joint Secretary",
    "address": "Chief Minister Secretariat , Room No. 321, U.P. Secretariat, Lucknow",
    "phone": "05222226350",
    "email": "bhaskar.31532@gov.in",
    "rawEmail": "bhaskar.31532[at]gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "Uttarakhand",
    "name": "Tirath Pal Singh",
    "designation": "Additional Director",
    "address": "IT Park, Dehradun",
    "phone": "01352609532",
    "email": "cm_helpline@uk.gov.in",
    "rawEmail": "cm_helpline[at]uk.gov[dot]in",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  },
  {
    "organisation": "West Bengal",
    "name": "Shri Ajay Kumar Pal",
    "designation": "Special Secreta",
    "address": "Nabanna (7th Floor), 325, Sarat Chatterjee Road, Shibpur, Howrah - 711102",
    "phone": "03322143655",
    "email": "jointsecretarypar@gmail.com",
    "rawEmail": "jointsecretarypar[at]gmail[dot]com",
    "sourceUrl": "https://pgportal.gov.in/Home/NodalPgOfficersState",
    "sourceType": "STATE_UT",
    "verifiedAt": "2026-08-26"
  }
];

/**
 * Normalizes organisation strings for robust case-insensitive, punctuation-resilient matching.
 */
export function normalizeOrgName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[(),.-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Known mapping of aliases and alternative routing entity names to official CPGRAMS directory names.
 */
const KNOWN_CENTRAL_ALIASES: Record<string, string> = {
  'department of agriculture and farmers welfare': 'Agriculture and Farmers Welfare',
  'agriculture and farmers welfare': 'Agriculture and Farmers Welfare',
  'railway board': 'Railways, ( Railway Board)',
  'railways': 'Railways, ( Railway Board)',
  'indian railways': 'Railways, ( Railway Board)',
  'ministry of railways': 'Railways, ( Railway Board)',
  'central board of indirect taxes and customs': 'Central Board of Excise and Customs',
  'cbic': 'Central Board of Excise and Customs',
  'cbdt': 'Central Board of Direct Taxes (Income Tax)',
  'income tax': 'Central Board of Direct Taxes (Income Tax)',
  'direct taxes': 'Central Board of Direct Taxes (Income Tax)',
  'ministry of power': 'Power',
  'power & energy distribution': 'Power',
  'ministry of external affairs': 'External Affairs',
  'external affairs': 'External Affairs',
  'ministry of road transport and highways': 'Road Transport and Highways',
  'road transport and highways': 'Road Transport and Highways',
  'financial services': 'Financial Services (Banking Division)',
  'department of financial services': 'Financial Services (Banking Division)',
  'financial services banking division': 'Financial Services (Banking Division)',
  'labour and employment': 'Labour and Employment',
  'ministry of labour and employment': 'Labour and Employment',
  'epfo': 'Labour and Employment',
  'provident fund': 'Labour and Employment',
  'health and family welfare': 'Health & Family Welfare',
  'health & family welfare': 'Health & Family Welfare',
  'ministry of health and family welfare': 'Health & Family Welfare',
  'higher education': 'Higher Education',
  'department of higher education': 'Higher Education',
  'school education and literacy': 'School Education and Literacy',
  'department of school education and literacy': 'School Education and Literacy',
  'ayush': 'Ayush',
  'ministry of ayush': 'Ayush',
  'housing and urban affairs': 'Housing and Urban Affairs',
  'ministry of housing and urban affairs': 'Housing and Urban Affairs',
  'consumer affairs': 'Consumer Affairs',
  'department of consumer affairs': 'Consumer Affairs',
  'unique identification authority of india': 'Unique Identification Authority of India',
  'uidai': 'Unique Identification Authority of India',
  'electronics and information technology': 'Electronics & Information Technology',
  'electronics & information technology': 'Electronics & Information Technology',
  'meity': 'Electronics & Information Technology',
  'posts': 'Posts',
  'department of posts': 'Posts',
  'india post': 'Posts',
  'telecommunications': 'Telecommunications',
  'department of telecommunications': 'Telecommunications',
  'telecom': 'Telecommunications',
  'petroleum and natural gas': 'Petroleum and Natural Gas',
  'ministry of petroleum and natural gas': 'Petroleum and Natural Gas',
  'drinking water and sanitation': 'Drinking Water and Sanitation',
  'environment forest and climate change': 'Environment, Forest and Climate Change',
  'rural development': 'Rural Development',
  'ministry of rural development': 'Rural Development',
  'personnel and training': 'Personnel and Training',
  'pensions and pensioners welfare': 'Pensions and Pensioners Welfare',
  'administrative reforms and public grievances': 'Administrative Reforms and Public Grievances - PG Division',
  'darpg': 'Administrative Reforms and Public Grievances - PG Division',
};

const KNOWN_STATE_ALIASES: Record<string, string> = {
  'andhra pradesh': 'Andhra Pradesh',
  'ap': 'Andhra Pradesh',
  'kurnool': 'Andhra Pradesh',
  'visakhapatnam': 'Andhra Pradesh',
  'vijayawada': 'Andhra Pradesh',
  'maharashtra': 'Maharashtra',
  'pune': 'Maharashtra',
  'pimpri chinchwad': 'Maharashtra',
  'pcmc': 'Maharashtra',
  'mumbai': 'Maharashtra',
  'nagpur': 'Maharashtra',
  'delhi': 'NCT of Delhi',
  'nct of delhi': 'NCT of Delhi',
  'new delhi': 'NCT of Delhi',
  'karnataka': 'Karnataka',
  'bengaluru': 'Karnataka',
  'bangalore': 'Karnataka',
  'mysuru': 'Karnataka',
  'tamil nadu': 'Tamil Nadu',
  'chennai': 'Tamil Nadu',
  'coimbatore': 'Tamil Nadu',
  'madurai': 'Tamil Nadu',
  'telangana': 'Telangana',
  'hyderabad': 'Telangana',
  'uttar pradesh': 'Uttar Pradesh',
  'lucknow': 'Uttar Pradesh',
  'kanpur': 'Uttar Pradesh',
  'varanasi': 'Uttar Pradesh',
  'noida': 'Uttar Pradesh',
  'bihar': 'Bihar',
  'patna': 'Bihar',
  'rajasthan': 'Rajasthan',
  'jaipur': 'Rajasthan',
  'west bengal': 'West Bengal',
  'kolkata': 'West Bengal',
  'jammu and kashmir': 'Union Territory of Jammu and Kashmir',
  'j&k': 'Union Territory of Jammu and Kashmir',
  'ladakh': 'Union Territory of Ladakh',
  'chandigarh': 'Union Territory of Chandigarh',
  'puducherry': 'Union Territory of Puducherry',
  'pondicherry': 'Union Territory of Puducherry',
  'andaman and nicobar': 'Union Territory of Andaman & Nicobar',
  'chhattisgarh': 'Chattisgarh',
  'odisha': 'Odisha',
  'orissa': 'Odisha',
  'gujarat': 'Gujarat',
  'ahmedabad': 'Gujarat',
  'surat': 'Gujarat',
  'madhya pradesh': 'Madhya Pradesh',
  'bhopal': 'Madhya Pradesh',
  'indore': 'Madhya Pradesh',
  'kerala': 'Kerala',
  'punjab': 'Punjab',
  'haryana': 'Haryana',
  'gurugram': 'Haryana',
  'gurgaon': 'Haryana',
  'assam': 'Assam',
  'jharkhand': 'Jharkhand',
  'uttarakhand': 'Uttarakhand',
  'himachal pradesh': 'Himachal Pradesh',
  'goa': 'Goa',
  'manipur': 'Manipur',
  'meghalaya': 'Meghalaya',
  'mizoram': 'Mizoram',
  'nagaland': 'Nagaland',
  'sikkim': 'Sikkim',
  'tripura': 'Tripura',
  'arunachal pradesh': 'Arunachal Pradesh',
};

/**
 * Resolves verified CPGRAMS Nodal Public Grievance Officer details for an authority or state context.
 *
 * Matching Strategy:
 * 1. Null/empty safety -> returns unavailable.
 * 2. Exact match in Central directory.
 * 3. Normalized string match in Central directory.
 * 4. Known aliases / shortcodes in Central directory.
 * 5. State / Municipal routing resolution:
 *    - Extracts state from municipal description or context.
 *    - Matches state against State/UT directory.
 * 6. Graceful unavailable fallback for unmatched entities.
 */
export function findNodalOfficer(
  authorityOrOrg: string | null | undefined,
  context?: {
    jurisdictionLevel?: 'CENTRAL_MINISTRY' | 'STATE_GOVERNMENT' | 'LOCAL_MUNICIPAL' | 'GENERAL';
    queryText?: string;
    state?: string;
  }
): NodalOfficerMatchResult {
  const UNAVAILABLE_MSG = 'Official CPGRAMS nodal officer information not available for this authority.';

  if (!authorityOrOrg || typeof authorityOrOrg !== 'string' || authorityOrOrg.trim() === '') {
    return {
      officer: null,
      matchType: 'NONE',
      isAvailable: false,
      unavailableMessage: UNAVAILABLE_MSG,
    };
  }

  const raw = authorityOrOrg.trim();
  const normalized = normalizeOrgName(raw);

  // 1. Check Exact Central Organisation Match
  const exactCentral = CPGRAMS_CENTRAL_NODAL_OFFICERS.find(
    o => o.organisation.toLowerCase() === raw.toLowerCase()
  );
  if (exactCentral) {
    return {
      officer: exactCentral,
      matchType: 'EXACT',
      matchedOrganisation: exactCentral.organisation,
      isAvailable: true,
    };
  }

  // 2. Check Normalized Central Organisation Match
  const normCentral = CPGRAMS_CENTRAL_NODAL_OFFICERS.find(
    o => normalizeOrgName(o.organisation) === normalized
  );
  if (normCentral) {
    return {
      officer: normCentral,
      matchType: 'EXACT',
      matchedOrganisation: normCentral.organisation,
      isAvailable: true,
    };
  }

  // 3. Check Known Central Aliases
  if (KNOWN_CENTRAL_ALIASES[normalized]) {
    const targetOrg = KNOWN_CENTRAL_ALIASES[normalized];
    const aliasOfficer = CPGRAMS_CENTRAL_NODAL_OFFICERS.find(
      o => o.organisation.toLowerCase() === targetOrg.toLowerCase()
    );
    if (aliasOfficer) {
      return {
        officer: aliasOfficer,
        matchType: 'ALIAS',
        matchedOrganisation: aliasOfficer.organisation,
        isAvailable: true,
      };
    }
  }

  // Also check if any central alias key is a substring or keyword of the normalized string
  for (const [aliasKey, targetOrg] of Object.entries(KNOWN_CENTRAL_ALIASES)) {
    if (normalized === aliasKey || normalized.includes(aliasKey) || aliasKey.includes(normalized)) {
      const aliasOfficer = CPGRAMS_CENTRAL_NODAL_OFFICERS.find(
        o => o.organisation.toLowerCase() === targetOrg.toLowerCase()
      );
      if (aliasOfficer) {
        return {
          officer: aliasOfficer,
          matchType: 'ALIAS',
          matchedOrganisation: aliasOfficer.organisation,
          isAvailable: true,
        };
      }
    }
  }

  // 4. State / Local Municipal Resolution
  const isLocalOrState =
    context?.jurisdictionLevel === 'LOCAL_MUNICIPAL' ||
    context?.jurisdictionLevel === 'STATE_GOVERNMENT' ||
    /municipal|urban local body|ulb|panchayat|state/i.test(raw);

  if (isLocalOrState || context?.state) {
    // Attempt state extraction from authority string or context
    let detectedState: string | undefined = context?.state;

    if (!detectedState) {
      // Check for paren contents or comma contents, e.g. "Local Municipal Authority (Kurnool, Andhra Pradesh)"
      const parenMatch = raw.match(/\(([^)]+)\)/);
      const searchTarget = parenMatch ? parenMatch[1] : raw;
      
      for (const [key, stateName] of Object.entries(KNOWN_STATE_ALIASES)) {
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(searchTarget) || regex.test(raw) || (context?.queryText && regex.test(context.queryText))) {
          detectedState = stateName;
          break;
        }
      }
    }

    if (detectedState) {
      const stateOfficer = CPGRAMS_STATE_NODAL_OFFICERS.find(
        s => normalizeOrgName(s.organisation) === normalizeOrgName(detectedState!)
      );
      if (stateOfficer) {
        return {
          officer: stateOfficer,
          matchType: 'STATE_ESCALATION',
          matchedOrganisation: stateOfficer.organisation,
          isAvailable: true,
        };
      }
    }
  }

  // 5. Fallback Check on State Directory (for direct state names)
  const exactState = CPGRAMS_STATE_NODAL_OFFICERS.find(
    s => normalizeOrgName(s.organisation) === normalized
  );
  if (exactState) {
    return {
      officer: exactState,
      matchType: 'EXACT',
      matchedOrganisation: exactState.organisation,
      isAvailable: true,
    };
  }

  // 6. Graceful Unavailable State
  return {
    officer: null,
    matchType: 'NONE',
    isAvailable: false,
    unavailableMessage: UNAVAILABLE_MSG,
  };
}
