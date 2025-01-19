import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './types'
import { NextRequest } from 'next/server';

export const createServerSupabase = () =>
  createServerComponentClient<Database>({ cookies })

export const getUser = async (req: NextRequest) => {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
