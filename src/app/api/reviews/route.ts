import { NextResponse } from 'next/server';
import {
  getAllReviews,
  addProductReview,
  toggleReviewApproval,
  deleteReviewById,
} from '@/lib/storeData';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || undefined;
    const all = searchParams.get('all') === 'true';
    const reviews = await getAllReviews(!all, slug);
    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.customer_name || !body?.comment) {
      return NextResponse.json(
        { error: 'Please provide your name and review comment' },
        { status: 400 }
      );
    }
    const review = await addProductReview({
      product_id: body.product_id,
      product_slug: body.product_slug,
      product_name: body.product_name || 'Vishnu Home Product',
      customer_name: body.customer_name,
      city: body.city || 'India',
      rating: Number(body.rating) || 5,
      comment: body.comment,
    });
    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }
    const reviews = await toggleReviewApproval(id);
    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }
    const reviews = await deleteReviewById(id);
    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}

