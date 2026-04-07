/* eslint-disable */
// @ts-nocheck
"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ChevronRight, FileText, Video, X, Info,
  Globe, TrendingUp, Package, Terminal, Users, Target,
  Zap, ExternalLink, ArrowUpRight, Layers, Link as LinkIcon, Presentation,
  ChevronLeft, ChevronRight as ChevronRightIcon, Download, Linkedin, Calendar,
  Lock
} from 'lucide-react';

// --- HELPERS GLOBAUX (Sécurisés pour éviter les erreurs de compilation) ---
const getProofSrc = (proof) => proof.type === 'canva' ? proof.projectLink : encodeURI(`/${proof.folder}/${proof.file}`);
const getCanvaEmbedUrl = (url) => {
  if (!url) return '';
  if (!url.includes('canva.com')) return url; // Supporte la 3D et autres sites
  const embedUrl = url.includes('?embed') ? url : (url.endsWith('/view') ? `${url}?embed` : `${url}&embed`);
  return `${embedUrl}&nav=false&panels=false`;
};

const SkillIcon = ({ name, size = "w-5 h-5" }) => {
  const map = { package: Package, trendingUp: TrendingUp, globe: Globe, terminal: Terminal, target: Target, users: Users };
  const Icon = map[name];
  return Icon ? <Icon className={size} /> : null;
};

// --- DATA ---
const PORTFOLIO_DATA = {
  skills: [
    { 
      id: 'produit', 
      title: " Concevoir et industrialiser des produits innovants", 
      level: 4.5, 
      icon: "package", 
      consistsOf: "Capacité à transformer une vision en produit manufacturé, industrialisé et prêt pour le marché.", 
      subskills: [
        { 
          id: 'branding', 
          name: "1.1 Concevoir une marque et un positionnement différenciant", 
          level: 4.5, 
          consistsOf: " Création d'identité visuelle, packaging et proposition de valeur forte sur des marchés concurrentiels." 
        }, 
        { 
          id: 'industrialisation', 
          name: "1.2 Passer du prototype à la production industrielle", 
          level: 4.7, 
          consistsOf: " Sourcing usine, validation technique, patronnage industriel et suivi qualité." 
        }
      ] 
    },
    { 
      id: 'business', 
      title: " Structurer une offre et générer de la croissance", 
      level: 4.3, 
      icon: "trendingUp", 
      consistsOf: "Structuration d'offres cohérentes et pilotage de la croissance via acquisition et performance.", 
      subskills: [
        { 
          id: 'offre', 
          name: "2.1 Structurer une offre claire et différenciante", 
          level: 4.2, 
          consistsOf: "Définition de proposition de valeur, cohérence produit-marché et structuration commerciale." 
        }, 
        { 
          id: 'acquisition', 
          name: "2.2 Piloter l’acquisition payante et les performances marketing", 
          level: 4.3, 
          consistsOf: "Gestion de campagnes Google Ads et Meta Ads orientées ROI et conversion." 
        }, 
        { 
          id: 'ecommerce', 
          name: "2.3 Lancer, tester et optimiser un e-commerce", 
          level: 4.1, 
          consistsOf: "Validation rapide de marché, ventes internationales et optimisation continue." 
        }
      ] 
    },
    { 
      id: 'supply', 
      title: " Gérer une chaîne d’approvisionnement internationale", 
      level: 4.4, 
      icon: "globe", 
      consistsOf: "Gestion complète du flux mondial : sourcing, production, transport et douanes.", 
      subskills: [
        { 
          id: 'sourcing', 
          name: "3.1 Sourcer, négocier et sécuriser des fournisseurs", 
          level: 4.3, 
          consistsOf: "Identification fournisseurs stratégiques et négociation conditions de production." 
        }, 
        { 
          id: 'logistique', 
          name: "3.2 Gérer transport, douane et stock", 
          level: 4.5, 
          consistsOf: "Organisation transit international, export UE et gestion physique des stocks." 
        }
      ] 
    },
    { 
      id: 'tech', 
      title: " Développer et automatiser des systèmes technologiques", 
      level: 4.6, 
      icon: "terminal", 
      consistsOf: "Conception de logiciels métiers et intégration d’IA pour automatiser les process.", 
      subskills: [
        { 
          id: 'software', 
          name: "4.1 Développer des logiciels métiers internes", 
          level: 4.5, 
          consistsOf: "Développement d’outils métiers (gestion sinistres, affichage vitrine)." 
        }, 
        { 
          id: 'ia', 
          name: "4.2 Automatiser des processus via l’IA", 
          level: 4.7, 
          consistsOf: "Création d’agents IA pour vente, rédaction et optimisation commerciale." 
        }
      ] 
    },
    { 
      id: 'sales', 
      title: " Développer un portefeuille et conclure des ventes", 
      level: 4.1, 
      icon: "target", 
      consistsOf: "Prospection terrain, développement B2B et closing de contrats.", 
      subskills: [
        { 
          id: 'portefeuille', 
          name: "5.1 Développer un portefeuille B2B", 
          level: 4.2, 
          consistsOf: "Démarchage direct, installations réelles et ouverture de marchés." 
        }, 
        { 
          id: 'nego', 
          name: "5.2 Négocier et conclure des contrats", 
          level: 4.0, 
          consistsOf: "Conduite de négociations et signature de mandats ou contrats B2B." 
        }
      ] 
    },
    { 
      id: 'management', 
      title: " Valider et structurer des opportunités entrepreneuriales", 
      level: 4.4, 
      icon: "users", 
      consistsOf: "Détection d’opportunités, validation terrain et structuration d’offres exploitables.", 
      subskills: [
        { 
          id: 'validation', 
          name: "6.1 Tester un marché et obtenir une validation terrain", 
          level: 4.5, 
          consistsOf: "Présentation salon professionnel, installations clients et validation par traction réelle." 
        },
        { 
          id: 'deploiement', 
          name: "6.2 Structurer et déployer une offre sur le marché", 
          level: 4.3, 
          consistsOf: "Packaging, site web, organisation commerciale et mise en marché effective." 
        }
      ] 
    }
  ],
  proofs: [
    // --- PRODUIT : BRANDING ---
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "CHROMA — Identité & Direction Artistique", folder: "chroma", file: "logo chroma.png", type: "image", label: "Logo & Identité Visuelle", caption: "Création de l'identité de marque. Design d'un logo minimaliste reflétant le positionnement premium et la dimension technologique (thermochromique) du produit." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "CHROMA — Identité & Direction Artistique", folder: "chroma", file: "idee charte graphique 1.jpeg", type: "image", label: "Direction Artistique", caption: "Élaboration de l'univers de marque : conception d'une charte graphique dynamique et d'un moodboard pour asseoir la cohérence sur tous les supports." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "CHROMA — Identité & Direction Artistique", folder: "chroma", file: "dimensions veste.png", type: "image", label: "Cahier des Charges (Tech Pack)", caption: "Rédaction des spécifications techniques pour l'usine : définition précise des coupes, mensurations et contraintes de fabrication textile." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "CHROMA — Identité & Direction Artistique", projectLink: "https://www.canva.com/design/DAGcQ-J9Xos/bghCpOkCMo0dagJwm3gACQ/view", type: "canva", label: "Benchmark Stratégique", caption: "Étude de marché approfondie et analyse concurrentielle pour valider le positionnement tarifaire et marketing de l'innovation." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "CHROMA — Identité & Direction Artistique", folder: "chroma", file: "2ieme prix de l etudiant entrepreuners de la promo tc et mmi projet chroma.jpeg", type: "image", label: "Prix Étudiant Entrepreneur", caption: "Obtention du 2ème Prix de ma promotion. Une validation académique formelle du business model et de la pertinence du concept par un jury d'experts." },
    
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "DIGITAG MEMORY — Concept & Packaging", projectLink: "https://digitagmemory.fr", folder: "digitag memory", file: "Photo prototype initial fais main.png", type: "image", label: "Minimum Viable Product (MVP)", caption: "Conception du tout premier prototype artisanal. Une itération physique indispensable pour tester le concept de mémoire connectée avant d'investir en production." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "DIGITAG MEMORY — Concept & Packaging", projectLink: "https://digitagmemory.fr", folder: "digitag memory", file: "packaging fini et reçu.png", type: "image", label: "Design Packaging Industriel", caption: "Passage à l'échelle : sourcing et conception d'un écrin premium industrialisé, pensé pour offrir une expérience d'unboxing forte sur un marché émotionnel." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "REMAX — Design supports physiques", folder: "Remax", file: "photo des portes cles recu .jpeg", type: "image", label: "Merchandising Local (Portes-clés)", caption: "Conception, sourcing et production d'objets publicitaires personnalisés pour renforcer la visibilité et l'ancrage local des agents immobiliers." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "REMAX — Design supports physiques", folder: "Remax", file: "photo sac de course recu.jpeg", type: "image", label: "Merchandising Local (Sacs)", caption: "Déclinaison de l'identité visuelle sur des supports de distribution courante (Tote bags), optimisant la présence de la marque sur le terrain." },
    
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "Projets Académiques", projectLink: "https://www.canva.com/design/DAG7AdZHu28/PgAdCqwlU9W1g4ZDNM2ctA/view", type: "canva", label: "Stratégie de Marque (Veja)", caption: "Audit et recommandations sur la stratégie social media d'une marque internationale engagée." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "Projets Académiques", projectLink: "https://www.canva.com/design/DAGZEHUiy_Y/ZM3fNtnR3snuqxnE9VNjhA/view", type: "canva", label: "Identité Visuelle (SUÈNH)", caption: "Création from scratch d'une charte graphique complète, de la typographie aux éléments de langage." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "Projets Académiques", projectLink: "https://www.canva.com/design/DAF2UL6QMwg/0pzuUz_o6BE3ioGj_bCh2w/view", type: "canva", label: "Stratégie Social Media (TC)", caption: "Refonte de l'identité digitale pour rajeunir l'image et engager une audience étudiante spécifique." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "Projets Académiques", projectLink: "https://www.canva.com/design/DAG1wE1JUC4/L-O9vMTp2KJaZIeGTibAXw/view", type: "canva", label: "Charte Éditoriale", caption: "Définition du Tone of Voice et de la ligne éditoriale globale pour harmoniser la communication externe." },

    // --- PRODUIT : INDUSTRIALISATION ---
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "CHROMA — Prototype → Usine → Produit final", folder: "chroma", file: "Maquette Echantillion n-1.jpg", type: "image", label: "Test des Matériaux", caption: "Analyse et validation physique des textiles réactifs. Étape clé pour s'assurer de la faisabilité technique de l'innovation thermochromique." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "CHROMA — Prototype → Usine → Produit final", folder: "chroma", file: "photo patron tissus.jpeg", type: "image", label: "Patronnage Industriel", caption: "Transformation du design en patron textile normé, prêt à être intégré dans les chaînes de découpe des usines de confection." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "CHROMA — Prototype → Usine → Produit final", folder: "chroma", file: "Image fournisseur 2 veste.jpeg", type: "image", label: "Suivi Fournisseur", caption: "Sourcing international complexe pour un tissu thermochromique rare. Après avoir audité des usines au Portugal, en Espagne, au Pakistan et en Inde, sélection stratégique du seul partenaire technologique qualifié en Chine." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "CHROMA — Prototype → Usine → Produit final", folder: "chroma", file: "vestes chroma finis et porte par moi meme.jpeg", type: "image", label: "Aboutissement Physique", caption: "Le résultat final de plusieurs mois de R&D : la veste CHROMA fabriquée, livrée et prête pour son go-to-market." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "DIGITAG MEMORY — Prototype → Installation", projectLink: "https://digitagmemory.fr", folder: "digitag memory", file: "Photo prototype initial fais main.png", type: "image", label: "Maquette Fonctionnelle", caption: "Validation de la puce NFC et de l'expérience utilisateur (UX) sur un support test avant le lancement de l'outillage industriel." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "DIGITAG MEMORY — Prototype → Installation", projectLink: "https://digitagmemory.github.io/3D/", type: "canva", label: "Modélisation 3D", caption: "Création d'un environnement 3D interactif permettant de valider les proportions et le design du coffret avec les fabricants." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "DIGITAG MEMORY — Prototype → Installation", projectLink: "https://digitagmemory.fr", folder: "digitag memory", file: "Photo plaque installee reelle.jpeg", type: "image", label: "Déploiement sur Site", caption: "Test d'usure en conditions réelles : le produit final installé, prouvant sa résistance aux intempéries (normes extérieures)." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "DIGITAG PRO — Production plaques NFC", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "plaque nfc google facebook instagram tripadvisor chez a l usine chez le fournisseur.png", type: "image", label: "Contrôle Qualité Usine", caption: "Mise en place d'un protocole d'inspection strict (QA) sur la chaîne de production avant expédition de la marchandise." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "DIGITAG PRO — Production plaques NFC", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "plaque nfc google facebook instagram tripadvisor fini.png", type: "image", label: "Lot Finalisé", caption: "Les plaques B2B usinées, programmées et prêtes à être déployées chez les commerçants." },    
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "Projets Académiques", projectLink: "https://www.canva.com/design/DAGy4RH5kPE/wXqGJhTMJA0ISbg9KwRsYA/view", type: "canva", label: "Mapping de Production", caption: "Modélisation systémique des étapes de création, de la protection intellectuelle à la commercialisation d'un produit physique." },

    // --- BUSINESS ---
    { competenceId: "business", subCompetenceId: "offre", projectTitle: "DIGITAG PRO — Structuration Offre B2B", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "capture de mon site web btob digitagpro.fr.png", type: "image", label: "Tunnel de Vente B2B", caption: "Création de l'infrastructure de conversion web : formulation d'une proposition de valeur claire orientée ROI (Référencement Local)." },
    { competenceId: "business", subCompetenceId: "offre", projectTitle: "DIGITAG MEMORY — Proposition Valeur B2C", projectLink: "https://digitagmemory.fr", folder: "digitag memory", file: "capture de mon site marchands digitagmemory.fr.png", type: "image", label: "Expérience E-commerce", caption: "Design d'une boutique en ligne axée sur l'émotion et la rassurance, optimisant le parcours d'achat pour un produit intime." },
    { competenceId: "business", subCompetenceId: "acquisition", projectTitle: "Acquisition B2C — Google Ads", folder: "site internet", file: "tableau example de mes depenses googles ads sur une boutique ecomerce total 2439.06.png", type: "image", label: "Pilotage Budgetaire (2.4k€)", caption: "Gestion concrète de l'acquisition payante (SEA). Allocation d'un budget de 2439€ ayant généré 318 549 impressions" },
    { competenceId: "business", subCompetenceId: "acquisition", projectTitle: "Acquisition B2C — Meta Ads", folder: "site internet", file: "tableau example de mes depenses meta ads sur une boutique ecomerce en testing total 229.90.png", type: "image", label: "Phase de Testing Meta", caption: "Déploiement d'une stratégie de test rapide sur les réseaux sociaux (Meta Ads) pour valider l'attrait produit avant d'injecter des budgets massifs." },
    { competenceId: "business", subCompetenceId: "acquisition", projectTitle: "Boutique Mode — Stratégie d'Acquisition", folder: "site internet", file: "ga4-acquisition-organique.png", type: "image", label: "Fondamentaux SEO & Trafic Qualifié", caption: "Analyse GA4 sur une boutique de moins d'un an. Focus sur l'acquisition payante (Ads) pour la rentabilité immédiate. Le travail de fond SEO (blogs, balises, copywriting) rapporte néanmoins ~10% du trafic avec un taux d'engagement (>50%). Pour rappel technique, un engagement GA4 certifie une session de plus de 10 secondes, un événement de conversion ou au moins deux pages vues : la preuve formelle d'un trafic gratuit ultra-qualifié." },
    { competenceId: "business", subCompetenceId: "ecommerce", projectTitle: "Boutique Mode — Scaling & Trophée", folder: "site internet", file: "trophee 1k club yomi denzel ecomerce.jpeg", type: "image", label: "Trophée 1K Club", caption: "Validation de mes compétences e-commerce (1000€/24h) sur le lancement d'une boutique de vêtements tendance hivernaux. Ciblage saisonnier et optimisation de la conversion." },
    { competenceId: "business", subCompetenceId: "ecommerce", projectTitle: "Boutique Mode — Expansion", folder: "site internet", file: "dashbord stripe de paiments a linternational suisse belgique turquie luxembourg.png", type: "image", label: "Scaling International", caption: "Preuve de traction multi-marchés via le tableau de bord Stripe. Adaptation de l'offre pour générer des ventes en France, Suisse, Belgique, Turquie et Luxembourg." },
    { competenceId: "business", subCompetenceId: "ecommerce", projectTitle: "Projets Académiques", projectLink: "https://www.canva.com/design/DAGfADJ7pK8/1gaH3eVoidephzvcQvKuxA/view", type: "canva", label: "Audit UX/UI (K-Way)", caption: "Analyse des frictions dans le parcours client d'un grand compte e-commerce et propositions de leviers d'optimisation de la conversion (CRO)." },

    // --- SUPPLY ---
    { competenceId: "supply", subCompetenceId: "sourcing", projectTitle: "DIGITAG PRO — Sourcing Industriel", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "plaque nfc google facebook instagram tripadvisor chez a l usine chez le fournisseur.png", type: "image", label: "Sélection d'Usines", caption: "Négociation et sélection de partenaires industriels capables de respecter nos cahiers des charges technologiques et de réduire les coûts de revient." },
    { competenceId: "supply", subCompetenceId: "sourcing", projectTitle: "DIGITAG MEMORY — Contrôle Qualité", folder: "digitag memory", file: "controle du packaging digitag memory avant expedition.JPG", type: "image", label: "Inspection d'Agent", caption: "Missionnement d'agents de sourcing locaux pour effectuer un contrôle qualité rigoureux des packagings à la sortie d'usine, évitant les défauts à l'import." },
    { competenceId: "supply", subCompetenceId: "sourcing", projectTitle: "REMAX — Suivi de Production", folder: "Remax", file: "video production sac de course remax fournisseur.mp4", type: "video", label: "Suivi Ligne de Fabrication", caption: "Supervision vidéo en direct des chaînes d'assemblage pour garantir les délais de production de milliers de goodies destinés aux agences immobilières." },
    { competenceId: "supply", subCompetenceId: "logistique", projectTitle: "DIGITAG MEMORY — Gestion de Flux", folder: "digitag memory", file: "photo stock 50 unités coffret digitag memory.jpeg", type: "image", label: "Importation & Stock", caption: "Organisation du fret aérien, gestion des dédouanements et réception physique d'un premier lot industriel pour constituer le stock de lancement européen." },
    { competenceId: "supply", subCompetenceId: "logistique", projectTitle: "DIGITAG PRO — Transit B2B", folder: "digitag pro", file: "plaques nfc google et instagram envoyer lituanie.png", type: "image", label: "Exportation UE", caption: "Maîtrise de la logistique sortante : expédition et suivi des commandes de plaques connectées vendues à des professionnels jusqu'en Lituanie." },
    { competenceId: "supply", subCompetenceId: "logistique", projectTitle: "DIGITAG PRO — Transit B2B", folder: "digitag pro", file: "stock plaque lituanie.jpeg", type: "image", label: "Gestion Stock Délocalisé", caption: "Organisation et suivi d'un point de stockage délocalisé pour soutenir le développement rapide des opérations commerciales sur le marché balte." },
    { competenceId: "supply", subCompetenceId: "logistique", projectTitle: "REMAX — Réception de Marchandise", folder: "Remax", file: "photo des portes cles recu .jpeg", type: "image", label: "Contrôle Post-Import", caption: "Inventaire et contrôle de conformité lors de la réception des milliers de produits importés avant leur distribution dans le réseau d'agences." },
    { competenceId: "supply", subCompetenceId: "logistique", projectTitle: "REMAX — Réception de Marchandise", folder: "Remax", file: "photo sac de course recu.jpeg", type: "image", label: "Gestion D'approvisionnement", caption: "Sécurisation de la chaîne logistique permettant d'équiper en continu les collaborateurs sur le terrain avec des supports promotionnels conformes." },

    // --- TECH & IA ---
    { competenceId: "tech", subCompetenceId: "software", projectTitle: "REMAX — Ingénierie Logicielle (SaaS)", folder: "Remax", file: "screen du logiciel de gestions dees sinstres.png", type: "image", label: "Développement Full-Stack", caption: "Création d'un SaaS (Software as a Service) métier de gestion de sinistres. Front-end fluide en React.js, API robuste sous Node.js/Express connectée à une base PostgreSQL. Déploiement auto-hébergé via Docker et Coolify sur serveur Debian." },
    { competenceId: "tech", subCompetenceId: "software", projectTitle: "REMAX — Développement Outils Métiers", folder: "Remax", file: "screen du logiciel pour lecran dune agence immobiliere.png", type: "image", label: "Digital Signage Software", caption: "Développement en React.js d'un logiciel de vitrine dynamique, automatisant l'affichage des annonces immobilières en temps réel pour attirer le flux piéton." },
    { competenceId: "tech", subCompetenceId: "ia", projectTitle: "GPTs d'Entreprise — Annonces Immobilières", folder: "Remax", file: "gpt annonce immobiliere.png", type: "image", label: "Agent IA (Prompt Engineering)", caption: "Création d'un assistant IA personnalisé (GPT). Formé avec des directives strictes pour rédiger des annonces immobilières percutantes et conformes aux lois en vigueur." },
    { competenceId: "tech", subCompetenceId: "ia", projectTitle: "GPTs d'Entreprise — Annonces Immobilières", folder: "Remax", file: "gpt annonce immobiliere example de prompte et de resultat.png", type: "image", label: "Gain de Productivité", caption: "Preuve de l'efficacité du GPT : transformation quasi instantanée de quelques notes de terrain en une annonce professionnelle complète, libérant des heures de travail." },
    { competenceId: "tech", subCompetenceId: "ia", projectTitle: "GPTs d'Entreprise — Coaching Commercial", folder: "Remax", file: "gpt Coach d Appels Commerciaux Simulation Prospects screen.png", type: "image", label: "Simulateur d'Appels IA", caption: "Développement d'un agent conversationnel agissant comme un prospect difficile. Utilisé pour l'entraînement intensif des agents à la gestion des objections (Cold Calling)." },

    // --- SALES ---
    { competenceId: "sales", subCompetenceId: "portefeuille", projectTitle: "DIGITAG PRO — Développement Commercial", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "quelques photo de plaques nfc google instagram et tripadvisor chez les clients.png", type: "image", label: "Preuve de Traction B2B", caption: "Résultat concret de la prospection terrain : installations réussies de nos plaques NFC chez de nombreux commerçants locaux. Preuve du Product-Market Fit." },
    { competenceId: "sales", subCompetenceId: "portefeuille", projectTitle: "REMAX — Stratégie d'Acquisition Locale", projectLink: "https://www.canva.com/design/DAG-UrTp4Ik/EMIuPlTXNiORD0yH7osrcw/view", type: "canva", label: "Supports de Démarchage", caption: "Création d'un matériel de prospection (Flyer) ciblé. Optimisation du message pour capter l'attention des propriétaires vendeurs et déclencher des prises de rendez-vous." },
    { competenceId: "sales", subCompetenceId: "nego", projectTitle: "REMAX — Signature de Mandats", folder: "Remax", file: "Logiciel pour saisie de bien pour faire mandat apres visite du bien et accrod avec le prorio .png", type: "image", label: "Closing & Contractualisation", caption: "Conclusion des cycles de vente : utilisation des outils numériques de l'agence pour verrouiller l'accord avec le propriétaire et officialiser la signature du mandat." },
    { competenceId: "sales", subCompetenceId: "portefeuille", projectTitle: "DIGITAG MEMORY — Réseau de Distribution", folder: "digitag memory", file: "screen de mon site digitamemory.com des partenaires qui vendent mon produit.png", type: "image", label: "Partenaires Revendeurs B2B2C", caption: "Mise en place d'une stratégie de distribution physique (B2B2C). Prospection, négociation et closing avec des agences de pompes funèbres pour qu'elles intègrent et distribuent notre solution directement à leurs clients. Preuve de traction forte sur un marché très institutionnel." },
    
    // --- MANAGEMENT ---
    { competenceId: "management", subCompetenceId: "validation", projectTitle: "DIGITAG MEMORY — Événementiel B2B", projectLink: "https://digitagmemory.fr", folder: "digitag memory", file: "badge pour le salon du funeraire.png", type: "image", label: "Accréditation Professionnelle", caption: "Infiltration d'un marché de niche très fermé (le funéraire). Validation de la crédibilité du projet pour exposer et pitcher la solution face aux leaders du secteur." },
    { competenceId: "management", subCompetenceId: "validation", projectTitle: "DIGITAG MEMORY — Événementiel B2B", folder: "digitag memory", file: "salon funeraire photo entree et dans le salon.png", type: "image", label: "Confrontation Terrain (Salon)", caption: "Présence active sur l'événement sectoriel. Une étape fondamentale pour recueillir des retours clients (feedbacks), créer des partenariats et ajuster l'offre finale." },
    { competenceId: "management", subCompetenceId: "deploiement", projectTitle: "DIGITAG PRO — Outils d'Aide à la Vente", projectLink: "/digitag pro/Explication Plaque nfc Avantages.pdf", folder: "digitag pro", file: "Explication Plaque nfc Avantages.jpg", type: "image", label: "Brochure Commerciale Structurée", caption: "Création d'un support d'aide à la vente (Sales Enablement) permettant de vulgariser la technologie NFC et d'expliquer instantanément les bénéfices ROI pour le client.", isPdfButton: true },
    { competenceId: "management", subCompetenceId: "deploiement", projectTitle: "Projets Académiques — Go-To-Market", projectLink: "https://www.canva.com/design/DAGgxxsPT6s/jHajMVYKM8CcYPjAwDSy0Q/view", type: "canva", label: "Stratégie de Lancement", caption: "Exercice de modélisation stratégique : élaboration complète d'un plan de mise en marché (positionnement, réseau de distribution, plan d'action commercial)." },
  ]
};

// ─── MODIFICATION 1 : données des projets Digitag pour la modale ───
const DIGITAG_MEMORY_PROOF = {
  type: "image",
  label: "DIGITAG MEMORY",
  projectTitle: "DIGITAG MEMORY — Concept & Installation",
  caption: "Une memoire connectee et intemporelle : les souvenirs ne s'effacent jamais. / Produit : Plaque NFC installee sur site reel. / Site : digitagmemory.fr",
  projectLink: "https://digitagmemory.fr",
  folder: "digitag memory",
  file: "Photo plaque installee reelle.jpeg",
};

const DIGITAG_PRO_PROOF = {
  type: "image",
  label: "DIGITAG PRO",
  projectTitle: "DIGITAG PRO — Plaques NFC B2B",
  caption: "Plaques NFC Google & reseaux pour acquisition B2B. / Produit : Plaques NFC Google, Facebook, Instagram, Tripadvisor. / Site : digitagpro.fr",
  projectLink: "https://digitagpro.fr",
  folder: "digitag pro",
  file: "photo fournisseurs plaque google.jpeg",
};

const GoldText = ({ children }) => (
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#E8C97A] to-[#C9A84C]">{children}</span>
);

const GaugeLevel = ({ level, max = 5 }) => (
  <div className="flex gap-1.5 h-[3px] w-full max-w-[120px]">
    {Array.from({ length: max }).map((_, i) => (
      <div key={i} className={`h-full flex-grow rounded-full ${i < Math.floor(level) ? 'bg-[#D7B56D]' : i < level ? 'bg-[#D7B56D]/30' : 'bg-white/5'}`} />
    ))}
  </div>
);

const Reveal = ({ children, delay = 0, y = 24 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// --- NAVBAR ---
const Navbar = ({ currentPage, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrolled ? 'bg-[#080808]/90 backdrop-blur-2xl py-4 border-b border-white/[0.04]' : 'py-7'}`}>
      <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
        <button onClick={() => setPage('home')} className="flex items-center gap-2.5 group">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D7B56D] group-hover:scale-150 transition-transform duration-300" />
          <span className="text-[13px] font-black tracking-[0.25em] text-white uppercase">Roman<span className="text-neutral-500 font-light hidden sm:inline"> LAYANI-PUJOL</span></span>
        </button>
        <div className="flex gap-6 md:gap-10 items-center">
          {[['home', 'Accueil'], ['maitrise', 'Compétences'], ['apropos', 'À Propos'], ['contact', 'Contact']].map(([id, label]) => (
            <button key={id} onClick={() => { setPage(id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`text-[10px] uppercase tracking-[0.35em] font-bold transition-all duration-300 ${currentPage === id ? 'text-[#D7B56D]' : 'text-neutral-500 hover:text-neutral-200'}`}>
              {label}
            </button>
          ))}
          {/* BOUTON CV */}
          <a href="/CV_Roman_LAYANI.pdf" target="_blank" rel="noopener noreferrer" 
             className="hidden sm:flex text-[9px] uppercase tracking-[0.2em] font-black text-black bg-[#D7B56D] hover:bg-white px-5 py-2.5 rounded-full transition-colors items-center gap-2 shadow-[0_0_15px_rgba(215,181,109,0.3)]">
            Mon CV <Download size={11} className="mb-0.5" />
          </a>
        </div>
      </div>
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════
// HOME PAGE — 6 SECTIONS
// ═══════════════════════════════════════════════════════════

const ExpandableProject = ({ title, text, link, img, logo, isLong = false }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-[#0f0f0f] border border-white/[0.05] rounded-[32px] p-5 hover:border-[#D7B56D]/30 transition-all duration-500 flex flex-col h-full group">
      
      {/* Container Photo + Logo */}
      <div className="relative mb-6">
        {/* Photo du produit */}
        <div className="relative aspect-[16/10] rounded-[22px] overflow-hidden border border-white/5 bg-black">
          <img 
            src={encodeURI(img)} 
            alt={title} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/90 via-transparent to-transparent opacity-70" />
        </div>

        {/* LOGO FLOTTANT - CADRE REDUIT */}
        <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-[#141414] border border-white/10 rounded-2xl p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.8)] z-20 flex items-center justify-center backdrop-blur-xl group-hover:border-[#D7B56D]/50 transition-colors duration-300">
          <img 
            src={encodeURI(logo)} 
            alt={`Logo ${title}`} 
            className="w-full h-full object-contain" 
          />
        </div>
      </div>

      {/* Reste du texte */}
      <div className="px-2 pt-4 flex flex-col flex-grow relative z-10">
        <strong className="text-white text-base block mb-3 tracking-tight uppercase font-black">{title}</strong>
        
        <div className="flex-grow mb-5 flex flex-col items-start">
          <motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }}>
            <p className={`text-neutral-400 font-light leading-relaxed text-sm ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
              {text}
            </p>
          </motion.div>
          
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-[10px] uppercase font-black tracking-widest text-[#D7B56D]/60 hover:text-[#D7B56D] flex items-center gap-1.5 transition-colors"
            >
              {expanded ? "Réduire" : "Lire la suite"}
              <motion.div animate={{ rotate: expanded ? -90 : 90 }} transition={{ duration: 0.3 }}>
                <ChevronRight size={12} />
              </motion.div>
            </button>
          )}
        </div>

        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase font-black tracking-widest text-white bg-white/5 border border-white/10 px-4 py-2.5 rounded-full hover:bg-[#D7B56D] hover:text-black transition-all flex items-center gap-2 w-fit mt-auto relative z-20">
            Visiter le site <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
};

const Home = ({ setPage, setSelectedProof }) => {

  const featuredProofs = [
  { folder: "chroma", file: "vestes chroma finis et porte par moi meme.jpeg", label: "Veste CHROMA portée", skill: "produit", sub: "industrialisation" },
  { folder: "digitag memory", file: "Photo plaque installee reelle.jpeg", label: "Digitag installée sur site", skill: "produit", sub: "branding" },
  { folder: "digitag pro", file: "plaque nfc google facebook instagram tripadvisor chez a l usine chez le fournisseur.png", label: "Production usine NFC", skill: "produit", sub: "industrialisation" },
  { folder: "site internet", file: "tableau example de mes depenses googles ads sur une boutique ecomerce total 2439.06.png", label: "Dashboard Google Ads", skill: "business", sub: "acquisition" },
  { folder: "digitag memory", file: "badge pour le salon du funeraire.png", label: "Badge Salon Funéraire", skill: "management", sub: "validation" },
  { folder: "Remax", file: "photo sac de course recu.jpeg", label: "Production Sacs RE/MAX", skill: "supply", sub: "logistique" },
];

  const projects = [
    { title: "CHROMA", desc: "Chroma réinvente le vêtement comme une surface vivante qui réagit à son environnement.", img: "/chroma/vestes chroma finis et porte par moi meme.jpeg", tag: "Textile Tech", onClick: () => setPage('maitrise') },
    { title: "DIGITAG MEMORY", desc: "Une mémoire connectée et intemporelle : les souvenirs ne s'effacent jamais.", img: "/digitag memory/Photo plaque installee reelle.jpeg", tag: "NFC · Mémoire", onClick: () => setSelectedProof(DIGITAG_MEMORY_PROOF) },
    { title: "DIGITAG PRO", desc: "Plaques NFC Google & réseaux pour acquisition B2B.", img: "/digitag pro/photo fournisseurs plaque google.jpeg", tag: "B2B · NFC", onClick: () => setSelectedProof(DIGITAG_PRO_PROOF) },
    { title: "REMAX — TECH & IA", desc: "Automatisation, GPT, logiciels internes au service de l'immobilier.", img: "/Remax/screen du logiciel de gestions dees sinstres.png", tag: "Tech · IA", onClick: () => setPage('maitrise') },
  ];

  const systemBlocks = [
    { key: "package", title: "Produit", desc: "Prototype → design → industrialisation", color: "from-amber-900/20" },
    { key: "globe", title: "Supply", desc: "Sourcing → négociation → import/export", color: "from-emerald-900/20" },
    { key: "trendingUp", title: "Acquisition", desc: "Google Ads → Meta Ads → conversion", color: "from-blue-900/20" },
    { key: "terminal", title: "Tech & IA", desc: "Logiciels internes → GPT → automatisation", color: "from-violet-900/20" },
  ];

  return (
    <div className="bg-[#080808] text-white">

      {/* ══════════════════════════════════
          1. HERO — Split Layout Premium
      ══════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Backgrounds */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: 'linear-gradient(#D7B56D 1px, transparent 1px), linear-gradient(90deg, #D7B56D 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#D7B56D]/[0.06] blur-[120px] rounded-full" />
          <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[400px] h-[600px] bg-[#D7B56D]/[0.12] blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 pt-32 pb-20 lg:py-0">
          <div className="grid lg:grid-cols-[60%_40%] gap-8 lg:gap-0 items-center min-h-screen lg:min-h-0 lg:py-32">

            {/* Gauche — Texte (60%) */}
            <div className="flex flex-col items-start">
              <Reveal>
                <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-[#D7B56D]/20 bg-[#D7B56D]/[0.06] backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D7B56D] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D7B56D]">Entrepreneur hybride</span>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="text-[clamp(3rem,7vw,6.5rem)] font-black tracking-[-0.03em] uppercase leading-[0.88] mb-4 text-white">
                  Roman<br />LAYANI-PUJOL
                </h1>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="text-[clamp(1.1rem,2.5vw,1.8rem)] font-light tracking-wide text-neutral-400 mb-2 flex items-center gap-3 flex-wrap">
                  Produit <span className="text-[#D7B56D] font-bold">×</span> Tech <span className="text-[#D7B56D] font-bold">×</span> Acquisition
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="w-24 h-[1.5px] bg-gradient-to-r from-[#D7B56D] to-transparent my-8" />
              </Reveal>

              <Reveal delay={0.25}>
                <div className="space-y-3 mb-12 max-w-[540px]">
                  <p className="text-[1.05rem] md:text-[1.15rem] text-neutral-300 font-light leading-[1.75]">
                    Je développe des produits physiques, je structure leur modèle économique et j'automatise les systèmes qui permettent leur croissance.
                  </p>
                  <p className="text-[0.95rem] text-neutral-500 font-light italic leading-relaxed">
                    De la conception à la production. De la production à la rentabilité.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.35}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPage('maitrise')}
                    className="px-8 py-4 bg-white text-black font-black rounded-full text-[11px] uppercase tracking-[0.25em] hover:bg-[#D7B56D] transition-colors duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.12)]"
                  >
                    Explorer mes compétences
                  </motion.button>
                </div>
              </Reveal>
            </div>

                 {/* Droite — Photo (40%) */}
            <div className="flex justify-center lg:justify-end">
              <Reveal delay={0.2} y={30}>
                
                <div className="relative w-full max-w-[340px] md:max-w-[400px] lg:max-w-[460px]">
                  
                  {/* Halo lumineux derrière la photo */}
                  <div className="absolute -inset-8 bg-[#D7B56D]/15 blur-[70px] rounded-[50px] pointer-events-none" />
                  
                  {/* Conteneur de l'image de profil */}
                  <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 via-transparent to-transparent z-10" />
                    <img
                      src={encodeURI("/Photo pro roman costume 2026.jpeg")}
                      alt="Roman LAYANI-PUJOL"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#D7B56D] font-black">Roman LAYANI-PUJOL</span>
                      <span className="text-[11px] text-white font-light">Entrepreneur Hybride · 2026</span>
                    </div>
                  </div>

                  {/* Étiquette 1 : Scale E-commerce (Haut Gauche) */}
                  <motion.div initial={{ opacity: 0, x: 20, y: 10 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }} className="absolute -left-10 top-10 bg-[#111]/90 backdrop-blur-xl border border-[#D7B56D]/20 rounded-2xl p-4 shadow-2xl z-30">
                    <div className="text-[9px] uppercase tracking-widest text-[#D7B56D] font-black mb-1">E-commerce Scale</div>
                    <div className="text-xl font-black text-white">Trophée 1K Club</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">1 000€ générés en 24h</div>
                  </motion.div>

                  {/* Étiquette 2 : International (Haut Droit) */}
                  <motion.div initial={{ opacity: 0, x: -20, y: 10 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7, duration: 0.8 }} className="absolute -right-10 top-8 bg-[#111]/90 backdrop-blur-xl border border-[#D7B56D]/20 rounded-2xl p-4 shadow-2xl z-30">
                    <div className="text-[9px] uppercase tracking-widest text-[#D7B56D] font-black mb-1">Expansion</div>
                    <div className="text-xl font-black text-white">5+ Pays livrés</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">Ventes réalisées dans ces pays</div>
                  </motion.div>

                  {/* Étiquette 3 : Supply Chain (Milieu Droit) */}
                  <motion.div initial={{ opacity: 0, x: -20, y: 0 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.8 }} className="absolute -right-12 top-[40%] bg-[#111]/90 backdrop-blur-xl border border-[#D7B56D]/20 rounded-2xl p-4 shadow-2xl z-30">
                    <div className="text-[9px] uppercase tracking-widest text-[#D7B56D] font-black mb-1">Supply Chain</div>
                    <div className="text-xl font-black text-white">+2 000 produits</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">Importés d'usines en Asie</div>
                  </motion.div>

                  {/* Étiquette 4 : Traction (Bas Droit) */}
                  <motion.div initial={{ opacity: 0, x: -20, y: -10 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.0, duration: 0.8 }} className="absolute -right-4 bottom-10 bg-[#111]/90 backdrop-blur-xl border border-[#D7B56D]/20 rounded-2xl p-4 shadow-2xl z-30">
                    <div className="text-[9px] uppercase tracking-widest text-[#D7B56D] font-black mb-1">Traction marché</div>
                    <div className="text-2xl font-black text-white">300+ clients</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">100+ B2B · 200+ B2C</div>
                  </motion.div>

                  {/* Étiquette 5 : 2ÈME PRIX RECONNAISSANCE (Milieu Gauche - REMONTÉE) */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20, y: 0 }} 
                    whileInView={{ opacity: 1, x: 0, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: 1.1, duration: 0.8 }} 
                    className="absolute top-[35%] -left-12 bg-[#D7B56D] p-4 rounded-2xl shadow-[0_0_30px_rgba(215,181,109,0.3)] border border-white/20 z-40"
                  >
                    <div className="text-[9px] uppercase tracking-widest text-[#111] font-black mb-1">Reconnaissance</div>
                    <div className="text-lg font-black text-[#111] leading-tight">2ème Prix</div>
                    <div className="text-[9px] text-[#111]/80 font-bold mt-0.5">Étudiant Entrepreneur</div>
                  </motion.div>

                  {/* Étiquette 6 : CLIENTS B2B DÉFILANTS (Bas Gauche) */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20, y: 10 }} 
                    whileInView={{ opacity: 1, x: 0, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: 0.9, duration: 0.8 }} 
                    // J'ai enlevé "overflow-hidden" ici pour que la bulle puisse s'afficher au-dessus
                    className="absolute bottom-[15%] -left-6 bg-[#111]/95 backdrop-blur-xl border border-[#D7B56D]/30 rounded-2xl p-3 shadow-2xl w-52 z-30"
                  >
                    {/* En-tête avec Titre + Icône Info + Bulle (Tooltip) */}
                    <div className="flex items-center justify-center gap-1.5 mb-2 relative group">
                      <div className="text-[8px] uppercase tracking-[0.2em] text-[#D7B56D] font-black">Points de vente équipé</div>
                      
                      {/* Icône Info */}
                      <Info size={10} className="text-neutral-500 cursor-help hover:text-[#D7B56D] transition-colors" />
                      
                      {/* La Bulle d'info (invisible par défaut, visible au survol "group-hover") */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
                        <p className="text-[9px] text-neutral-300 leading-relaxed font-light normal-case tracking-normal text-center">
                          Précision importante : mes solutions équipent des points de vente et agences locales de ces réseaux, et en aucun cas l'ensemble du groupe. Photos disponibles dans mes compétences. (DIGITAG PRO — Développement Commercial)

                        </p>
                        {/* Le petit triangle en bas de la bulle */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0f0f0f] border-b border-r border-white/10 rotate-45" />
                      </div>
                    </div>
                    
                    {/* Le défilement des logos (avec overflow-hidden placé juste ici) */}
                    <div className="flex w-full overflow-hidden relative rounded-lg">
                      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#111] to-transparent z-10 pointer-events-none" />
                      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#111] to-transparent z-10 pointer-events-none" />
                      
                      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 12 }} className="flex gap-3 items-center">
                        {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((num, i) => (
                          <div key={i} className="w-14 h-8 shrink-0 flex items-center justify-center overflow-hidden">
                            <img src={encodeURI(`/logo entrprises clientes/logo ${num}.png`)} alt={`Client ${num}`} className="w-full h-full object-contain scale-[1.4] hover:scale-[1.6] transition-transform duration-300" />
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                    
                </div>
              </Reveal>
            </div>

          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#D7B56D] to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          1.5 APERÇU : À PROPOS
      ══════════════════════════════════ */}
      <section className="py-24 px-8 border-t border-white/[0.04] bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          <Reveal>
            <div className="max-w-3xl">
              <div className="text-[10px] uppercase tracking-[0.4em] text-[#D7B56D] font-black mb-4">Mon Histoire</div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-6">
                Créer de <GoldText>A à Z.</GoldText>
              </h2>
              <p className="text-neutral-400 font-light leading-relaxed text-base md:text-lg">
                L'envie d'entreprendre m'a frappé à 15 ans. Aujourd'hui, j'ai fait le choix assumé d'être un profil "hybride" : concevoir le produit, maîtriser la technologie, et conclure les ventes sur le terrain. 
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setPage('apropos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="whitespace-nowrap px-8 py-5 bg-[#111] border border-[#D7B56D]/30 text-white font-black rounded-full text-[11px] uppercase tracking-[0.25em] hover:bg-[#D7B56D] hover:text-black transition-all duration-300 shadow-xl"
            >
              Découvrir mon parcours <ArrowRight className="inline ml-2 -mt-0.5" size={14} />
            </motion.button>
          </Reveal>
        </div>
      </section>

{/* ══════════════════════════════════
          1.7 GUIDE DE NAVIGATION (UX)
      ══════════════════════════════════ */}
      <section className="py-20 px-8 border-t border-white/[0.04] bg-[#080808]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="mb-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-[#D7B56D] font-black mb-4">Mode d'emploi</div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
                  Comment lire ce <GoldText>Portfolio</GoldText> ?
                </h2>
                <p className="text-neutral-400 font-light max-w-xl">
                  Ce site n'est pas un simple CV, c'est une base de données interactive classée par expertise. Voici comment l'explorer efficacement :
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "L'Accueil (Synthèse)", desc: "Scrollez cette page pour avoir une vue d'ensemble de mes chiffres clés, mon écosystème de travail et les projets que j'ai développés de A à Z.", icon: <Globe size={40} strokeWidth={1} /> },
              { step: "02", title: "Menu Compétences", desc: "Cliquez sur « Compétences » dans le menu. C'est le cœur du site : utilisez la barre de gauche pour naviguer entre mes différentes expertises (Produit, Tech, Sales...).", icon: <Layers size={40} strokeWidth={1} /> },
              { step: "03", title: "Preuves Documentées", desc: "Dans chaque compétence, cliquez sur les cartes pour ouvrir les preuves réelles (PDF, photos usine, maquettes 3D interactives) en plein écran.", icon: <FileText size={40} strokeWidth={1} /> }
            ].map((item, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <div className="bg-[#0f0f0f] border border-white/[0.05] p-8 rounded-[24px] relative overflow-hidden group hover:border-[#D7B56D]/30 transition-all duration-400 h-full flex flex-col">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-[#D7B56D] group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 pointer-events-none">
                    {item.icon}
                  </div>
                  <div className="text-[#D7B56D] font-black text-[10px] tracking-widest uppercase mb-6 bg-[#D7B56D]/10 w-fit px-3 py-1.5 rounded-full border border-[#D7B56D]/20">Étape {item.step}</div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-neutral-200 font-light leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          2. RÉSULTATS CONCRETS
      ══════════════════════════════════ */}
      <section className="py-28 md:py-36 px-8 border-t border-white/[0.04] bg-[#060606]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-[#D7B56D] font-black mb-4">Données réelles · vérifiables</div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                  Résultats <GoldText>concrets</GoldText>
                </h2>
              </div>
              <button onClick={() => setPage('maitrise')} className="text-[10px] uppercase tracking-[0.3em] font-black text-neutral-500 hover:text-[#D7B56D] transition-colors flex items-center gap-2">
                Voir les résultats <ArrowRight size={12} />
              </button>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Carte 1 : Google Ads */}
            <Reveal delay={0.1}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-gradient-to-b from-[#111]/80 to-[#0a0a0a] border border-white/[0.06] hover:border-[#D7B56D]/30 rounded-[28px] p-8 overflow-hidden group transition-all duration-500">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#D7B56D]/[0.04] blur-3xl rounded-full group-hover:bg-[#D7B56D]/[0.08] transition-all duration-700" />
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-[0.35em] font-black text-neutral-500 mb-7 group-hover:text-[#D7B56D] transition-colors">Google Ads</div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">2 439<span className="text-xl text-neutral-600">,06 €</span></div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-10">investis</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                      <span className="text-xs text-neutral-500">Impressions</span>
                      <span className="text-sm font-bold text-white">318 549</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-neutral-500">Clics (CTR)</span>
                      <span className="text-2xl font-black text-[#D7B56D]">8 495 (2.67%)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            {/* Carte 2 : Meta Ads */}
            <Reveal delay={0.15}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-gradient-to-b from-[#111]/80 to-[#0a0a0a] border border-white/[0.06] hover:border-[#D7B56D]/30 rounded-[28px] p-8 overflow-hidden group transition-all duration-500">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#D7B56D]/[0.04] blur-3xl rounded-full" />
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-[0.35em] font-black text-neutral-500 mb-7 group-hover:text-[#D7B56D] transition-colors">Meta Ads <span className="text-neutral-700">(test)</span></div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">229<span className="text-xl text-neutral-600">,90 €</span></div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-10">investis</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                      <span className="text-xs text-neutral-500">CTR</span>
                      <span className="text-2xl font-black text-[#D7B56D]">3,15 %</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-neutral-500">CPC moyen</span>
                      <span className="text-sm font-bold text-white">0,44 €</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            {/* Carte 3 : Ventes Internationales */}
            <Reveal delay={0.2}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-gradient-to-b from-[#111]/80 to-[#0a0a0a] border border-white/[0.06] hover:border-[#D7B56D]/30 rounded-[28px] p-8 overflow-hidden group transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D7B56D]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-[0.35em] font-black text-neutral-500 mb-7 group-hover:text-[#D7B56D] transition-colors">Ventes Internationales</div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-6">Pays livrés</div>
                  <div className="flex flex-col gap-3">
                    {[["🇫🇷", "France"], ["🇨🇭", "Suisse"], ["🇧🇪", "Belgique"], ["🇱🇺", "Luxembourg"], ["🇹🇷", "Turquie"], ["🇱🇹", "Lituanie"]].map(([flag, country], i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                        className="flex items-center gap-4 border-b border-white/[0.04] pb-3 last:border-0 last:pb-0">
                        <span className="text-lg">{flag}</span>
                        <span className="text-sm font-light text-white">{country}</span>
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D7B56D]/60" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Reveal>

            {/* Carte 4 : Traction Marché */}
            <Reveal delay={0.25}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-gradient-to-b from-[#111]/80 to-[#0a0a0a] border border-white/[0.06] hover:border-[#D7B56D]/30 rounded-[28px] p-8 overflow-hidden group transition-all duration-500">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#D7B56D]/[0.04] blur-3xl rounded-full group-hover:bg-[#D7B56D]/[0.08] transition-all duration-700" />
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-[0.35em] font-black text-neutral-500 mb-7 group-hover:text-[#D7B56D] transition-colors">Traction Marché</div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">300<span className="text-xl text-neutral-600">+</span></div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-10">clients générés</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                      <span className="text-xs text-neutral-500">Acquisition B2B</span>
                      <span className="text-sm font-bold text-white">100+ comptes</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-neutral-500">Ventes B2C</span>
                      <span className="text-2xl font-black text-[#D7B56D]">200+ clients</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            {/* Carte 5 : Supply Chain */}
            <Reveal delay={0.3}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-gradient-to-b from-[#111]/80 to-[#0a0a0a] border border-white/[0.06] hover:border-[#D7B56D]/30 rounded-[28px] p-8 overflow-hidden group transition-all duration-500">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#D7B56D]/[0.04] blur-3xl rounded-full" />
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-[0.35em] font-black text-neutral-500 mb-7 group-hover:text-[#D7B56D] transition-colors">Supply Chain</div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">2 000<span className="text-xl text-neutral-600">+</span></div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-10">Unités importées</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                      <span className="text-xs text-neutral-500">Sourcing</span>
                      <span className="text-sm font-bold text-white">Fournisseurs Asie</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-neutral-500">Gestion</span>
                      <span className="text-sm font-bold text-[#D7B56D]">Transit & Douane</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            {/* Carte 6 : Innovation & Prix */}
            <Reveal delay={0.35}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-gradient-to-b from-[#111]/80 to-[#0a0a0a] border border-white/[0.06] hover:border-[#D7B56D]/30 rounded-[28px] p-8 overflow-hidden group transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D7B56D]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-[0.35em] font-black text-neutral-500 mb-7 group-hover:text-[#D7B56D] transition-colors">Reconnaissance</div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">2<span className="text-xl text-neutral-600">ème</span></div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-10">Prix étudiant entrepreneur</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                      <span className="text-xs text-neutral-500">Projet</span>
                      <span className="text-sm font-bold text-white">CHROMA (Textile Tech)</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-neutral-500">Validation</span>
                      <span className="text-sm font-bold text-[#D7B56D]">Jury Professionnel</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          2.5 BANDEAU PARTENAIRES B2B
      ══════════════════════════════════ */}
      <section className="py-16 border-t border-white/[0.04] bg-[#0a0a0a] overflow-hidden flex flex-col items-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#D7B56D] font-black mb-10 text-center">Ils font confiance à mes solutions</div>
        <div className="flex w-full relative max-w-[100vw]">
          {/* Gradients pour fondre les bords dans le noir */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

          {/* Animation de défilement infini */}
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            className="flex items-center gap-16 md:gap-24 px-8 whitespace-nowrap"
          >
            {/* On répète la liste pour que la boucle soit infinie et sans coupure */}
            {["RENAULT", "SPORT 2000", "INTERSPORT", "BARBOUR", "RE/MAX", "RENAULT", "SPORT 2000", "INTERSPORT", "BARBOUR", "RE/MAX", "RENAULT", "SPORT 2000", "INTERSPORT", "BARBOUR", "RE/MAX"].map((brand, i) => (
              <span key={i} className="text-4xl md:text-5xl font-black text-neutral-800 uppercase tracking-tighter hover:text-[#D7B56D] transition-colors duration-400 cursor-default">
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          3. MON SYSTÈME
      ══════════════════════════════════ */}
      <section className="py-28 md:py-36 px-8 border-t border-white/[0.04] bg-[#080808]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="mb-16">
              <div className="text-[10px] uppercase tracking-[0.4em] text-[#D7B56D] font-black mb-4">Architecture complète</div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                Un système complet,<br />pas juste des idées.
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemBlocks.map((block, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => setPage('maitrise')}
                  className={`relative bg-gradient-to-b ${block.color} to-[#0d0d0d] border border-white/[0.06] hover:border-[#D7B56D]/35 rounded-[24px] p-8 cursor-pointer group overflow-hidden transition-all duration-400`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D7B56D]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#D7B56D] mb-7 group-hover:bg-[#D7B56D]/15 group-hover:border-[#D7B56D]/30 transition-all duration-400">
                      <SkillIcon name={block.key} />
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight text-white mb-3">{block.title}</h4>
                    <p className="text-sm text-neutral-300 font-light leading-relaxed group-hover:text-white transition-colors">{block.desc}</p>
                    <div className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 group-hover:text-[#D7B56D] transition-colors">
                      <span>Explorer</span>
                      <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          4. PROJETS PHARES
      ══════════════════════════════════ */}
      <section className="py-28 md:py-36 px-8 border-t border-white/[0.04] bg-[#060606]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="max-w-6xl mb-16">
              <div className="text-[10px] uppercase tracking-[0.4em] text-[#D7B56D] font-black mb-4">L'écosystème de mes entreprises</div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-12">
                Projets <GoldText>fondateurs</GoldText>
              </h2>
              
              {/* 3 Colonnes d'explications dynamiques */}
              <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-sm text-neutral-400 font-light leading-relaxed">
                
                <ExpandableProject 
    title="DIGITAG PRO" 
    isLong={true}
    img="/digitag pro/digitag pro.png"
    logo="/digitag pro/Logo_DIGITAGPRO-removebg.png"
    link="https://digitagpro.fr"
    text="Acquisition B2B et digitalisation. Plaques NFC et QR premium destinées aux indépendants et réseaux de franchises. Un simple scan booste la collecte d'avis Google ou intègre des outils métiers (prises de RDV, vCard...). Pour offrir des solutions de A à Z, je complète le matériel par des logiciels/SaaS sur mesure. Par exemple : coupler les plaques à un tableau de bord centralisé permettant au siège de gérer l'e-réputation et d'analyser les KPIs terrain en temps réel."
  />

  <ExpandableProject 
    title="DIGITAG MEMORY" 
    isLong={true}
    img="/digitag memory/digitag memory.png"
    logo="/digitag memory/Logo Digitag Memory blanc.png"
    link="https://digitagmemory.fr"
    text="Innovation dans le secteur funéraire. Création de plaques mémorielles connectées (NFC/QR) pour monuments funéraires, reliées à une application web sur mesure. Un simple scan donne un accès instantané à un espace d'hommage interactif. La famille peut y consulter la biographie du défunt et recueillir des souvenirs collaboratifs (photos, messages) dans un environnement strictement sécurisé (serveurs en France, modération intégrée). Stratégie hybride : vente directe en ligne (B2C) et distribution via des pompes funèbres partenaires (B2B2C)."
  />

  <ExpandableProject 
    title="CHROMA" 
    isLong={false}
    img="/chroma/chroma.jpeg"
    logo="/chroma/logo chroma.png"
    link={null}
    text="Textile Tech. Création d'une marque de vêtements thermochromiques (qui réagissent à la chaleur). Gestion de A à Z : du R&D matériel jusqu'au sourcing usine et à la production industrielle en Asie. Projet récompensé par un 2ème Prix de l'Étudiant Entrepreneur."
  />

              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          5. PREUVES EN VEDETTE
      ══════════════════════════════════ */}
      <section className="py-28 md:py-36 px-8 border-t border-white/[0.04] bg-[#080808]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-[#D7B56D] font-black mb-4">Documentation réelle</div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                  Des preuves,<br />pas des promesses.
                </h2>
              </div>
              <button onClick={() => setPage('maitrise')} className="text-[10px] uppercase tracking-[0.3em] font-black text-neutral-500 hover:text-[#D7B56D] transition-colors flex items-center gap-2">
                Voir toutes les preuves <ArrowRight size={12} />
              </button>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featuredProofs.map((p, i) => (
  <Reveal key={i} delay={i * 0.06}>
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => {
        window.scrollTo(0, 0); // Remonte en haut
        setPage('maitrise');   // Change de page
      }}
      className="relative aspect-[4/3] rounded-[20px] overflow-hidden cursor-pointer group border border-white/[0.05] hover:border-[#D7B56D]/30 transition-all duration-400 bg-[#0f0f0f]"
    >
      <img
        src={encodeURI(`/${p.folder}/${p.file}`)}
        alt={p.label}
        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5">
        <p className="text-[11px] font-black text-white uppercase tracking-wide leading-tight">{p.label}</p>
      </div>
    </motion.div>
  </Reveal>
          ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          6. CTA FINAL
      ══════════════════════════════════ */}
      <section className="py-40 md:py-56 px-8 border-t border-white/[0.04] bg-[#060606] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[700px] h-[400px] bg-[#D7B56D]/[0.06] blur-[120px] rounded-full" />
        </div>
        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <Reveal>
            <div className="text-[10px] uppercase tracking-[0.5em] text-[#D7B56D] font-black mb-8">Travaillons ensemble</div>
            <h2 className="text-4xl md:text-6xl lg:text-[5.5rem] font-black uppercase tracking-tighter leading-[0.92] text-white mb-16">
              Vous cherchez quelqu'un<br />capable de structurer<br />un projet de <GoldText>A à Z</GoldText> ?
            </h2>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#D7B56D]/40 to-transparent mx-auto mb-12" />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPage('contact')}
              className="inline-flex items-center gap-4 px-12 py-5 bg-white text-black font-black rounded-full text-[11px] uppercase tracking-[0.3em] hover:bg-[#D7B56D] transition-colors duration-300 shadow-[0_10px_50px_rgba(255,255,255,0.1)]"
            >
              Me contacter <ArrowRight size={14} />
            </motion.button>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// A PROPOS PAGE
// ═══════════════════════════════════════════════════════════
const Apropos = () => {
  return (
    <div className="bg-[#080808] text-white min-h-screen pt-32 pb-40 px-8">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-20">
            <div className="text-[10px] uppercase tracking-[0.5em] text-[#D7B56D] font-black mb-6">Mon Parcours</div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.85]">
              De l'idée à <GoldText>l'exécution</GoldText>
            </h1>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24 items-start">
          {/* Texte À propos */}
          <Reveal delay={0.1}>
            <div className="space-y-6 text-neutral-400 font-light leading-relaxed text-sm md:text-base bg-[#0f0f0f] p-8 md:p-10 rounded-[32px] border border-white/[0.05]">
              <p>
                L'envie d'entreprendre m'a frappé à 15 ans. Je voulais comprendre comment générer de la valeur par moi-même. J'ai lancé mes premiers sites e-commerce très tôt, ce qui m'a poussé à me former sérieusement pour atteindre la rentabilité et décrocher le trophée des 1000€ générés en 24h dès mes 17 ans.
              </p>
              <p>
                Aujourd'hui, à 20 ans et en dernière année de <strong className="text-white font-bold">BUT Techniques de Commercialisation</strong>, j'ai fait le choix assumé d'être un profil "hybride".
              </p>
              <p>
                Pourquoi ? Parce que ce qui m'anime, c'est de tout maîtriser : la technologie, la création physique du produit, son image de marque, jusqu'à sa vente sur le terrain. Je ne veux pas juste avoir une idée, je veux avoir la capacité technique et commerciale de la matérialiser.
              </p>
            </div>
          </Reveal>

          {/* Timeline */}
          <div className="relative pl-4 md:pl-8 border-l border-white/[0.05] space-y-12 mt-8 lg:mt-0">
            {[
              { year: "2021 - 2023", title: "L'école du E-commerce", desc: "Lancement de mes premiers sites à 15 ans, formation intensive et obtention du Trophée 1K Club à 17 ans." },
              { year: "2023 - 2024", title: "L'offensive B2B (Digitag Pro)", desc: "Lancement de Digitag Pro en 1ère année de BUT. Déploiement de solutions NFC et première vraie confrontation au terrain B2B." },
              { year: "2024 - 2025", title: "R&D & Reconnaissance (Chroma)", desc: "Développement d'une marque textile tech de A à Z. Obtention du 2ème Prix de l'Étudiant Entrepreneur de ma promotion." },
              { year: "2025 - 2026", title: "Alternance Tech & Sales (REMAX)", desc: "Intégration en alternance : création de logiciels métiers et d'agents IA pour automatiser les processus commerciaux." },
              { year: "Début 2026", title: "L'aboutissement (Digitag Memory)", desc: "Lancement officiel après presque 1 an de travail sur l'écosystème complet (produit, branding, application)." }
            ].map((item, i) => (
              <Reveal key={i} delay={0.2 + (i * 0.1)}>
                <div className="relative group">
                  <div className="absolute -left-[21px] md:-left-[37px] top-1.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-[#080808] border-2 border-[#D7B56D] rounded-full group-hover:scale-150 group-hover:bg-[#D7B56D] transition-all duration-300 shadow-[0_0_10px_rgba(215,181,109,0.5)]" />
                  <div className="text-[10px] text-[#D7B56D] font-black uppercase tracking-widest mb-1">{item.year}</div>
                  <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-2">{item.title}</h4>
                  <p className="text-sm text-neutral-300 font-light leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MASTERY LAYOUT
// ═══════════════════════════════════════════════════════════
const MasteryLayout = () => {
  const [activeComp, setActiveComp] = useState(PORTFOLIO_DATA.skills[0].id);
  const [activeSub, setActiveSub] = useState(null);
  const [selectedProof, setSelectedProof] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentComp = PORTFOLIO_DATA.skills.find(s => s.id === activeComp);

  const groupedProofs = useMemo(() => {
    if (!activeSub) return {};
    const filtered = PORTFOLIO_DATA.proofs.filter(p => p.subCompetenceId === activeSub);
    const groups = {};
    filtered.forEach(p => {
      if (!groups[p.projectTitle]) groups[p.projectTitle] = { title: p.projectTitle, objective: p.projectObjective, link: p.projectLink, items: [] };
      groups[p.projectTitle].items.push(p);
    });
    return groups;
  }, [activeSub]);

  const renderAccordion = (isMobile = false) => (
    <div className="space-y-3">
      {PORTFOLIO_DATA.skills.map(skill => (
        <div key={skill.id} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden">
          <button
            onClick={() => { if (activeComp !== skill.id) { setActiveComp(skill.id); setActiveSub(null); } else { setActiveSub(null); if (isMobile) setIsMobileMenuOpen(false); }}}
            className={`w-full flex items-center justify-between p-5 transition-all duration-300 ${activeComp === skill.id ? 'bg-[#111] border-b border-[#D7B56D]/20 text-white' : 'hover:bg-white/[0.03] text-neutral-500'}`}
          >
            <div className="flex items-center gap-3 flex-grow pr-4">
              <div className={activeComp === skill.id ? 'text-[#D7B56D]' : 'text-neutral-700'}><SkillIcon name={skill.icon} /></div>
              <span className="text-[11px] font-black uppercase tracking-widest text-left leading-tight">{skill.title.split(' ').slice(1).join(' ')}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[10px] font-black text-[#D7B56D] bg-[#D7B56D]/10 px-2 py-1 rounded">{skill.level}/5</span>
              <ChevronRight size={14} className={`transition-transform duration-300 ${activeComp === skill.id ? 'rotate-90 text-[#D7B56D]' : 'text-neutral-700'}`} />
            </div>
          </button>
          <AnimatePresence>
            {activeComp === skill.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden bg-[#0f0f0f]">
                <div className="p-3 space-y-1">
                  {skill.subskills.map(sub => (
                    <button key={sub.id} onClick={() => { setActiveSub(sub.id); if (isMobile) setIsMobileMenuOpen(false); document.getElementById('titre-competence')?.scrollIntoView({ behavior: 'smooth' }); }}
                      className={`w-full text-left py-3 px-4 rounded-xl text-[11px] font-bold tracking-wide transition-all flex items-center justify-between ${activeSub === sub.id ? 'bg-[#D7B56D]/10 text-[#D7B56D]' : 'text-neutral-300 hover:text-white hover:bg-white/[0.04]'}`}>
                      <span className="pr-4">{sub.name}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${activeSub === sub.id ? 'text-[#D7B56D] bg-black/40' : 'text-neutral-700 bg-white/[0.04]'}`}>{sub.level}/5</span>
                        {activeSub === sub.id && <div className="w-1.5 h-1.5 rounded-full bg-[#D7B56D]" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#080808] text-white min-h-screen pt-28 pb-40 px-6 md:px-12">
      <div className="max-w-[1500px] mx-auto">
        <header className="hidden lg:block mb-16">
          <Reveal>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">MES <br /><GoldText>COMPÉTENCES</GoldText></h1>
          </Reveal>
        </header>

        <div className="lg:hidden sticky top-[72px] z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-white/[0.04] py-4 mb-8 -mx-6 px-6">
          <button onClick={() => setIsMobileMenuOpen(true)}
            className="w-full flex items-center justify-between p-4 bg-[#111] border border-[#D7B56D]/25 rounded-2xl">
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-black text-[#D7B56D] tracking-widest mb-1">Menu expert</span>
              <span className="text-xs font-black text-white truncate max-w-[250px]">
                {activeSub ? currentComp.subskills.find(s => s.id === activeSub).name : currentComp.title}
              </span>
            </div>
            <Layers size={16} className="text-[#D7B56D]" />
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[200] bg-[#080808] p-6 pt-24 overflow-y-auto lg:hidden">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/[0.05]">
                <div className="text-[10px] uppercase font-black tracking-[0.4em] text-[#D7B56D] flex items-center gap-2"><Layers size={14} /> Menu & Scores</div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/[0.04] rounded-full"><X size={16} /></button>
              </div>
              {renderAccordion(true)}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-[380px_1fr] gap-12 lg:gap-16 items-start">
          <div className="hidden lg:block lg:sticky lg:top-32">
            <div className="text-[10px] uppercase font-black tracking-[0.4em] text-neutral-600 mb-5 flex items-center gap-2">
              <Layers size={13} className="text-[#D7B56D]" /> Navigation
            </div>
            {renderAccordion(false)}
          </div>

          <div id="titre-competence" className="space-y-10 scroll-mt-32">
            <AnimatePresence mode="wait">
              {!activeSub && (
                <motion.div key={`overview-${activeComp}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-[#0f0f0f] p-8 md:p-12 rounded-[36px] border border-white/[0.05] relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.015] scale-[4] rotate-12 pointer-events-none text-[#D7B56D]">
                    <SkillIcon name={currentComp.icon} size="w-8 h-8" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#D7B56D] mb-6"><Zap size={13} /> Vue d'ensemble</div>
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-5">{currentComp.title}</h2>
                    <p className="text-base md:text-lg text-neutral-200 font-light leading-relaxed max-w-3xl mb-10">{currentComp.consistsOf}</p>
                    <div className="bg-black/60 p-5 rounded-2xl border border-white/[0.04] inline-block min-w-[180px] mb-10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Note</span>
                        <span className="text-xl font-black text-[#D7B56D]">{currentComp.level}<span className="text-sm text-neutral-700">/5</span></span>
                      </div>
                      <GaugeLevel level={currentComp.level} />
                    </div>
                    <div className="border-t border-white/[0.05] pt-7">
                      <h4 className="text-[10px] uppercase font-black text-neutral-600 tracking-widest mb-4">Sous-compétences :</h4>
                      <div className="flex flex-wrap gap-3">
                        {currentComp.subskills.map(sub => (
                          <button key={sub.id} onClick={() => setActiveSub(sub.id)}
                            className="px-5 py-2.5 rounded-full border border-white/[0.08] text-xs font-bold text-neutral-300 hover:text-white hover:border-[#D7B56D]/40 transition-all flex items-center gap-3">
                            {sub.name}
                            <span className="text-[#D7B56D] font-mono text-[9px] bg-[#D7B56D]/10 px-1.5 py-0.5 rounded">{sub.level}/5</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSub && (
                <motion.div key={`detail-${activeSub}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                  <div className="bg-[#0f0f0f] p-8 md:p-12 rounded-[36px] border border-white/[0.05] flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-5">
                        <span className="text-neutral-600">{currentComp.title.split(' ').slice(1).join(' ')}</span>
                        <ChevronRight size={10} className="text-[#D7B56D]" />
                        <span className="text-[#D7B56D]">Analyse & Preuves</span>
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4">{currentComp.subskills.find(s => s.id === activeSub).name}</h3>
                      <p className="text-base text-neutral-400 font-light leading-relaxed max-w-2xl">{currentComp.subskills.find(s => s.id === activeSub).consistsOf}</p>
                    </div>
                    <div className="bg-black/60 p-5 rounded-2xl border border-[#D7B56D]/15 min-w-[140px] text-center shrink-0">
                      <div className="text-[10px] font-black text-[#D7B56D] uppercase tracking-widest mb-2">Note</div>
                      <div className="text-4xl font-black">{currentComp.subskills.find(s => s.id === activeSub).level}<span className="text-lg text-neutral-700">/5</span></div>
                    </div>
                  </div>

                  <div className="space-y-20">
                    {Object.keys(groupedProofs).length > 0 ? Object.values(groupedProofs).map((projectData, idx) => (
                      <div key={projectData.title}>
                        <div className="mb-7 border-b border-white/[0.05] pb-5">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                            <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
                              <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.08] flex shrink-0 items-center justify-center text-[10px] text-[#D7B56D]">0{idx + 1}</div>
                              {projectData.title}
                            </h4>
                            {projectData.link && (projectData.link === 'https://digitagpro.fr' || projectData.link === 'https://digitagmemory.fr') && (
  <a href={projectData.link} target="_blank" rel="noopener noreferrer"
    className="text-[10px] flex shrink-0 items-center gap-2 text-[#D7B56D] border border-[#D7B56D]/25 rounded-full px-4 py-2 hover:bg-[#D7B56D] hover:text-black transition-all">
    Voir le site <LinkIcon size={11} />
  </a>
)}
                          </div>
                          {projectData.objective && <p className="text-sm text-neutral-500 italic md:ml-11 border-l-2 border-[#D7B56D]/20 pl-4">{projectData.objective}</p>}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-5 md:ml-11">
                          {projectData.items.map(p => (
                            <motion.div 
                              key={p.file || p.projectLink} 
                              whileHover={{ y: -4 }} 
                              onClick={() => setSelectedProof(p)}
                              className="group bg-[#0f0f0f] border border-white/[0.05] rounded-[24px] overflow-hidden cursor-pointer hover:border-[#D7B56D]/30 transition-all duration-400 flex flex-col">
                              
                              <div className="aspect-[16/9] bg-black relative flex items-center justify-center overflow-hidden">
                                
                                {p.type === 'image' ? (
  <img src={getProofSrc(p)} alt={p.label} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
) : p.type === 'video' ? (
  <>
    <video src={getProofSrc(p)} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" preload="metadata" muted playsInline />
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="w-12 h-12 rounded-full bg-black/60 border border-white/10 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:border-[#D7B56D]/50 transition-all duration-300">
        <Video size={20} className="text-[#D7B56D]" />
      </div>
    </div>
  </>
) : p.type === 'canva' ? (
  <iframe
    src={getCanvaEmbedUrl(p.projectLink || '')}
    title={p.label || "Document Canva"}
    className="absolute inset-0 w-full h-full border-0 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500"
    allowFullScreen
    loading="lazy"
  />
) : (
  <div className="opacity-20 group-hover:opacity-80 transition-all duration-500 text-[#D7B56D]">
    <FileText size={48} />
  </div>
)}

                                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-90 z-10 pointer-events-none" />
                                <div className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-[#D7B56D] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 pointer-events-none">
                                  <ArrowUpRight size={14} />
                                </div>
                                <div className="absolute bottom-5 left-5 z-20 pointer-events-none">
                                  <h5 className="text-base font-black leading-tight text-white drop-shadow-md">{p.label}</h5>
                                </div>
                              </div>
                              
                              <div className="p-5 flex-grow flex flex-col justify-center">
                                <p className="text-xs leading-relaxed text-neutral-300 group-hover:text-white transition-colors font-light">{p.caption}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )) : (
                      <div className="py-24 text-center border border-white/[0.04] border-dashed rounded-[32px] opacity-30">
                        <p className="text-neutral-600 font-mono text-sm uppercase tracking-widest">Aucune archive indexée.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Lightbox selectedProof={selectedProof} setSelectedProof={setSelectedProof} />
    </div>
  );
};

// ─── MODIFICATION 3 : Lightbox extraite en composant avec navigation Canva ───
const Lightbox = ({ selectedProof, setSelectedProof }) => {
  const iframeRef = useRef(null);

  if (!selectedProof) return null;

  return (
    <AnimatePresence>
      {selectedProof && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12"
          onClick={() => setSelectedProof(null)}>
          <motion.div initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="max-w-6xl w-full bg-[#0f0f0f] rounded-[40px] overflow-hidden border border-white/[0.08] shadow-[0_40px_120px_rgba(0,0,0,0.9)] flex flex-col lg:flex-row"
            onClick={e => e.stopPropagation()}>

            {/* Zone média */}
            <div className="bg-black flex flex-col items-center justify-center relative group lg:w-1/2 min-h-[280px] lg:min-h-[520px]">
              {selectedProof.type === 'image' ? (
  <img
    src={getProofSrc(selectedProof)}
    alt={selectedProof.label}
    className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700"
  />
) : selectedProof.type === 'video' ? (
  <video 
    src={getProofSrc(selectedProof)} 
    controls 
    autoPlay 
    className="absolute inset-0 w-full h-full object-contain p-6 rounded-[32px]" 
  />
) : selectedProof.type === 'canva' ? (
  <div className="absolute inset-0 w-full h-full flex flex-col">
    <iframe
      ref={iframeRef}
      src={getCanvaEmbedUrl(selectedProof.projectLink || '')}
      className="w-full flex-1 border-0"
      allowFullScreen
      title={selectedProof.label || "Document Canva"}
      loading="lazy"
      style={{ minHeight: 0 }}
    />
  </div>
) : (
  <div className="text-[#D7B56D]">
    <FileText className="w-28 h-28" />
  </div>
)}

              {/* Bouton dynamique : Voir le site / Ouvrir le PDF / Agrandir l'image */}
              {selectedProof.type !== 'canva' && (
                <div className="absolute bottom-6 flex flex-col items-center gap-3 z-50">
                  {selectedProof.isWebsite ? (
                    <button onClick={() => window.open(selectedProof.projectLink, '_blank')}
                      className="px-8 py-3 bg-white text-black font-black rounded-full text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#D7B56D] transition-colors shadow-xl">
                      Voir le site <ExternalLink size={13} />
                    </button>
                  ) : selectedProof.isPdfButton ? (
                    <button onClick={() => window.open(encodeURI(selectedProof.projectLink), '_blank')}
                      className="px-8 py-3 bg-white text-black font-black rounded-full text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#D7B56D] transition-colors shadow-xl">
                      Ouvrir le PDF <FileText size={13} />
                    </button>
                  ) : (
                    <button onClick={() => window.open(getProofSrc(selectedProof), '_blank')}
                      className="px-8 py-3 bg-white text-black font-black rounded-full text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#D7B56D] transition-colors shadow-xl">
                      Agrandir l'image <ExternalLink size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Zone texte */}
            <div className="p-8 lg:p-14 flex flex-col justify-center lg:w-1/2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#D7B56D] animate-pulse" />
                <div className="text-[10px] font-black text-[#D7B56D] uppercase tracking-[0.4em]">Preuve Concrète</div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-5 tracking-tighter">{selectedProof.label}</h2>
              <div className="text-sm text-neutral-500 uppercase tracking-widest mb-8 pb-6 border-b border-white/[0.06]">
                Projet : <span className="text-white">{selectedProof.projectTitle.split('—')[0]}</span>
              </div>
              <div className="space-y-6">
                {selectedProof.caption.split(' / ').map((c, i) => {
                  const parts = c.split(' : ');
                  if (parts.length < 2) return <div key={i} className="border-l-2 border-white/10 pl-5"><p className="text-white font-light leading-relaxed">{c}</p></div>;
                  return (
                    <div key={i} className="border-l-2 border-[#D7B56D]/25 pl-5 hover:border-[#D7B56D] transition-colors">
                      <div className="text-[9px] uppercase font-black text-neutral-600 mb-1.5 tracking-[0.2em]">{parts[0]}</div>
                      <p className="text-white font-light leading-relaxed">{parts[1]}</p>
                    </div>
                  );
                })}
              </div>

              {/* Lien externe pour Canva (optionnel, discret) */}
              {selectedProof.type === 'canva' && selectedProof.projectLink && (
                <a href={selectedProof.projectLink} target="_blank" rel="noopener noreferrer"
                  className="mt-8 text-[10px] font-black text-neutral-600 hover:text-[#D7B56D] uppercase tracking-[0.3em] flex items-center gap-2 transition-colors">
                  Ouvrir dans Canva <ExternalLink size={11} />
                </a>
              )}

              <button onClick={() => setSelectedProof(null)}
                className="mt-12 text-[10px] font-black text-neutral-600 hover:text-white uppercase tracking-[0.4em] flex items-center gap-3 transition-all">
                <X size={13} /> Fermer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ═══════════════════════════════════════════════════════════
// CONTACT (Formulaire sur-mesure connecté à Google Forms)
// ═══════════════════════════════════════════════════════════
const Contact = () => {
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    const form = e.target;
    const formData = new FormData(form);
    
    // LA CORRECTION EST ICI : On convertit les données pour que Google les comprenne
    const searchParams = new URLSearchParams();
    for (const pair of formData.entries()) {
      searchParams.append(pair[0], pair[1]);
    }

    try {
      await fetch('https://docs.google.com/forms/d/e/1FAIpQLSfx8raubC6Sqt6hLv1cDhX9WXk5ZletFaqkNIZDTz5c0l8O7A/formResponse', {
        method: 'POST',
        mode: 'no-cors', // Crucial pour contourner les sécurités Google
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: searchParams // On envoie les données converties
      });
      
      setStatus('success');
      form.reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-[#080808] min-h-screen flex items-center justify-center px-6 md:px-8 py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[400px] bg-[#D7B56D]/[0.05] blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[1200px] w-full mx-auto relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        
        {/* Colonne Gauche : Texte */}
        <div className="pt-10">
          <div className="text-[10px] uppercase tracking-[0.5em] text-[#D7B56D] font-black mb-6">Prenons contact</div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase leading-[0.85]">
            <GoldText>PARLONS</GoldText><br />BUSINESS.
          </h1>
          <p className="text-lg text-neutral-400 font-light mb-12 leading-relaxed">
            Une opportunité professionnelle, un projet de collaboration, ou simplement l'envie d'échanger sur la Tech et l'Acquisition ? Laissez-moi un message, je réponds généralement sous 24h.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-[#0077b5]/10 border border-[#0077b5]/30 hover:bg-[#0077b5] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all duration-300">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href="mailto:romanlayani@gmail.com" className="flex items-center justify-center gap-3 px-8 py-4 bg-[#111] border border-white/10 hover:border-[#D7B56D]/50 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all duration-300">
              <FileText size={14} /> romanlayani@gmail.com
            </a>
          </div>
        </div>

        {/* Colonne Droite : Formulaire Sur-Mesure */}
        <div className="bg-[#0f0f0f] border border-white/[0.05] rounded-[32px] p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.8)] relative">
          
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-20 h-full"
              >
                <div className="w-20 h-20 bg-[#D7B56D]/20 rounded-full flex items-center justify-center mb-6 border border-[#D7B56D]/50">
                  <ArrowRight size={32} className="text-[#D7B56D]" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-3">Message envoyé</h3>
                <p className="text-neutral-500 font-light">Je vous réponds dans les plus brefs délais.</p>
              </motion.div>
            ) : (
              <motion.form 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                {/* Ligne 1 : Prénom / Nom */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Prénom *</label>
                    <input type="text" required name="entry.2026023374" placeholder="Jean"
                      className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#D7B56D] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Nom *</label>
                    <input type="text" required name="entry.2010330153" placeholder="Dupont"
                      className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#D7B56D] transition-colors" />
                  </div>
                </div>

                {/* Ligne 2 : Email / Entreprise */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Email *</label>
                    <input type="email" required name="entry.1636217091" placeholder="jean@email.com"
                      className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#D7B56D] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Entreprise / Projet</label>
                    <input type="text" name="entry.400784303" placeholder="Facultatif"
                      className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#D7B56D] transition-colors" />
                  </div>
                </div>

                {/* Ligne 3 : Lien */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Lien utile (LinkedIn, Site web...)</label>
                  <input type="text" name="entry.1388183345" placeholder="https://"
                    className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#D7B56D] transition-colors" />
                </div>

                {/* Ligne 4 : Message */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Message *</label>
                  <textarea required name="entry.1618489640" rows="4" placeholder="Comment puis-je vous aider ?"
                    className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#D7B56D] transition-colors resize-none" />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] py-5 rounded-xl hover:bg-[#D7B56D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center gap-2">Envoi en cours <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /></span>
                  ) : (
                    <>Envoyer le message <ArrowRight size={14} /></>
                  )}
                </button>
                {status === 'error' && <p className="text-red-500 text-xs text-center mt-2">Une erreur est survenue. Veuillez réessayer.</p>}
              </motion.form>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
const ConfidentialityToast = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Apparaît après 2 secondes
    const timer = setTimeout(() => setIsVisible(true), 2000);
    // Disparaît automatiquement après 12 secondes
    const hideTimer = setTimeout(() => setIsVisible(false), 14000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[1000] max-w-[280px] bg-[#0f0f0f]/90 backdrop-blur-2xl border border-[#D7B56D]/30 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          <div className="flex gap-4">
            <div className="shrink-0 mt-1">
              <div className="w-8 h-8 rounded-xl bg-[#D7B56D]/10 flex items-center justify-center text-[#D7B56D] border border-[#D7B56D]/20">
                <Lock size={14} />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[9px] uppercase font-black tracking-widest text-[#D7B56D]">CADRE DE CONFIDENTIALITÉ</p>
                <button onClick={() => setIsVisible(false)} className="text-neutral-600 hover:text-white transition-colors -mt-1 -mr-1">
                  <X size={14} />
                </button>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed font-light">
                Ce portfolio contient des données stratégiques réelles. Merci de respecter la confidentialité des documents. Tout usage ou partage est soumis à mon autorisation.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function PortfolioApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProof, setSelectedProof] = useState(null);

  useEffect(() => {
    const hashToPage = { '#maitrise': 'maitrise', '#contact': 'contact', '#apropos': 'apropos', '#home': 'home' };
    const page = hashToPage[window.location.hash];
    if (page) setCurrentPage(page);
  }, []);

  const setPage = (page) => {
  setCurrentPage(page);
  window.location.hash = page === 'home' ? '' : page;
  window.scrollTo(0, 0); // Cette ligne répare le problème du "bas de page"
};

  return (
    <div className="font-sans antialiased bg-[#080808] text-white selection:bg-[#D7B56D]/20">
      <style>{`
        body { -ms-overflow-style: none; scrollbar-width: none; }
        body::-webkit-scrollbar { display: none; }
      `}</style>
      <Navbar currentPage={currentPage} setPage={setPage} />
      <AnimatePresence mode="wait">
        <motion.main key={currentPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          {currentPage === 'home' && <Home setPage={setPage} setSelectedProof={setSelectedProof} />}
          {currentPage === 'maitrise' && <MasteryLayout />}
          {currentPage === 'apropos' && <Apropos />}
          {currentPage === 'contact' && <Contact />}
        </motion.main>
      </AnimatePresence>
      
      {/* FOOTER AVEC LINKEDIN */}
      <footer className="py-12 border-t border-white/[0.04] bg-[#060606] flex flex-col items-center justify-center gap-6">
        <div className="text-neutral-700 text-[9px] font-black uppercase tracking-[0.8em] text-center">
          Roman LAYANI-PUJOL — Hybrid Entrepreneur — 2026
        </div>
        <div className="flex gap-4">
          <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-[#0077b5] transition-colors">
            <Linkedin size={18} />
          </a>
        </div>
      </footer>

      {/* Lightbox globale pour les clics depuis Home */}
      <Lightbox selectedProof={selectedProof} setSelectedProof={setSelectedProof} />
      <ConfidentialityToast /> 
    </div>
  );
}


