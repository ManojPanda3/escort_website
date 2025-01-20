import Stripe from 'stripe'
import checkAdmin from '@/lib/checkAdmin'
import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
})

// POST: Add a new offer and create a corresponding Stripe price
export async function POST(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json(
        { message: 'Unauthorized access', error: 'Unauthorized access' },
        { status: 401 }
      )
    }
    if (!supabaseAdmin) throw new Error('Failed to start Supabase as admin')

    const newOffer = await request.json()
    delete newOffer.id

    // Step 1: Create a Stripe product
    const product = await stripe.products.create({
      name: newOffer.type,
      description: `Features: ${newOffer.features.join(', ')}`,
    })

    // Step 2: Create a Stripe price for the product
    const price = await stripe.prices.create({
      unit_amount: newOffer.price * 100, // Stripe expects amounts in cents
      currency: 'usd',
      recurring: { interval: newOffer.billing_cycle === "monthly" ? "month" : "year" },
      product: product.id,
    })

    // Step 3: Save the offer with Stripe product and price IDs
    const { error } = await supabaseAdmin
      .from('offers')
      .insert({
        ...newOffer,
        stripe_price_id: price.id,
        stripe_product_id: product.id
      })
    if (error) throw error

    return NextResponse.json({ error: null, message: 'success' }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, message: 'failed' },
      { status: 500 }
    )
  }
}

// PUT: Update an existing offer and its Stripe price
export async function PUT(request: NextRequest) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json(
        { message: 'Unauthorized access', error: 'Unauthorized access' },
        { status: 401 }
      )
    }
    if (!supabaseAdmin) throw new Error('Failed to start Supabase as admin')

    const updatedOffer = await request.json()

    // Step 1: Update the Stripe product if it exists
    if (updatedOffer.stripe_product_id) {
      await stripe.products.update(updatedOffer.stripe_product_id, {
        name: updatedOffer.type,
        description: `Features: ${updatedOffer.features.join(', ')}`,
      })
    }

    // Step 2: Update or create the Stripe price
    if (!updatedOffer.stripe_price_id) {
      // Create a new price if one doesn't exist
      const price = await stripe.prices.create({
        unit_amount: updatedOffer.price * 100,
        currency: 'usd',
        recurring: { interval: updatedOffer.billing_cycle === "monthly" ? "month" : "year" },
        product: updatedOffer.stripe_product_id,
      })
      updatedOffer.stripe_price_id = price.id
    }

    // Step 3: Update the offer in the database
    const { error } = await supabaseAdmin
      .from('offers')
      .update(updatedOffer)
      .eq('id', updatedOffer.id)
    if (error) throw error

    return NextResponse.json({ error: null, message: 'success' }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, message: 'failed' },
      { status: 500 }
    )
  }
}

