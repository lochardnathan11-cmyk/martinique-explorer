import { Metadata } from 'next';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — Martinique Explorer",
  description: "Conditions Générales d'Utilisation de la plateforme Martinique Explorer.",
};

export default function CGU() {
  return (
    <LegalPageLayout title="Conditions Générales d'Utilisation (CGU)">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">1. Objet</h2>
        <p>Les présentes Conditions Générales d&apos;Utilisation (CGU) ont pour objet de définir les modalités et conditions dans lesquelles la société Martinique Explorer met à la disposition de ses utilisateurs le site, et les services disponibles sur le site.</p>
        <p>Toute connexion au site est subordonnée au respect des présentes conditions.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">2. Accès au site</h2>
        <p>Le site est accessible gratuitement en tout lieu à tout utilisateur ayant un accès à Internet. Tous les frais supportés par l&apos;utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à sa charge.</p>
        <p>L&apos;utilisateur non membre n&apos;a pas accès aux services réservés (création d&apos;itinéraires, publication d&apos;avis). Pour cela, il doit s&apos;inscrire en remplissant le formulaire.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">3. Contenu publié par l&apos;utilisateur</h2>
        <p>Le site permet aux membres de publier des avis, des commentaires et des photos. Dans ses publications, le membre s&apos;engage à respecter les règles de bonne conduite de l&apos;internet et les règles de droit en vigueur.</p>
        <p>Martinique Explorer se réserve le droit de modérer, modifier ou supprimer tout contenu publié par un utilisateur qui serait jugé inapproprié, diffamatoire ou contraire aux présentes CGU, sans préavis ni justification.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">4. Responsabilité</h2>
        <p>Les informations partagées sur les lieux, conditions météorologiques et recommandations (notamment les conditions de mer et la présence de sargasses) sont fournies à titre indicatif par la communauté et nos algorithmes. Martinique Explorer ne garantit pas l&apos;exactitude absolue de ces informations à un instant T.</p>
        <p>Il est de la responsabilité de l&apos;utilisateur de vérifier les conditions de sécurité sur place avant de s&apos;engager dans une activité (randonnée, baignade, etc.).</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-deep">5. Évolution des conditions générales</h2>
        <p>Martinique Explorer se réserve le droit de modifier les clauses de ces conditions générales d&apos;utilisation à tout moment et sans justification.</p>
      </section>
    </LegalPageLayout>
  );
}
