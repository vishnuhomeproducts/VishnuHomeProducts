import { NextResponse } from 'next/server';
import {
  getAllQueries,
  addCustomerQuery,
  updateCustomerQueryStatus,
} from '@/lib/storeData';

export async function GET() {
  try {
    const queries = await getAllQueries();
    return NextResponse.json({ queries });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load queries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.name || !body?.phone || !body?.message) {
      return NextResponse.json(
        { error: 'Name, phone number, and message are required' },
        { status: 400 }
      );
    }
    const query = await addCustomerQuery({
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      type: body.type || 'Product Inquiry',
      message: body.message,
    });
    return NextResponse.json({ success: true, query });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, reply } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Query ID and status are required' }, { status: 400 });
    }
    const queries = await updateCustomerQueryStatus(id, status, reply);
    return NextResponse.json({ success: true, queries });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update query' }, { status: 500 });
  }
}

