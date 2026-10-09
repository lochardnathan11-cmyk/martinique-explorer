import { NextResponse } from 'next/server';

const ADMIN_PASSWORDS = ['admin', 'papa', 'martinique2026', 'madinina2026'];

export async function POST(request: Request) {
  try {
    const { password, email } = await request.json();

    const isMatch = 
      ADMIN_PASSWORDS.includes(password?.trim()?.toLowerCase()) ||
      (email?.toLowerCase() === 'papa@martinique-explorer.com' && (!password || password === 'admin'));

    if (isMatch) {
      return NextResponse.json({
        success: true,
        user: {
          name: 'Administrateur',
          email: 'admin@martinique-explorer.com',
          role: 'admin'
        }
      });
    }

    return NextResponse.json(
      { error: 'Mot de passe administrateur incorrect' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
