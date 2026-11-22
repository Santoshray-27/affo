// BRAND CLAIMS CONFIGURATION
// IMPORTANT: Do NOT invent certifications. All claims here have approved: false.
// TODO: confirm with client before publishing or using in production marketing materials.
// Never write "FDA Approved" - only verified national standards (e.g. FSSAI / Jaivik Bharat) once confirmed.

export interface BrandClaim {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  approved: boolean; // Must remain false until verified with client
  notes: string;
}

export const brandClaims: BrandClaim[] = [
  {
    id: 'ozone-wash',
    title: 'Ozone-Washed Produce',
    subtitle: 'Triple-stage cold ozone bubble rinse removing surface contaminants (Placeholder copy)',
    iconName: 'Sparkles',
    approved: false, // TODO: confirm with client
    notes: 'Placeholder claim. Pending laboratory protocol sign-off.',
  },
  {
    id: 'nitrate-tested',
    title: 'Nitrate & Residue Tested',
    subtitle: 'Batch-tested for synthetic agrochemicals and excessive nitrates (Placeholder copy)',
    iconName: 'ShieldCheck',
    approved: false, // TODO: confirm with client
    notes: 'Placeholder claim. Laboratory partner verification required.',
  },
  {
    id: 'direct-farm',
    title: '100% Direct From Soil',
    subtitle: 'Harvested under 18 hours before doorstep delivery from partner orchards (Placeholder copy)',
    iconName: 'Sprout',
    approved: false, // TODO: confirm with client
    notes: 'Farm partner agreements pending confirmation.',
  },
  {
    id: 'eco-packaging',
    title: 'Zero Single-Use Plastic Carts',
    subtitle: 'Packed in reusable breathable cotton crates and cornstarch punnets (Placeholder copy)',
    iconName: 'PackageCheck',
    approved: false, // TODO: confirm with client
    notes: 'Packaging supplier specification pending client confirmation.',
  },
];

