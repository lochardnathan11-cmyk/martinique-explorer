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
        <h2 className="text-xl font-bold text-deep">1. Édition du site</h2>
        <p>Le site <strong>Martinique Explorer</strong> est édité à titre personnel et non professionnel.</p>
        <p>Conformément aux dispositions de l&apos;article 6-III 2° de la loi n°2004-575 du 21 juin 2004 pour la Confiance dans l&apos;Économie Numérique (LCEN), l&apos;éditeur a fait le choix de préserver son anonymat. Ses nom, prénom et domicile ont été transmis à l&apos;hébergeur du site, qui est tenu au secret professionnel.</p>
        <p>En cas de réclamation concernant le contenu de ce site, il convient de s&apos;adresser directement à l&apos;hébergeur mentionné ci-dessous, ou de contacter l&apos;éditeur via le formulaire de contact du site ou à l&apos;adresse email de contact fournie.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">2. Hébergement</h2>
        <p>Le site est hébergé par la société :<br />
        <strong>Vercel Inc.</strong><br />
        340 S Lemon Ave #4133<br />
        Walnut, CA 91789, États-Unis<br />
        Contact hébergeur : privacy@vercel.com
        </p>
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
