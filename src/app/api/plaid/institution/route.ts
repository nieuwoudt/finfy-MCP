import { plaidClient } from '@/lib/plaid';
import { NextRequest, NextResponse } from 'next/server';
import { CountryCode } from 'plaid';

export async function POST(req: NextRequest) {
  try {
    const { institutionID } = await req.json();
    const countryCodes: CountryCode[] = [
        CountryCode.Us,
        CountryCode.Gb,
        CountryCode.Es,
        CountryCode.Nl,
        CountryCode.Fr,
        CountryCode.Ie,
        CountryCode.Ca,
        CountryCode.De,
        CountryCode.It,
        CountryCode.Pl,
        CountryCode.Dk,
        CountryCode.No,
        CountryCode.Se,
        CountryCode.Ee,
        CountryCode.Lt,
        CountryCode.Lv,
        CountryCode.Pt,
        CountryCode.Be,
      ];

    const institutionResponse = await plaidClient.institutionsGetById({
        institution_id: institutionID,
        country_codes: countryCodes,
    });

    return NextResponse.json({ institution: institutionResponse.data.institution });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching institution' }, { status: 500 });
  }
}
