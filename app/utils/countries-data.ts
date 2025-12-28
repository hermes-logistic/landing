export interface Country {
  code: string
  name: string
  phoneCode: string
}

export const countries: Country[] = [
  { code: 'US', name: 'United States', phoneCode: '+1' },
  { code: 'CA', name: 'Canada', phoneCode: '+1' },
  { code: 'MX', name: 'Mexico', phoneCode: '+52' },
  { code: 'SV', name: 'El Salvador', phoneCode: '+503' },
  { code: 'GT', name: 'Guatemala', phoneCode: '+502' },
  { code: 'HN', name: 'Honduras', phoneCode: '+504' },
  { code: 'NI', name: 'Nicaragua', phoneCode: '+505' },
  { code: 'CR', name: 'Costa Rica', phoneCode: '+506' },
  { code: 'PA', name: 'Panama', phoneCode: '+507' },
  { code: 'CO', name: 'Colombia', phoneCode: '+57' },
  { code: 'VE', name: 'Venezuela', phoneCode: '+58' },
  { code: 'EC', name: 'Ecuador', phoneCode: '+593' },
  { code: 'PE', name: 'Peru', phoneCode: '+51' },
  { code: 'BR', name: 'Brazil', phoneCode: '+55' },
  { code: 'AR', name: 'Argentina', phoneCode: '+54' },
  { code: 'CL', name: 'Chile', phoneCode: '+56' },
  { code: 'ES', name: 'Spain', phoneCode: '+34' },
  { code: 'GB', name: 'United Kingdom', phoneCode: '+44' },
  { code: 'DE', name: 'Germany', phoneCode: '+49' },
  { code: 'FR', name: 'France', phoneCode: '+33' }
]

export const citiesByCountry: Record<string, string[]> = {
  US: [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose',
    'Austin',
    'Jacksonville',
    'Fort Worth',
    'Columbus',
    'Charlotte',
    'Miami',
    'Seattle',
    'Denver',
    'Washington D.C.',
    'Boston'
  ],
  CA: [
    'Toronto',
    'Montreal',
    'Vancouver',
    'Calgary',
    'Edmonton',
    'Ottawa',
    'Winnipeg',
    'Quebec City',
    'Hamilton',
    'Kitchener'
  ],
  MX: [
    'Mexico City',
    'Guadalajara',
    'Monterrey',
    'Puebla',
    'Tijuana',
    'León',
    'Juárez',
    'Zapopan',
    'Mérida',
    'Cancún'
  ],
  SV: [
    'San Salvador',
    'Santa Ana',
    'San Miguel',
    'Mejicanos',
    'Santa Tecla',
    'Apopa',
    'Soyapango',
    'Delgado',
    'Ilopango',
    'Antiguo Cuscatlán'
  ],
  GT: [
    'Guatemala City',
    'Mixco',
    'Villa Nueva',
    'Quetzaltenango',
    'San Juan Sacatepéquez',
    'Petapa',
    'Chinautla',
    'Escuintla',
    'Villa Canales',
    'Amatitlán'
  ],
  HN: [
    'Tegucigalpa',
    'San Pedro Sula',
    'La Ceiba',
    'Choloma',
    'El Progreso',
    'Comayagua',
    'Puerto Cortés',
    'Choluteca',
    'Danlí',
    'Siguatepeque'
  ],
  NI: [
    'Managua',
    'León',
    'Masaya',
    'Matagalpa',
    'Chinandega',
    'Estelí',
    'Granada',
    'Jinotega',
    'Juigalpa',
    'Bluefields'
  ],
  CR: [
    'San José',
    'Limón',
    'San Francisco',
    'Alajuela',
    'Liberia',
    'Paraíso',
    'Desamparados',
    'San Vicente',
    'Cartago',
    'Heredia'
  ],
  PA: [
    'Panama City',
    'San Miguelito',
    'Juan Díaz',
    'David',
    'Arraiján',
    'Colón',
    'La Chorrera',
    'Pacora',
    'Santiago',
    'Chitré'
  ],
  CO: [
    'Bogotá',
    'Medellín',
    'Cali',
    'Barranquilla',
    'Cartagena',
    'Cúcuta',
    'Bucaramanga',
    'Pereira',
    'Santa Marta',
    'Ibagué'
  ],
  VE: [
    'Caracas',
    'Maracaibo',
    'Valencia',
    'Barquisimeto',
    'Maracay',
    'Ciudad Guayana',
    'Barcelona',
    'Maturín',
    'Puerto La Cruz',
    'Petare'
  ],
  EC: [
    'Quito',
    'Guayaquil',
    'Cuenca',
    'Santo Domingo',
    'Machala',
    'Durán',
    'Manta',
    'Portoviejo',
    'Loja',
    'Ambato'
  ],
  PE: [
    'Lima',
    'Arequipa',
    'Callao',
    'Trujillo',
    'Chiclayo',
    'Piura',
    'Iquitos',
    'Cusco',
    'Huancayo',
    'Tacna'
  ],
  BR: [
    'São Paulo',
    'Rio de Janeiro',
    'Brasília',
    'Salvador',
    'Fortaleza',
    'Belo Horizonte',
    'Manaus',
    'Curitiba',
    'Recife',
    'Porto Alegre'
  ],
  AR: [
    'Buenos Aires',
    'Córdoba',
    'Rosario',
    'Mendoza',
    'La Plata',
    'San Miguel de Tucumán',
    'Mar del Plata',
    'Salta',
    'Santa Fe',
    'San Juan'
  ],
  CL: [
    'Santiago',
    'Puente Alto',
    'Antofagasta',
    'Viña del Mar',
    'Valparaíso',
    'Talcahuano',
    'San Bernardo',
    'Temuco',
    'Iquique',
    'Concepción'
  ],
  ES: [
    'Madrid',
    'Barcelona',
    'Valencia',
    'Sevilla',
    'Zaragoza',
    'Málaga',
    'Murcia',
    'Palma',
    'Las Palmas',
    'Bilbao'
  ],
  GB: [
    'London',
    'Birmingham',
    'Manchester',
    'Leeds',
    'Glasgow',
    'Liverpool',
    'Newcastle',
    'Sheffield',
    'Bristol',
    'Edinburgh'
  ],
  DE: [
    'Berlin',
    'Hamburg',
    'Munich',
    'Cologne',
    'Frankfurt',
    'Stuttgart',
    'Düsseldorf',
    'Leipzig',
    'Dortmund',
    'Essen'
  ],
  FR: [
    'Paris',
    'Marseille',
    'Lyon',
    'Toulouse',
    'Nice',
    'Nantes',
    'Montpellier',
    'Strasbourg',
    'Bordeaux',
    'Lille'
  ]
}

export function getCitiesByCountry(countryCode: string): string[] {
  return citiesByCountry[countryCode] || []
}

export function getCountryByCode(code: string): Country | undefined {
  return countries.find(c => c.code === code)
}

export function getPhoneCodeByCountry(countryCode: string): string {
  const country = getCountryByCode(countryCode)
  return country?.phoneCode || '+1'
}
