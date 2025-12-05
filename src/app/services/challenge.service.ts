import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Challenge {
  id: string;
  title: string;
  alternative_name: string;
  description: string;
  category: 'OS' | 'Bureautique' | 'Web' | 'Cloud' | 'Mobile' | 'Mail';
  points: number;
  logo_url?: string;
  benefits?: string[]; // List of benefits/advantages
  youtube_video_id?: string; // YouTube video ID for installation tutorial
  detailed_description?: string; // More detailed explanation
}

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  // Mock data - Replace this with actual API call
  private mockChallenges: Challenge[] = [
    {
      id: '1',
      title: 'Migrer vers Linux',
      alternative_name: 'Ubuntu',
      description:
        'Remplacer Windows par une distribution Linux pour reprendre le contrôle de votre système.',
      category: 'OS',
      points: 50,
      logo_url: '/assets/linux.png',
      benefits: [
        'Gratuit et open-source : Pas de licence coûteuse, liberté totale',
        'Sécurité renforcée : Moins vulnérable aux virus et malwares',
        'Respect de la vie privée : Pas de télémétrie ni de collecte de données',
        'Performance optimale : Système léger et rapide, même sur anciens matériels',
        'Contrôle total : Vous possédez votre système, pas de mises à jour forcées',
        'Communauté active : Support gratuit et documentation abondante',
      ],
      youtube_video_id: 'hNYH7xkdYYQ', // Replace with actual video ID
      detailed_description:
        'Ubuntu est une distribution Linux basée sur Debian, conçue pour être facile à utiliser tout en offrant la puissance et la flexibilité de Linux. Elle offre une alternative complète à Windows, avec un environnement de bureau moderne et intuitif.',
    },
    {
      id: '2',
      title: 'LibreOffice',
      alternative_name: 'LibreOffice',
      description:
        'Abandonner Microsoft Office au profit de LibreOffice, une suite bureautique libre et gratuite.',
      category: 'Bureautique',
      points: 30,
      logo_url: '/assets/libre.png',
      benefits: [
        '100% gratuit : Aucun coût de licence, même pour usage commercial',
        'Compatible : Ouvre et sauvegarde tous les formats Microsoft Office',
        'Fonctionnalités complètes : Traitement de texte, tableur, présentation, base de données',
        'Pas de dépendance cloud : Travaillez hors ligne, vos données restent locales',
        'Open-source : Transparence totale, pas de portes dérobées',
        'Multi-plateforme : Windows, Linux, macOS',
      ],
      youtube_video_id: 'tlBpxbTb6DA', // Replace with actual video ID
      detailed_description:
        'LibreOffice est une suite bureautique complète et gratuite qui rivalise avec Microsoft Office. Elle comprend Writer (traitement de texte), Calc (tableur), Impress (présentations), et bien plus encore.',
    },
    {
      id: '3',
      title: 'Firefox',
      alternative_name: 'Firefox',
      description:
        'Utiliser Firefox comme navigateur principal pour protéger votre vie privée.',
      category: 'Web',
      points: 20,
      logo_url: '/assets/firefox.png',
      benefits: [
        'Vie privée respectée : Blocage de traqueurs par défaut',
        'Open-source : Code source transparent et auditable',
        'Indépendant : Non contrôlé par une grande entreprise',
        "Extensions puissantes : Large écosystème d'add-ons",
        'Rapide et moderne : Performances excellentes, support des standards web',
        'Synchronisation sécurisée : Vos données sont chiffrées',
      ],
      youtube_video_id: '-JuZGgl17ao', // Replace with actual video ID
      detailed_description:
        "Firefox est un navigateur web développé par Mozilla, une organisation à but non lucratif. Il place la vie privée et la liberté de l'utilisateur au centre de ses priorités.",
    },
    {
      id: '4',
      title: 'Nextcloud',
      alternative_name: 'Nextcloud',
      description:
        'Remplacer Google Drive par un cloud personnel chiffré et auto-hébergeable.',
      category: 'Cloud',
      points: 35,
      logo_url: '/assets/Nextcloud.png',
      benefits: [
        'Contrôle total : Vos fichiers restent chez vous ou chez un hébergeur de confiance',
        'Chiffrement : Protection des données au repos et en transit',
        'Collaboration : Partage de fichiers, calendrier, contacts et édition en ligne',
        'Extensions : Écosystème riche d’apps (notes, tâches, photos, etc.)',
        'Multi-plateforme : Clients desktop et mobiles synchronisés',
        'Open-source : Transparence et communauté active',
      ],
      youtube_video_id: '_WsvF5Y5d2I&t=143s',
      detailed_description:
        'Nextcloud offre une alternative souveraine aux services cloud propriétaires, avec synchronisation, partage et collaboration sécurisés.',
    },
    {
      id: '5',
      title: 'GIMP',
      alternative_name: 'GIMP',
      description:
        'Adopter GIMP comme alternative libre à Photoshop pour la retouche et la création graphique.',
      category: 'Bureautique',
      points: 25,
      logo_url: '/assets/GIMP.png',
      benefits: [
        '100% gratuit : Aucune licence à payer',
        'Outils avancés : Calques, masques, filtres et plugins',
        'Open-source : Code auditable et extensible',
        'Formats : Import/export de nombreux formats (PSD inclus)',
        'Personnalisable : Brosses, palettes et scripts',
        'Multi-plateforme : Windows, Linux, macOS',
      ],
      youtube_video_id: 'yBspII9KMA4',
      detailed_description:
        'GIMP est un éditeur d’images open-source puissant qui couvre la plupart des besoins de retouche et de création graphique.',
    },
    {
      id: '6',
      title: 'PostgreSQL',
      alternative_name: 'PostgreSQL',
      description:
        'Passer à PostgreSQL comme base de données relationnelle open-source au lieu d’Oracle Database.',
      category: 'Cloud',
      points: 40,
      logo_url: '/assets/postgresql.png',
      benefits: [
        'Licence libre : Pas de coûts de licence élevés',
        'Fiabilité : Transactions ACID et réplication robuste',
        'Fonctionnalités avancées : JSONB, CTE, fenêtres, extensions',
        'Performance : Optimiseur mature et tuning fin',
        'Sécurité : Rôles, SSL, authentification avancée',
        'Écosystème : Outils et extensions (PostGIS, Timescale, etc.)',
      ],
      youtube_video_id: '4qH-7w5LZsA',
      detailed_description:
        'PostgreSQL est une base de données relationnelle puissante, extensible et conforme aux standards, adaptée aux charges critiques.',
    },
  ];

  // TODO: Replace with actual API call using base44 client
  // Example: return this.http.get<Challenge[]>('/api/challenges');
  getChallenges(): Observable<Challenge[]> {
    // Simulate API delay
    return of(this.mockChallenges).pipe(delay(300));
  }

  // Get a single challenge by ID
  getChallengeById(id: string): Observable<Challenge | undefined> {
    // TODO: Replace with actual API call
    // Example: return this.http.get<Challenge>(`/api/challenges/${id}`);
    const challenge = this.mockChallenges.find((c) => c.id === id);
    return of(challenge).pipe(delay(200));
  }
}
