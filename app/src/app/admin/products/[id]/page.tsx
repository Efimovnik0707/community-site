import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { ProductForm } from '../ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()
  const { data: product } = await supabase.from('comm_products').select('*').eq('id', id).single()
  if (!product) notFound()
  return <ProductForm product={product} />
}
