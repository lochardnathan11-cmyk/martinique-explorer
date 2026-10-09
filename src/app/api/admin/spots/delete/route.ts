import { NextResponse } from 'next/server';
import { deletePlaceFromMockData } from '@/lib/spotsAdminService';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID du lieu manquant' },
        { status: 400 }
      );
    }

    const deleted = deletePlaceFromMockData(id);
    if (!deleted) {
      return NextResponse.json(
        { error: `Impossible de supprimer le lieu ${id}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Lieu ${id} supprimé avec succès.`
    });
  } catch (err: any) {
    console.error('Error in delete spot route:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
