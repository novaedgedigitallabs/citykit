/**
 * Continent → ISO2 country code mapping.
 * Maps each continent name to an array of ISO2 codes for countries in that continent.
 */
export const CONTINENT_MAP: Record<string, string[]> = {
  africa: [
    'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD',
    'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE',
    'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG',
    'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG',
    'ZM', 'ZW', 'RE', 'YT', 'SH', 'EH',
  ],
  asia: [
    'AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'CY', 'GE', 'IN', 'ID',
    'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN',
    'MM', 'NP', 'KP', 'OM', 'PK', 'PS', 'PH', 'QA', 'SA', 'SG', 'KR', 'LK', 'SY',
    'TW', 'TJ', 'TH', 'TL', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE', 'HK', 'MO',
  ],
  europe: [
    'AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CZ', 'DK', 'EE', 'FI', 'FR',
    'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD',
    'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI',
    'ES', 'SE', 'CH', 'UA', 'GB', 'VA', 'FO', 'GI', 'GG', 'IM', 'JE', 'AX',
  ],
  'north america': [
    'AG', 'BS', 'BB', 'BZ', 'CA', 'CR', 'CU', 'DM', 'DO', 'SV', 'GD', 'GT', 'HT',
    'HN', 'JM', 'MX', 'NI', 'PA', 'KN', 'LC', 'VC', 'TT', 'US', 'GL', 'BM', 'KY',
    'AW', 'CW', 'SX', 'BQ', 'TC', 'VG', 'VI', 'PR', 'GP', 'MQ', 'MF', 'BL', 'AI',
    'MS', 'PM',
  ],
  'south america': [
    'AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE', 'GF',
    'FK',
  ],
  oceania: [
    'AU', 'FJ', 'KI', 'MH', 'FM', 'NR', 'NZ', 'PW', 'PG', 'WS', 'SB', 'TO', 'TV',
    'VU', 'NC', 'PF', 'GU', 'AS', 'MP', 'CK', 'NU', 'TK', 'WF', 'NF',
  ],
  antarctica: ['AQ'],
};

/**
 * Get the set of ISO2 codes for a given continent name (case-insensitive).
 */
export function getContinentCodes(continent: string): Set<string> | null {
  const key = continent.toLowerCase();
  const codes = CONTINENT_MAP[key];
  return codes ? new Set(codes) : null;
}

/**
 * Get all valid continent names.
 */
export function getContinentNames(): string[] {
  return Object.keys(CONTINENT_MAP).map((k) =>
    k.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  );
}

// Lazy-built reverse lookup: ISO2 → continent display name
let _iso2ToContinentMap: Map<string, string> | null = null;

function buildReverseMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const [key, codes] of Object.entries(CONTINENT_MAP)) {
    const displayName = key
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    for (const iso2 of codes) {
      map.set(iso2.toUpperCase(), displayName);
    }
  }
  return map;
}

/**
 * Get the continent name for a given ISO2 country code.
 * Returns an empty string if the code is not in the continent map.
 *
 * @example getCountryContinent('IN') // → 'Asia'
 * @example getCountryContinent('DE') // → 'Europe'
 */
export function getCountryContinent(iso2: string): string {
  if (!_iso2ToContinentMap) {
    _iso2ToContinentMap = buildReverseMap();
  }
  return _iso2ToContinentMap.get(iso2.toUpperCase()) ?? '';
}

