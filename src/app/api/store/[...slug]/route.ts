import { NextResponse } from 'next/server';
import {
  getAllCoupons,
  validateStoreCoupon,
  getAllQueries,
  addCustomerQuery,
  updateCustomerQueryStatus,
  getAllReviews,
  addProductReview,
  toggleReviewApproval,
  deleteReviewById,
  getStoreConfig,
  updateStoreConfig,
} from '@/lib/storeData';

export async function GET(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const action = params.slug?.[0] || '';

  // 1. Coupons Validation / Listing
  if (action === 'coupons-validate' || action === 'coupons') {
    try {
      const coupons = await getAllCoupons();
      const activeCoupons = coupons.filter((c) => c.active);
      return NextResponse.json({ coupons: activeCoupons });
    } catch {
      return NextResponse.json({ coupons: [] });
    }
  }

  // 2. Customer Queries
  if (action === 'queries') {
    try {
      const queries = await getAllQueries();
      return NextResponse.json({ queries });
    } catch {
      return NextResponse.json({ error: 'Failed to load queries' }, { status: 500 });
    }
  }

  // 3. Customer Product Reviews
  if (action === 'reviews') {
    try {
      const { searchParams } = new URL(req.url);
      const slug = searchParams.get('slug') || undefined;
      const all = searchParams.get('all') === 'true';
      const reviews = await getAllReviews(!all, slug);
      return NextResponse.json({ reviews });
    } catch {
      return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 });
    }
  }

  // 4. Store Settings
  if (action === 'settings') {
    try {
      const settings = await getStoreConfig();
      return NextResponse.json({ settings });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Failed to fetch settings' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const action = params.slug?.[0] || '';

  // 1. Validate Coupon
  if (action === 'coupons-validate' || action === 'coupons') {
    try {
      const { code, subtotal = 0 } = await req.json();
      const result = await validateStoreCoupon(code, Number(subtotal) || 0);

      if (!result.valid || !result.coupon) {
        return NextResponse.json(
          { error: result.error || 'Invalid or expired coupon code' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        coupon: {
          code: result.coupon.code,
          discount_type: result.coupon.discount_type,
          discount_value: result.coupon.discount_value,
          min_order: result.coupon.min_order,
        },
        discountAmount: result.discountAmount,
      });
    } catch {
      return NextResponse.json({ error: 'Server error validating coupon' }, { status: 500 });
    }
  }

  // 2. Add Customer Query
  if (action === 'queries') {
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
    } catch {
      return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
    }
  }

  // 3. Add Review
  if (action === 'reviews') {
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
    } catch {
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
  }

  // 4. Update Settings
  if (action === 'settings') {
    try {
      const body = await req.json();
      const settings = await updateStoreConfig(body);
      return NextResponse.json({ success: true, settings });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Failed to save settings' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const action = params.slug?.[0] || '';

  if (action === 'queries') {
    try {
      const { id, status, reply } = await req.json();
      if (!id || !status) {
        return NextResponse.json({ error: 'Query ID and status are required' }, { status: 400 });
      }
      const queries = await updateCustomerQueryStatus(id, status, reply);
      return NextResponse.json({ success: true, queries });
    } catch {
      return NextResponse.json({ error: 'Failed to update query' }, { status: 500 });
    }
  }

  if (action === 'reviews') {
    try {
      const { id } = await req.json();
      if (!id) {
        return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
      }
      const reviews = await toggleReviewApproval(id);
      return NextResponse.json({ success: true, reviews });
    } catch {
      return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const action = params.slug?.[0] || '';

  if (action === 'reviews') {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
      }
      const reviews = await deleteReviewById(id);
      return NextResponse.json({ success: true, reviews });
    } catch {
      return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

