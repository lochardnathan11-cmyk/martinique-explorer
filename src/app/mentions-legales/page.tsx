import { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Mentions Légales — Martinique Explorer',
  description: 'Mentions légales de la plateforme Martinique Explorer.',
};

export default function MentionsLegales() {
  return (
    <LegalPageLayout title="Mentions Légales">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">1. Éditeur du site</h2>
        <p>Le site Martinique Explorer est édité par la société Martinique Explorer SAS, au capital de 10 000 euros, immatriculée au Registre du Commerce et des Sociétés de Fort-de-France sous le numéro XXX XXX XXX.</p>
        <p><strong>Siège social :</strong> 123 Rue de la République, 97200 Fort-de-France, Martinique.</p>
        <p><strong>Directeur de la publication :</strong> [Nom du Directeur]</p>
        <p><strong>Contact :</strong> contact@martinique-explorer.com</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">2. Hébergement</h2>
        <p>Le site est hébergé par Vercel Inc.<br />
        340 S Lemon Ave #4133<br />
        Walnut, CA 91789, USA</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">3. Propriété intellectuelle</h2>
        <p>L&apos;ensemble de ce site relève de la législation française et internationale sur le droit d&apos;auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
        <p>La reproduction de tout ou partie de ce site sur un support électronique ou papier quel qu&apos;il soit est formellement interdite sauf autorisation expresse du directeur de la publication.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">4. Limitation de responsabilité</h2>
        <p>L&apos;éditeur ne saurait être tenu responsable des erreurs matérielles qui se seraient glissées dans les documents présents sur le site, malgré tout le soin apporté à leur publication.</p>
        <p>Martinique Explorer décline toute responsabilité quant aux éventuels dysfonctionnements pouvant survenir sur le site et entraîner une perte de données ou une indisponibilité de l&apos;accès aux informations produites sur celui-ci.</p>
      </section>
    </LegalPageLayout>
  );
}
