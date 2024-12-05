import { plaidClient } from '@/lib/plaid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { institutionID, countryCode } = await req.json();

    const institutionResponse = await plaidClient.institutionsGetById({
        institution_id: institutionID,
        country_codes: [countryCode],
    }, { include_optional_metadata: true, include_status: true, include_auth_metadata: true, include_payment_initiation_metadata: true });

    return NextResponse.json({ institution: institutionResponse.data.institution });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching institution' }, { status: 500 });
  }
}
