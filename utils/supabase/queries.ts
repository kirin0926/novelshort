import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

// 获取用户信息（使用 React cache）
export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

// 获取订阅信息（使用 React cache）
export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return subscription;
});

// 获取产品列表（使用 React cache）
export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return products;
});

// 获取用户详细信息（使用 React cache）
export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  return userDetails;
});

// 获取小说列表
export const getNovels = cache(async (supabase: SupabaseClient) => {
  const { data: novels } = await supabase.from('novels').select('*');
  return novels;
});