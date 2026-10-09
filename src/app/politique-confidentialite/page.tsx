import { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité (RGPD) — Martinique Explorer',
  description: 'Politique de confidentialité et gestion des données personnelles de la plateforme Martinique Explorer.',
};

export default function PolitiqueConfidentialite() {
  return (
    <LegalPageLayout title="Politique de Confidentialité (RGPD)">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">1. Collecte des données</h2>
        <p>Dans le cadre de l&apos;utilisation du site Martinique Explorer, nous pouvons être amenés à collecter les données personnelles suivantes :</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Nom et prénom (lors de la création d&apos;un compte)</li>
          <li>Adresse e-mail</li>
          <li>Données de navigation (cookies fonctionnels et analytiques)</li>
          <li>Avis, commentaires et contenus partagés sur la plateforme</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">2. Utilisation des données</h2>
        <p>Les informations que nous recueillons sont utilisées pour :</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
          <li>Fournir un contenu personnalisé (itinéraires, favoris)</li>
          <li>Améliorer notre site web et nos services</li>
          <li>Vous contacter par e-mail (alertes, notifications importantes)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">3. Protection des données</h2>
        <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Vos données sont stockées dans un environnement sécurisé et seuls les employés qui ont besoin d&apos;effectuer un travail spécifique ont accès aux informations personnellement identifiables.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">4. Conservation des données</h2>
        <p>Vos données personnelles sont conservées aussi longtemps que votre compte est actif. Vous pouvez demander la suppression complète de votre compte et de vos données associées à tout moment.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">5. Vos droits (RGPD)</h2>
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition concernant vos données personnelles.</p>
        <p>Pour exercer ces droits, vous pouvez nous contacter à l&apos;adresse suivante : rgpd@martinique-explorer.com</p>
      </section>
    </LegalPageLayout>
  );
}
