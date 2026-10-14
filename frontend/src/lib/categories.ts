export interface TaxonomyProductType {
  name: string;
  slug: string;
}

export interface TaxonomyCategory {
  category: string;
  slug: string;
  shortName: string;
  description: string;
  product_types: TaxonomyProductType[];
}

export const STORE_CATEGORIES: TaxonomyCategory[] = [
  {
    category: 'Hair Care Products',
    shortName: 'Hair Care',
    slug: 'hair-care-products',
    description: 'Professional hair care treatments, serums, masks, and rebonding products.',
    product_types: [
      { name: 'Hair Oil', slug: 'hair-oil' },
      { name: 'Hair Serum', slug: 'hair-serum' },
      { name: 'Hair Mask', slug: 'hair-mask' },
      { name: 'Hair Tonic', slug: 'hair-tonic' },
      { name: 'Keratin & Rebonding Creams', slug: 'keratin-rebonding-creams' },
    ],
  },
  {
    category: 'Hair Styling Products',
    shortName: 'Hair Styling',
    slug: 'hair-styling-products',
    description: 'Premium styling sprays, waxes, gels, pomades, powders, and creams.',
    product_types: [
      { name: 'Hair Spray', slug: 'hair-spray' },
      { name: 'Hair Wax', slug: 'hair-wax' },
      { name: 'Hair Gel', slug: 'hair-gel' },
      { name: 'Hair Mousse', slug: 'hair-mousse' },
      { name: 'Styling Powder', slug: 'styling-powder' },
      { name: 'Curl Defining Cream', slug: 'curl-defining-cream' },
      { name: 'Hair Clay', slug: 'hair-clay' },
      { name: 'Hair Setting Lotion', slug: 'hair-setting-lotion' },
    ],
  },
  {
    category: 'Barber Tools & Accessories',
    shortName: 'Barber Tools',
    slug: 'barber-tools-accessories',
    description: 'Precision scissors, combs, brushes, razors, clippers, and guards for barbers.',
    product_types: [
      { name: 'Hair-Cutting Scissors', slug: 'hair-cutting-scissors' },
      { name: 'Thinning Scissors', slug: 'thinning-scissors' },
      { name: 'Barber Combs', slug: 'barber-combs' },
      { name: 'Cutting Combs', slug: 'cutting-combs' },
      { name: 'Fade Combs', slug: 'fade-combs' },
      { name: 'Hair Brushes', slug: 'hair-brushes' },
      { name: 'Neck Brushes', slug: 'neck-brushes' },
      { name: 'Straight Razors', slug: 'straight-razors' },
      { name: 'Razor Blades', slug: 'razor-blades' },
      { name: 'Manual Clippers', slug: 'manual-clippers' },
      { name: 'Clipper Guards', slug: 'clipper-guards' },
    ],
  },
  {
    category: 'Shaving & Beard Care',
    shortName: 'Shaving & Beard',
    slug: 'shaving-beard-care',
    description: 'Grooming foams, creams, aftershaves, and beard nourishing oils & balms.',
    product_types: [
      { name: 'Shaving Foam', slug: 'shaving-foam' },
      { name: 'Shaving Cream', slug: 'shaving-cream' },
      { name: 'Shaving Gel', slug: 'shaving-gel' },
      { name: 'Aftershave Lotion', slug: 'aftershave-lotion' },
      { name: 'Beard Oil', slug: 'beard-oil' },
      { name: 'Beard Balm', slug: 'beard-balm' },
      { name: 'Beard Wax', slug: 'beard-wax' },
      { name: 'Shaving Brushes', slug: 'shaving-brushes' },
    ],
  },
  {
    category: 'Hair Colors & Dyes',
    shortName: 'Hair Colors',
    slug: 'hair-colors-dyes',
    description: 'Permanent, semi-permanent, and temporary colors, bleach, and developer.',
    product_types: [
      { name: 'Permanent Hair Dye', slug: 'permanent-hair-dye' },
      { name: 'Hair Bleach Powder', slug: 'hair-bleach-powder' },
      { name: 'Semi-Permanent Hair Color', slug: 'semi-permanent-hair-color' },
      { name: 'Temporary Hair Color', slug: 'temporary-hair-color' },
      { name: 'Cream Bleach', slug: 'cream-bleach' },
    ],
  },
  {
    category: 'Skin Care',
    shortName: 'Skin Care',
    slug: 'skin-care',
    description: 'Cleansers, face washes, moisturizers, scrubs, sunscreens, and facial care.',
    product_types: [
      { name: 'Face Wash', slug: 'face-wash' },
      { name: 'Facial Cleanser', slug: 'facial-cleanser' },
      { name: 'Moisturizer', slug: 'moisturizer' },
      { name: 'Face Scrub', slug: 'face-scrub' },
      { name: 'Face Mask', slug: 'face-mask' },
      { name: 'Sunscreen', slug: 'sunscreen' },
      { name: 'Toner', slug: 'toner' },
      { name: 'Facial Serum', slug: 'facial-serum' },
      { name: 'Blackhead Removal Products', slug: 'blackhead-removal-products' },
      { name: 'Facial Cleansing Tools', slug: 'facial-cleansing-tools' },
      { name: 'Facial Kits', slug: 'facial-kits' },
    ],
  },
  {
    category: 'Electrical Salon Equipment',
    shortName: 'Salon Equipment',
    slug: 'electrical-salon-equipment',
    description: 'Professional dryers, straighteners, curling irons, clippers, and trimmers.',
    product_types: [
      { name: 'Hair Dryer', slug: 'hair-dryer' },
      { name: 'Hair Straightener', slug: 'hair-straightener' },
      { name: 'Curling Iron', slug: 'curling-iron' },
      { name: 'Hair Trimmer', slug: 'hair-trimmer' },
      { name: 'Professional Hair Clipper', slug: 'professional-hair-clipper' },
      { name: 'Electric Shaver', slug: 'electric-shaver' },
      { name: 'Clipper Charging Accessories', slug: 'clipper-charging-accessories' },
    ],
  },
  {
    category: 'Nail & Beauty Accessories',
    shortName: 'Nail & Beauty',
    slug: 'nail-beauty-accessories',
    description: 'Manicure sets, pedicure tools, clippers, tweezers, makeup brushes, and tools.',
    product_types: [
      { name: 'Nail Clippers', slug: 'nail-clippers' },
      { name: 'Nail Files', slug: 'nail-files' },
      { name: 'Cuticle Cutters', slug: 'cuticle-cutters' },
      { name: 'Tweezers', slug: 'tweezers' },
      { name: 'Pedicure Tools', slug: 'pedicure-tools' },
      { name: 'Manicure Sets', slug: 'manicure-sets' },
      { name: 'Nail Scissors', slug: 'nail-scissors' },
      { name: 'Eyelash Curlers', slug: 'eyelash-curlers' },
      { name: 'Makeup Brushes', slug: 'makeup-brushes' },
      { name: 'Facial Razors', slug: 'facial-razors' },
      { name: 'Beauty Spatulas', slug: 'beauty-spatulas' },
    ],
  },
  {
    category: 'Professional Salon Supplies',
    shortName: 'Salon Supplies',
    slug: 'professional-salon-supplies',
    description: 'Capes, aprons, towels, neck strips, gloves, disinfectants, and clips.',
    product_types: [
      { name: 'Hair-Cutting Aprons', slug: 'hair-cutting-aprons' },
      { name: 'Barber Capes', slug: 'barber-capes' },
      { name: 'Salon Towels', slug: 'salon-towels' },
      { name: 'Neck Strips', slug: 'neck-strips' },
      { name: 'Disposable Gloves', slug: 'disposable-gloves' },
      { name: 'Spray Bottles', slug: 'spray-bottles' },
      { name: 'Mixing Bowls', slug: 'mixing-bowls' },
      { name: 'Color Application Brushes', slug: 'color-application-brushes' },
      { name: 'Hair Sectioning Clips', slug: 'hair-sectioning-clips' },
      { name: 'Salon Disinfectants', slug: 'salon-disinfectants' },
      { name: 'Tool Cleaning Solutions', slug: 'tool-cleaning-solutions' },
      { name: 'Disposable Applicators', slug: 'disposable-applicators' },
    ],
  },
];
