/**
 * Logistics Data for Emisco Investment Ltd
 * Contains mappings for Transport Companies, States, and Terminal Addresses.
 */

export const TRANSPORT_COMPANIES = [
  "Young Shall Grow (YSG) Transport",
  "ABC Transport",
  "God is Good Mobility (GIGM)",
  "Peace Mass Transit (PMT)",
  "GUO Transport"
];

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
  "Yobe", "Zamfara"
];

export const TERMINAL_ADDRESSES: Record<string, Record<string, string>> = {
  "Young Shall Grow (YSG) Transport": {
    "Abia": "Milverton Road, Aba",
    "Abuja": "Kubwa Park, Abuja",
    "FCT (Abuja)": "Kubwa Park, Abuja",
    "Akwa Ibom": "Abak Road, Uyo",
    "Anambra": "Upper Iweka, Onitsha",
    "Cross River": "Calabar Terminal",
    "Delta": "Asaba Terminal",
    "Edo": "Benin Terminal",
    "Enugu": "Enugu Terminal",
    "Imo": "Owerri Terminal",
    "Kaduna": "Kaduna Terminal",
    "Kano": "Kano Terminal",
    "Lagos": "Old Ojo Road, Maza Maza",
    "Plateau": "Jos Terminal",
    "Rivers": "96 Stadium Rd, Port Harcourt",
    "Adamawa": "Yola Jimeta Terminal",
    "Bauchi": "Bauchi T1, Bauchi",
    "Benue": "Makurdi T3, Makurdi",
    "Borno": "Maiduguri T1, Maiduguri",
    "Ebonyi": "Abakaliki T1, Ebonyi",
    "Kogi": "Lokoja T1, Lokoja",
    "Nasarawa": "Maraba T1, Maraba",
    "Niger": "Minna T1, Minna",
    "Ogun": "Sango Ota T1, Ogun",
    "Oyo": "Ibadan T1, Ibadan",
    "Sokoto": "Sokoto T1, Sokoto",
    "Yobe": "Damaturu T1, Yobe"
  },
  "ABC Transport": {
    "Abia": "2, Ikot Ekpene Road, Aba",
    "Abuja": "36 Ekukinam Street, Utako",
    "FCT (Abuja)": "36 Ekukinam Street, Utako",
    "Akwa Ibom": "Itam Park, Uyo",
    "Anambra": "Onitsha-Asaba Exp., Onitsha",
    "Cross River": "75, IBB Way, Calabar",
    "Delta": "194, PTI Road, Warri",
    "Edo": "INE Oil Ltd, Benin",
    "Enugu": "122, Ogui Road, Enugu",
    "Imo": "Plot 9 Egbu Road, Owerri",
    "Kaduna": "3, Kachia Road, Kaduna",
    "Kano": "1B, Church Road, Kano",
    "Lagos": "22, Ikorodu Road, Jibowu",
    "Plateau": "7/9, Luggard Road, Jos",
    "Rivers": "Eliozu Junction, PH",
    "Kogi": "178 Hammed Bello Way",
    "Nasarawa": "60 Jos Road, Akwanga",
    "Ogun": "Km 215 Lagos-Benin Exp",
    "Oyo": "New Ife Road, Ibadan"
  },
  "God is Good Mobility (GIGM)": {
    "Abia": "5, Asa Road, Aba",
    "Abuja": "Plot 113, Utako District",
    "FCT (Abuja)": "Plot 113, Utako District",
    "Akwa Ibom": "3, Monsignor Akpan Ave, Uyo",
    "Anambra": "Elite Complex, Awka",
    "Bayelsa": "Opp. Wema Bank, Yenagoa",
    "Delta": "Asaba-Onitsha Exp., Asaba",
    "Edo": "12, Akpakpava Road, Benin",
    "Enugu": "7, Market Road, Enugu",
    "Imo": "31, Relief Road, Owerri",
    "Kaduna": "Lagos Garage, Mando",
    "Lagos": "20, Ikorodu Exp. Rd, Jibowu",
    "Plateau": "Zaria Road Bypass, Jos",
    "Rivers": "228, Aba Road, PH",
    "Nasarawa": "Maraba Terminal, Keffi Rd"
  },
  "Peace Mass Transit (PMT)": {
    "Abia": "13, Asa Road, Aba",
    "Abuja": "39 Ajose Adeogun St, Utako",
    "FCT (Abuja)": "39 Ajose Adeogun St, Utako",
    "Akwa Ibom": "Itam Industrial Layout, Uyo",
    "Anambra": "103, Oguta Road, Onitsha",
    "Bayelsa": "783, Okutukutu, Yenagoa",
    "Cross River": "56, Bedwell St, Calabar",
    "Delta": "118, Warri-Sapele Road",
    "Edo": "117, Akpakpava Road, Benin",
    "Enugu": "1, Christ Chemist Rd, Enugu",
    "Imo": "1 Living Christ Ave, Owerri",
    "Kaduna": "Plot 1416, Nnamdi Azikiwe Way",
    "Lagos": "7, Ikorodu Road, Jibowu",
    "Plateau": "Terminus Market, Jos",
    "Rivers": "Opp. Bori Camp, PH",
    "Benue": "Makurdi Express Rd",
    "Ebonyi": "25A Afikpo Rd, Abakaliki",
    "Kwara": "1 Ogba Dam Rd, Ilorin",
    "Nasarawa": "Last Bus Stop, Keffi Rd",
    "Niger": "David Mark Rd, Minna",
    "Ogun": "Near Ibafo Police Station",
    "Ondo": "Ife-Ibadan Exp, Akure",
    "Oyo": "Samonda Old Airport, UI"
  },
  "GUO Transport": {
    "Abia": "Aba Terminal, Milverton Ave",
    "Abuja": "Utako Terminal, Abuja",
    "FCT (Abuja)": "Utako Terminal, Abuja",
    "Akwa Ibom": "Uyo Terminal, Abak Rd",
    "Anambra": "Upper Iweka, Onitsha",
    "Bayelsa": "Yenagoa Terminal",
    "Cross River": "Calabar Terminal",
    "Delta": "Asaba Terminal",
    "Edo": "Benin Terminal",
    "Enugu": "Market Road, Enugu",
    "Imo": "Relief Road, Owerri",
    "Kaduna": "Kaduna Terminal",
    "Kano": "Kano Terminal",
    "Lagos": "KM 3, Badagry Exp.",
    "Plateau": "Jos Terminal",
    "Rivers": "Aba Road, Port Harcourt"
  }
};

/**
 * Gets the terminal address based on transport company and state.
 * Fallback: "[State] central terminal"
 */
export function getTerminalAddress(company: string, state: string): string {
  // Normalize state name for lookup
  let normalizedState = state.trim();
  if (normalizedState.toLowerCase() === 'abuja') normalizedState = 'FCT (Abuja)';
  if (normalizedState.toLowerCase() === 'fct') normalizedState = 'FCT (Abuja)';

  const companyTerminals = TERMINAL_ADDRESSES[company];
  if (companyTerminals) {
    // Exact match target (case-sensitive as per our mapping)
    const exactMatch = Object.keys(companyTerminals).find(s => s.toLowerCase() === normalizedState.toLowerCase());
    if (exactMatch) {
      return companyTerminals[exactMatch];
    }
  }

  // Fallback as per request
  return `${state} central terminal`;
}
