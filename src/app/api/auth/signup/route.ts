import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail.includes('papa') || cleanEmail.includes('admin') || cleanEmail === 'papa@martinique-explorer.com';

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseSecret = process.env.SUPABASE_SECRET_KEY || '';

    if (!supabaseUrl || !supabaseSecret) {
      return NextResponse.json({ error: 'Configuration Supabase manquante' }, { status: 500 });
    }

    // Connect with Admin Privileges (Service Role / Secret)
    const supabaseAdmin = createClient(supabaseUrl, supabaseSecret, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    // Create user with email_confirm: true so no verification email is sent!
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
      user_metadata: {
        name: name?.trim() || cleanEmail.split('@')[0],
        role: isAdmin ? 'admin' : 'member'
      }
    });

    if (error) {
      // If user already registered, return clear message
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        return NextResponse.json({ 
          error: 'Cette adresse email possède déjà un compte. Veuillez vous connecter dans l\'onglet "Se connecter".' 
        }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      message: 'Compte créé avec succès !'
    });
  } catch (err: any) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
