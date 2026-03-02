/* eslint-disable */
// @ts-nocheck
"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ChevronRight, FileText, Video, X,
  Globe, TrendingUp, Package, Terminal, Users, Target,
  Zap, ExternalLink, ArrowUpRight, Layers, Link as LinkIcon, Presentation,
  ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';

// --- HELPERS GLOBAUX (Sécurisés pour éviter les erreurs de compilation) ---
const getProofSrc = (proof) => proof.type === 'canva' ? proof.projectLink : encodeURI(`/portfolio2/${proof.folder}/${proof.file}`);

const getCanvaEmbedUrl = (url) => {
  if (!url) return '';
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
      title: "Concevoir et industrialiser des produits innovants", 
      level: 4.5, 
      icon: "package", 
      consistsOf: "Capacité à transformer une vision en produit manufacturé, industrialisé et prêt pour le marché.", 
      subskills: [
        { 
          id: 'branding', 
          name: "1.1 Concevoir une marque et un positionnement différenciant", 
          level: 4.5, 
          consistsOf: "Création d'identité visuelle, packaging et proposition de valeur forte sur des marchés concurrentiels." 
        }, 
        { 
          id: 'industrialisation', 
          name: "1.2 Passer du prototype à la production industrielle", 
          level: 4.7, 
          consistsOf: "Sourcing usine, validation technique, patronnage industriel et suivi qualité." 
        }
      ] 
    },
    { 
      id: 'business', 
      title: "Structurer une offre et générer de la croissance", 
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
      title: "Gérer une chaîne d’approvisionnement internationale", 
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
      title: "Développer et automatiser des systèmes technologiques", 
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
      title: "Développer un portefeuille et conclure des ventes", 
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
      title: "Valider et structurer des opportunités entrepreneuriales", 
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
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "CHROMA — Identite & Direction Artistique", projectObjective: "Creer une marque textile thermochromique premium differenciante.", folder: "chroma", file: "logo chroma.png", type: "image", label: "Logo Final", caption: "Logo final representant l'identite visuelle de la marque." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "CHROMA — Identite & Direction Artistique", folder: "chroma", file: "idee charte graphique 1.jpeg", type: "image", label: "Charte Graphique 1", caption: "Première exploration creative des couleurs et univers visuel." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "CHROMA — Identite & Direction Artistique", folder: "chroma", file: "idee charte graphique 2.jpeg", type: "image", label: "Charte Graphique 2", caption: "Variante de direction artistique testee avant validation." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "CHROMA — Identite & Direction Artistique", folder: "chroma", file: "idee charte graphique 3.jpeg", type: "image", label: "Charte Graphique 3", caption: "Ajustements esthetiques pour affiner le positionnement premium." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "CHROMA — Identite & Direction Artistique", folder: "chroma", file: "dimensions veste.png", type: "image", label: "Specifications", caption: "Specifications techniques et proportions du produit." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "CHROMA — Identite & Direction Artistique", folder: "chroma", file: "2ieme prix de l etudiant entrepreuners de la promo tc et mmi projet chroma.jpeg", type: "image", label: "Prix Innovation", caption: "Reconnaissance academique officielle validant la credibilite du projet." },
    
    // NOUVEAU : Benchmark rapatrié dans CHROMA
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "CHROMA — Identite & Direction Artistique", projectLink: "https://www.canva.com/design/DAGcQ-J9Xos/bghCpOkCMo0dagJwm3gACQ/view", type: "canva", label: "Benchmark Stratégique", caption: "Analyse du marché et du positionnement stratégique de la marque." },
    
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "DIGITAG MEMORY — Concept & Packaging", projectObjective: "Transformer le souvenir en experience digitale permanente.", projectLink: "https://digitagmemory.fr", folder: "digitag memory", file: "Photo prototype initial fais main.png", type: "image", label: "Prototype Artisanal", caption: "Prototype artisanal initial permettant de tester la faisabilite." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "DIGITAG MEMORY — Concept & Packaging", projectLink: "https://digitagmemory.fr", folder: "digitag memory", file: "packaging fini et reçu.png", type: "image", label: "Packaging Industriel", caption: "Packaging industriel premium valide et reçu en production reelle." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "REMAX — Design supports physiques", projectObjective: "Renforcer la visibilite terrain via supports personnalises.", folder: "Remax", file: "photo des portes cles recu .jpeg", type: "image", label: "Portes-cles", caption: "Goodies conçus, produits et receptionnes pour diffusion locale." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "REMAX — Design supports physiques", folder: "Remax", file: "photo sac de course reçcu.jpeg", type: "image", label: "Sacs promotionnels", caption: "Sacs promotionnels designes, sources et produits en usine." },
    
    // Regroupement de tous les autres projets académiques de Branding
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "Projets Academiques", projectLink: "https://www.canva.com/design/DAG7AdZHu28/PgAdCqwlU9W1g4ZDNM2ctA/view", type: "canva", label: "Veja - Strategie", caption: "Analyse approfondie de la strategie social media d'une marque internationale." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "Projets Academiques", projectLink: "https://www.canva.com/design/DAGZEHUiy_Y/ZM3fNtnR3snuqxnE9VNjhA/view", type: "canva", label: "SUÈNH - Charte Graphique", caption: "Creation d'une charte graphique complète et d'une identite visuelle." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "Projets Academiques", projectLink: "https://www.canva.com/design/DAF2UL6QMwg/0pzuUz_o6BE3ioGj_bCh2w/view", type: "canva", label: "TC France - Identité", caption: "Creation d'une identite reseaux sociaux pour un public etudiant." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "Projets Academiques", projectLink: "https://www.canva.com/design/DAG1wE1JUC4/L-O9vMTp2KJaZIeGTibAXw/view", type: "canva", label: "Camping - Charte Edito", caption: "Definition du ton et de la ligne editoriale pour les communications." },
    { competenceId: "produit", subCompetenceId: "branding", projectTitle: "Projets Academiques", projectLink: "https://www.canva.com/design/DAGgxxsPT6s/jHajMVYKM8CcYPjAwDSy0Q/view", type: "canva", label: "Lancement Boisson - Marketing", caption: "Analyse marketing complète : strategie de lancement et de positionnement." },

    // --- PRODUIT : INDUSTRIALISATION ---
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "CHROMA — Prototype → Usine → Produit final", folder: "chroma", file: "Maquette Echantillion n-1.jpg", type: "image", label: "Validation Materiaux", caption: "Première validation physique des materiaux." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "CHROMA — Prototype → Usine → Produit final", folder: "chroma", file: "photo patron tissus.jpeg", type: "image", label: "Patron Industriel", caption: "Patron textile valide pour production industrielle." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "CHROMA — Prototype → Usine → Produit final", folder: "chroma", file: "Image fournisseur 2 veste.jpeg", type: "image", label: "echange Fournisseur", caption: "echange et validation technique avec le fournisseur." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "CHROMA — Prototype → Usine → Produit final", folder: "chroma", file: "vestes chroma finis et porte par moi meme.jpeg", type: "image", label: "Produit Final", caption: "Produit final reellement fabrique et porte." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "DIGITAG MEMORY — Prototype → Installation reelle", projectLink: "https://digitagmemory.fr", folder: "digitag memory", file: "Photo prototype initial fais main.png", type: "image", label: "Proto Initial", caption: "Version initiale avant industrialisation." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "DIGITAG MEMORY — Prototype → Installation reelle", projectLink: "https://digitagmemory.fr", folder: "digitag memory", file: "Photo plaque installee reelle.jpeg", type: "image", label: "Installation Site", caption: "Produit final reellement installe sur site." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "DIGITAG PRO — Production plaques NFC", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "plaque nfc google facebook instagram tripadvisor chez a l usine chez le fournisseur.png", type: "image", label: "Contrôle Usine", caption: "Contrôle qualite et production en usine." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "DIGITAG PRO — Production plaques NFC", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "plaque nfc google facebook instagram tripadvisor fini.png", type: "image", label: "Plaques Finies", caption: "Produit final prêt à être livre." },
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "DIGITAG PRO — Production plaques NFC", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "photo fournisseurs plaque google.jpeg", type: "image", label: "Sourcing Usine", caption: "Sourcing fournisseur specialise en plaques NFC." },
    
    { competenceId: "produit", subCompetenceId: "industrialisation", projectTitle: "Projets Academiques", projectLink: "https://www.canva.com/design/DAGy4RH5kPE/wXqGJhTMJA0ISbg9KwRsYA/view", type: "canva", label: "Jeu de societe - Process", caption: "Infographie des etapes pour commercialiser et proteger un produit." },

    // --- BUSINESS ---
{ competenceId: "business", subCompetenceId: "offre", projectTitle: "DIGITAG PRO — Structuration Offre B2B", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "capture de mon site web btob digitagpro.fr.png", type: "image", label: "Landing Page B2B", caption: "Conception de la page de vente : formulation de la promesse, bénéfices clients et appel à l'action clair.", isWebsite: true },
{ competenceId: "business", subCompetenceId: "offre", projectTitle: "DIGITAG MEMORY — Proposition de Valeur B2C", projectLink: "https://digitagmemory.fr", folder: "digitag memory", file: "capture de mon site marchands digitagmemory.fr.png", type: "image", label: "Site E-commerce B2C", caption: "Structuration de l'offre émotionnelle autour du deuil et parcours d'achat simplifié.", isWebsite: true },
{ competenceId: "business", subCompetenceId: "pricing", projectTitle: "DIGITAG PRO — Pricing B2B & Marges", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "Tableaux_commissions.pdf", type: "pdf", label: "Tableaux Commissions", caption: "Structuration du modèle economique et des marges commerciales." },
    { competenceId: "business", subCompetenceId: "acquisition", projectTitle: "E-commerce — Google Ads", folder: "site internet", file: "tableau example de mes depenses googles ads sur une boutique ecomerce total 2439.06.png", type: "image", label: "Google Ads (2.4k)", caption: "Pilotage reel d'un budget publicitaire avec suivi des KPI." },
    { competenceId: "business", subCompetenceId: "acquisition", projectTitle: "E-commerce — Meta Ads", folder: "site internet", file: "tableau example de mes depenses meta ads sur une boutique ecomerce en testing total 229.90.png", type: "image", label: "Meta Ads Test", caption: "Campagne test visant validation produit via acquisition payante." },
    { competenceId: "business", subCompetenceId: "ecommerce", projectTitle: "Boutique test — Validation & Performance", folder: "site internet", file: "trophee 1k club yomi denzel ecomerce.jpeg", type: "image", label: "Trophee 1K Club", caption: "Validation d'un palier de performance e-commerce significatif." },
    { competenceId: "business", subCompetenceId: "ecommerce", projectTitle: "Boutique test — Validation & Performance", folder: "site internet", file: "dashbord stripe de paiments a linternational suisse belgique turquie luxembourg.png", type: "image", label: "Stripe International", caption: "Preuve de ventes internationales multi-pays." },
    
    { competenceId: "business", subCompetenceId: "ecommerce", projectTitle: "Projets Academiques", projectLink: "https://www.canva.com/design/DAGfADJ7pK8/1gaH3eVoidephzvcQvKuxA/view", type: "canva", label: "K-Way - Analyse UX", caption: "Analyse de l'experience utilisateur et des leviers d'optimisation d'un site e-commerce." },

    // --- SUPPLY ---
    { competenceId: "supply", subCompetenceId: "sourcing", projectTitle: "DIGITAG PRO — Sourcing plaques NFC", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "photo fournisseurs plaque google.jpeg", type: "image", label: "Identification Usine", caption: "Identification et selection fournisseur strategique." },
    { competenceId: "supply", subCompetenceId: "sourcing", projectTitle: "DIGITAG PRO — Sourcing plaques NFC", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "plaque nfc google facebook instagram tripadvisor chez a l usine chez le fournisseur.png", type: "image", label: "Validation Qualite", caption: "Validation qualite en usine." },
    { competenceId: "supply", subCompetenceId: "sourcing", projectTitle: "REMAX — Production goodies", folder: "Remax", file: "video production sac de course remax fournisseur.mp4", type: "video", label: "Video Production", caption: "Suivi direct de la production chez le fournisseur." },
    { competenceId: "supply", subCompetenceId: "logistique", projectTitle: "DIGITAG PRO — Expedition internationale", folder: "digitag pro", file: "plaques nfc google et instagram envoyer lituanie.png", type: "image", label: "Export Lituanie", caption: "Livraison internationale effective (export UE)." },
    { competenceId: "supply", subCompetenceId: "logistique", projectTitle: "REMAX — Reception marchandise", folder: "Remax", file: "photo des portes cles recu .jpeg", type: "image", label: "Reception Stock", caption: "Reception physique marchandise importee." },
    { competenceId: "supply", subCompetenceId: "logistique", projectTitle: "REMAX — Reception marchandise", folder: "Remax", file: "photo sac de course reçcu.jpeg", type: "image", label: "Contrôle Produit", caption: "Contrôle reception produits personnalises." },

    // --- TECH & IA ---
    { competenceId: "tech", subCompetenceId: "software", projectTitle: "REMAX — Logiciel gestion sinistres", folder: "Remax", file: "screen du logiciel de gestions dees sinstres.png", type: "image", label: "Logiciel Sinistres", caption: "Application metier developpee pour automatiser le suivi des sinistres." },
    { competenceId: "tech", subCompetenceId: "software", projectTitle: "REMAX — Logiciel ecran vitrine", folder: "Remax", file: "screen du logiciel pour lecran dune agence immobiliere.png", type: "image", label: "Affichage Dynamique", caption: "Interface dynamique automatisant l'affichage vitrine." },
    { competenceId: "tech", subCompetenceId: "ia", projectTitle: "GPT annonces immobilières", folder: "Remax", file: "gpt annonce immobiliere.png", type: "image", label: "Outil Interne", caption: "Outil interne standardisant la redaction des annonces." },
    { competenceId: "tech", subCompetenceId: "ia", projectTitle: "GPT annonces immobilières", folder: "Remax", file: "gpt annonce immobiliere example de prompte et de resultat.png", type: "image", label: "Resultats d'Annonces", caption: "Demonstration du gain de coherence et de productivite." },
    { competenceId: "tech", subCompetenceId: "ia", projectTitle: "GPT coach appels commerciaux", folder: "Remax", file: "gpt Coach d Appels Commerciaux Simulation Prospects screen.png", type: "image", label: "Simulateur Appels", caption: "Simulateur d'entraînement commercial base sur IA." },

    // --- SALES ---
    { competenceId: "sales", subCompetenceId: "portefeuille", projectTitle: "DIGITAG PRO — Plaques NFC Google", projectLink: "https://digitagpro.fr", folder: "digitag pro", file: "quelques photo de plaques nfc google instagram et tripadvisor chez les clients.png", type: "image", label: "Vente Terrain", caption: "Installations reelles prouvant validation marche B2B." },
    { competenceId: "sales", subCompetenceId: "portefeuille", projectTitle: "REMAX — Prospection terrain", projectLink: "https://www.canva.com/design/DAG-UrTp4Ik/EMIuPlTXNiORD0yH7osrcw/view", type: "canva", label: "Flyer d'Acquisition", caption: "Creation d'un support physique pour demarcher les prospects immobiliers." },
    { competenceId: "sales", subCompetenceId: "nego", projectTitle: "REMAX — Closing & Mandats", folder: "Remax", file: "Logiciel pour saisie de bien pour faire mandat apres visite du bien et accrod avec le prorio .png", type: "image", label: "Saisie de Mandat", caption: "Outil de saisie de bien validant l'accord proprietaire et la prise de mandat." },
    
    // --- MANAGEMENT ---
    { competenceId: "management", subCompetenceId: "planification", projectTitle: "Projets Academiques", folder: "academic", file: "Gantt_Tesla.pdf", type: "pdf", label: "Tesla - Gantt", caption: "Planification structuree avec dependances." },
    { competenceId: "management", subCompetenceId: "planification", projectTitle: "Projets Academiques", folder: "academic", file: "Analyse_Risques_Tesla.pdf", type: "pdf", label: "Tesla - Risques", caption: "Identification preventive des scenarios critiques." },
    { competenceId: "management", subCompetenceId: "planification", projectTitle: "Projets Academiques", projectLink: "https://www.canva.com/design/DAGe3yN9UHs/IIjXNZLn1gMOWEiwdPb_wg/view", type: "canva", label: "Tesla - Événementiel", caption: "Organisation strategique d'un evenement corporate international." },

    { competenceId: "management", subCompetenceId: "marche", projectTitle: "DIGITAG MEMORY — Salon funeraire", projectLink: "https://digitagmemory.fr", folder: "digitag memory", file: "badge pour le salon du funeraire.png", type: "image", label: "Accreditation Exposant", caption: "Accreditation officielle exposant professionnel." },
    { competenceId: "management", subCompetenceId: "marche", projectTitle: "DIGITAG MEMORY — Salon funeraire", folder: "digitag memory", file: "stand.png", type: "image", label: "Photos Stand", caption: "Presence reelle sur evenement sectoriel strategique." }
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
          <span className="text-[13px] font-black tracking-[0.25em] text-white uppercase">Roman<span className="text-neutral-500 font-light hidden sm:inline"> Layani</span></span>
        </button>
        <div className="flex gap-6 md:gap-10">
          {[['home', 'Accueil'], ['maitrise', 'Competences'], ['contact', 'Contact']].map(([id, label]) => (
            <button key={id} onClick={() => { setPage(id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`text-[10px] uppercase tracking-[0.35em] font-bold transition-all duration-300 ${currentPage === id ? 'text-[#D7B56D]' : 'text-neutral-500 hover:text-neutral-200'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════
// HOME PAGE — 6 SECTIONS
// ═══════════════════════════════════════════════════════════
const Home = ({ setPage, setSelectedProof }) => {

  const featuredProofs = [
    { folder: "chroma", file: "vestes chroma finis et porte par moi meme.jpeg", label: "Veste CHROMA portee" },
    { folder: "digitag memory", file: "Photo plaque installee reelle.jpeg", label: "Digitag installee sur site" },
    { folder: "digitag pro", file: "plaque nfc google facebook instagram tripadvisor chez a l usine chez le fournisseur.png", label: "Production usine NFC", isPdf: true },
    { folder: "site internet", file: "tableau example de mes depenses googles ads sur une boutique ecomerce total 2439.06.png", label: "Dashboard Google Ads" },
    { folder: "digitag memory", file: "badge pour le salon du funeraire.png", label: "Badge Salon Funeraire" },
    { folder: "Remax", file: "screen du logiciel de gestions dees sinstres.png", label: "Logiciel Sinistres" },
  ];

  const projects = [
    { title: "CHROMA", desc: "Chroma reinvente le vêtement comme une surface vivante qui reagit à son environnement.", img: "/portfolio2/chroma/vestes chroma finis et porte par moi meme.jpeg", tag: "Textile Tech", onClick: () => setPage('maitrise') },
    { title: "DIGITAG MEMORY", desc: "Une memoire connectee et intemporelle : les souvenirs ne s'effacent jamais.", img: "/portfolio2/digitag memory/Photo plaque installee reelle.jpeg", tag: "NFC · Memoire", onClick: () => setSelectedProof(DIGITAG_MEMORY_PROOF) },
    { title: "DIGITAG PRO", desc: "Plaques NFC Google & reseaux pour acquisition B2B.", img: "/portfolio2/digitag pro/photo fournisseurs plaque google.jpeg", tag: "B2B · NFC", onClick: () => setSelectedProof(DIGITAG_PRO_PROOF) },
    { title: "REMAX — TECH & IA", desc: "Automatisation, GPT, logiciels internes au service de l'immobilier.", img: "/portfolio2/Remax/screen du logiciel de gestions dees sinstres.png", tag: "Tech · IA", onClick: () => setPage('maitrise') },
  ];

  const systemBlocks = [
    { key: "package", title: "Produit", desc: "Prototype → design → industrialisation", color: "from-amber-900/20" },
    { key: "globe", title: "Supply", desc: "Sourcing → negociation → import/export", color: "from-emerald-900/20" },
    { key: "trendingUp", title: "Acquisition", desc: "Google Ads → Meta Ads → conversion", color: "from-blue-900/20" },
    { key: "terminal", title: "Tech & IA", desc: "Logiciels internes → GPT → automatisation", color: "from-violet-900/20" },
  ];

  const academicProjects = [
    {
      title: "Benchmark Chroma",
      category: "Analyse & Positionnement",
      desc: "Analyse du marche et du positionnement strategique d'une marque textile innovante, en coherence avec mon projet Chroma.",
      link: "https://www.canva.com/design/DAGcQ-J9Xos/bghCpOkCMo0dagJwm3gACQ/view"
    },
    {
      title: "etude de marche visionnaire",
      category: "Analyse marche & validation",
      desc: "etude approfondie du marche textile et des tendances emergentes.",
      link: "https://www.canva.com/design/DAGWkEHzSIg/RrjDI0WuwxL3GZiBpqCgdg/view"
    },
    {
      title: "Audit digital – GioiA Aperitivo",
      category: "Audit & Strategie digitale",
      desc: "Audit digital complet avec recommandations strategiques et axes d'optimisation.",
      link: "https://www.canva.com/design/DAG-Uhz-9aM/MYAlyebATOSuqP7blmOlpw/view"
    },
    {
      title: "Rapport digital – Jardin de Zazou",
      category: "Developpement & Structuration",
      desc: "Plan strategique de developpement digital pour une entreprise locale.",
      link: "https://www.canva.com/design/DAG7xw_R1uM/wC9JJn3jyDkqACq-k9qEhQ/view"
    },
    {
      title: "Strategie de Com – Veja",
      category: "Strategie & Reseaux sociaux",
      desc: "Analyse approfondie de la strategie social media d'une marque internationale.",
      link: "https://www.canva.com/design/DAG7AdZHu28/PgAdCqwlU9W1g4ZDNM2ctA/view"
    },
    {
      title: "evenement corporate – Tesla",
      category: "Gestion de projet & Event",
      desc: "Organisation strategique d'un evenement corporate international.",
      link: "https://www.canva.com/design/DAGe3yN9UHs/IIjXNZLn1gMOWEiwdPb_wg/view"
    },
    {
      title: "Analyse e-commerce – K-Way",
      category: "Analyse UX & Performance",
      desc: "Analyse de l'experience utilisateur et des leviers d'optimisation d'un site e-commerce.",
      link: "https://www.canva.com/design/DAGfADJ7pK8/1gaH3eVoidephzvcQvKuxA/view"
    }
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
                  Roman<br />Layani
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
                    Je developpe des produits physiques, je structure leur modèle economique et j'automatise les systèmes qui permettent leur croissance.
                  </p>
                  <p className="text-[0.95rem] text-neutral-500 font-light italic leading-relaxed">
                    De la conception à la production. De la production à la rentabilite.
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
                    Explorer mes competences
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPage('maitrise')}
                    className="px-8 py-4 bg-transparent border border-[#D7B56D]/50 text-[#D7B56D] font-black rounded-full text-[11px] uppercase tracking-[0.25em] hover:bg-[#D7B56D]/10 transition-all duration-300"
                  >
                    Voir mon parcours
                  </motion.button>
                </div>
              </Reveal>
            </div>

            {/* Droite — Photo (40%) */}
            <div className="flex justify-center lg:justify-end">
              <Reveal delay={0.2} y={30}>
                <div className="relative w-full max-w-[340px] md:max-w-[400px] lg:max-w-[460px]">
                  <div className="absolute -inset-8 bg-[#D7B56D]/15 blur-[70px] rounded-[50px] pointer-events-none" />
                  <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 via-transparent to-transparent z-10" />
                    <img
                      src={encodeURI("/portfolio2/Photo pro roman costume 2026.jpeg")}
                      alt="Roman Layani"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#D7B56D] font-black">Roman Layani</span>
                      <span className="text-[11px] text-white font-light">Entrepreneur Hybride · 2026</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 20, y: 10 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -left-8 top-1/3 bg-[#111]/90 backdrop-blur-xl border border-[#D7B56D]/20 rounded-2xl p-4 shadow-2xl"
                  >
                    <div className="text-[9px] uppercase tracking-widest text-[#D7B56D] font-black mb-1">Google Ads</div>
                    <div className="text-2xl font-black text-white">ROAS 1,93</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">sur 2 439  investis</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20, y: -10 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -right-6 bottom-1/4 bg-[#111]/90 backdrop-blur-xl border border-[#D7B56D]/20 rounded-2xl p-4 shadow-2xl"
                  >
                    <div className="text-[9px] uppercase tracking-widest text-[#D7B56D] font-black mb-1">International</div>
                    <div className="text-lg font-black text-white">6 marchés</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">FR · CH · BE · LU · TR · LT</div>
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
          2. ReSULTATS CONCRETS
      ══════════════════════════════════ */}
      <section className="py-28 md:py-36 px-8 border-t border-white/[0.04] bg-[#060606]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-[#D7B56D] font-black mb-4">Donnees reelles · verifiables</div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                  Resultats <GoldText>concrets</GoldText>
                </h2>
              </div>
              <button onClick={() => setPage('maitrise')} className="text-[10px] uppercase tracking-[0.3em] font-black text-neutral-500 hover:text-[#D7B56D] transition-colors flex items-center gap-2">
                Voir les resultats <ArrowRight size={12} />
              </button>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            <Reveal delay={0.1}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-gradient-to-b from-[#111]/80 to-[#0a0a0a] border border-white/[0.06] hover:border-[#D7B56D]/30 rounded-[28px] p-8 overflow-hidden group transition-all duration-500">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#D7B56D]/[0.04] blur-3xl rounded-full group-hover:bg-[#D7B56D]/[0.08] transition-all duration-700" />
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-[0.35em] font-black text-neutral-500 mb-7 group-hover:text-[#D7B56D] transition-colors">Google Ads</div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">2 439<span className="text-xl text-neutral-600">,06 </span></div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-10">investis</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                      <span className="text-xs text-neutral-500">Impressions</span>
                      <span className="text-sm font-bold text-white">318 549</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                      <span className="text-xs text-neutral-500">Conversions</span>
                      <span className="text-sm font-bold text-white">873</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-neutral-500">ROAS</span>
                      <span className="text-2xl font-black text-[#D7B56D]">1,93</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            <Reveal delay={0.15}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-gradient-to-b from-[#111]/80 to-[#0a0a0a] border border-white/[0.06] hover:border-[#D7B56D]/30 rounded-[28px] p-8 overflow-hidden group transition-all duration-500">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#D7B56D]/[0.04] blur-3xl rounded-full" />
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-[0.35em] font-black text-neutral-500 mb-7 group-hover:text-[#D7B56D] transition-colors">Meta Ads <span className="text-neutral-700">(test)</span></div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">229<span className="text-xl text-neutral-600">,90 </span></div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-10">investis</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                      <span className="text-xs text-neutral-500">CTR</span>
                      <span className="text-2xl font-black text-[#D7B56D]">3,15 %</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-neutral-500">CPC moyen</span>
                      <span className="text-sm font-bold text-white">0,44 </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            <Reveal delay={0.2}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-gradient-to-b from-[#111]/80 to-[#0a0a0a] border border-white/[0.06] hover:border-[#D7B56D]/30 rounded-[28px] p-8 overflow-hidden group transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D7B56D]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-[0.35em] font-black text-neutral-500 mb-7 group-hover:text-[#D7B56D] transition-colors">Ventes Internationales</div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-6">Marches actifs</div>
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
          </div>
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
                Un système complet,<br />pas juste des idees.
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
                    <p className="text-sm text-neutral-500 font-light leading-relaxed group-hover:text-neutral-400 transition-colors">{block.desc}</p>
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
            <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-[#D7B56D] font-black mb-4">Projets reels · de A à Z</div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                  Projets <GoldText>developpes</GoldText>
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((proj, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <motion.div
                  whileHover="hover"
                  onClick={proj.onClick}
                  className="relative aspect-[16/10] rounded-[28px] overflow-hidden cursor-pointer group border border-white/[0.05] hover:border-[#D7B56D]/25 transition-all duration-600"
                >
                  <motion.img
                    src={encodeURI(proj.img)}
                    alt={proj.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    variants={{ hover: { scale: 1.06 } }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ opacity: 0.45 }}
                  />
                  <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600"
                    style={{ background: 'transparent' }}>
                    <img src={encodeURI(proj.img)} alt="" className="w-full h-full object-cover opacity-60" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-[#080808]/10" />

                  <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-sm">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#D7B56D] font-black">{proj.tag}</span>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 z-10">
                    <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mb-3 leading-tight">{proj.title}</h4>
                    <motion.p
                      className="text-sm text-neutral-400 font-light max-w-sm leading-relaxed"
                      variants={{ hover: { y: -4 } }}
                      transition={{ duration: 0.5 }}
                    >
                      {proj.desc}
                    </motion.p>
                  </div>

                  <div className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#D7B56D]/0 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-[#D7B56D] group-hover:border-[#D7B56D] transition-all duration-400">
                    <ArrowUpRight size={14} className="text-black" />
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          4.5 PROJETS ACADeMIQUES & STRATeGIQUES
      ══════════════════════════════════ */}
      <section className="py-28 md:py-36 px-8 border-t border-white/[0.04] bg-[#080808]">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-[#D7B56D] font-black mb-4">Strategie & Analyse</div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                  Projets <GoldText>Academiques</GoldText>
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {academicProjects.map((proj, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="relative bg-gradient-to-b from-[#111]/80 to-[#0a0a0a] border border-white/[0.06] hover:border-[#D7B56D]/30 rounded-[28px] p-8 group transition-all duration-500 overflow-hidden flex flex-col h-full shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D7B56D]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D7B56D]/[0.04] blur-3xl rounded-full group-hover:bg-[#D7B56D]/[0.08] transition-all duration-700 pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-[#D7B56D] font-black mb-5 bg-[#D7B56D]/10 inline-block self-start px-3 py-1.5 rounded-full border border-[#D7B56D]/20">
                      {proj.category}
                    </div>
                    <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-3 leading-tight">{proj.title}</h4>
                    <p className="text-sm text-neutral-400 font-light leading-relaxed mb-10 flex-grow">
                      {proj.desc}
                    </p>
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-3 text-[10px] uppercase tracking-widest font-black text-neutral-500 hover:text-[#D7B56D] transition-colors self-start border border-white/10 hover:border-[#D7B56D]/30 bg-white/[0.02] hover:bg-[#D7B56D]/10 px-5 py-3 rounded-full"
                    >
                      Voir le projet <ExternalLink size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
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
                <div className="text-[10px] uppercase tracking-[0.4em] text-[#D7B56D] font-black mb-4">Documentation reelle</div>
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
                  onClick={() => setPage('maitrise')}
                  className="relative aspect-[4/3] rounded-[20px] overflow-hidden cursor-pointer group border border-white/[0.05] hover:border-[#D7B56D]/30 transition-all duration-400 bg-[#0f0f0f]"
                >
                  {p.isPdf ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText size={40} className="text-[#D7B56D]/20 group-hover:text-[#D7B56D]/60 transition-colors duration-400" />
                    </div>
                  ) : (
                    <img
                      src={encodeURI(`/portfolio2/${p.folder}/${p.file}`)}
                      alt={p.label}
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-[11px] font-black text-white uppercase tracking-wide leading-tight">{p.label}</p>
                  </div>

                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#D7B56D] flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                    <ArrowUpRight size={12} className="text-black" />
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
            onClick={() => { if (activeComp !== skill.id) { setActiveComp(skill.id); setActiveSub(null); } else { setActiveSub(null); if (isMobile) setIsMobileMenuOpen(false); } }}
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
                    <button key={sub.id} onClick={() => { setActiveSub(sub.id); if (isMobile) setIsMobileMenuOpen(false); }}
                      className={`w-full text-left py-3 px-4 rounded-xl text-[11px] font-bold tracking-wide transition-all flex items-center justify-between ${activeSub === sub.id ? 'bg-[#D7B56D]/10 text-[#D7B56D]' : 'text-neutral-600 hover:text-white hover:bg-white/[0.04]'}`}>
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
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">ARCHITECTURE <br /><GoldText>D'EXPERTISE</GoldText></h1>
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

          <div className="space-y-10">
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
                    <p className="text-base md:text-lg text-neutral-400 font-light leading-relaxed max-w-3xl mb-10">{currentComp.consistsOf}</p>
                    <div className="bg-black/60 p-5 rounded-2xl border border-white/[0.04] inline-block min-w-[180px] mb-10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Note</span>
                        <span className="text-xl font-black text-[#D7B56D]">{currentComp.level}<span className="text-sm text-neutral-700">/5</span></span>
                      </div>
                      <GaugeLevel level={currentComp.level} />
                    </div>
                    <div className="border-t border-white/[0.05] pt-7">
                      <h4 className="text-[10px] uppercase font-black text-neutral-600 tracking-widest mb-4">Sous-competences :</h4>
                      <div className="flex flex-wrap gap-3">
                        {currentComp.subskills.map(sub => (
                          <button key={sub.id} onClick={() => setActiveSub(sub.id)}
                            className="px-5 py-2.5 rounded-full border border-white/[0.08] text-xs font-bold text-neutral-500 hover:text-white hover:border-[#D7B56D]/40 transition-all flex items-center gap-3">
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
                            {projectData.link && (
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
                                    {p.type === 'pdf' ? <FileText size={48} /> : <Video size={48} />}
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
                                <p className="text-xs leading-relaxed text-neutral-500 group-hover:text-neutral-300 transition-colors font-light">{p.caption}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )) : (
                      <div className="py-24 text-center border border-white/[0.04] border-dashed rounded-[32px] opacity-30">
                        <p className="text-neutral-600 font-mono text-sm uppercase tracking-widest">Aucune archive indexee.</p>
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
                  {selectedProof.type === 'pdf' ? <FileText className="w-28 h-28" /> : <Video className="w-28 h-28" />}
                </div>
              )}

              {/* Bouton dynamique : Voir le site OU Agrandir l'image */}
              {selectedProof.type !== 'canva' && (
                <div className="absolute bottom-6 flex flex-col items-center gap-3 z-50">
                  {selectedProof.isWebsite ? (
                    <button onClick={() => window.open(selectedProof.projectLink, '_blank')}
                      className="px-8 py-3 bg-white text-black font-black rounded-full text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#D7B56D] transition-colors shadow-xl">
                      Voir le site <ExternalLink size={13} />
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
                <div className="text-[10px] font-black text-[#D7B56D] uppercase tracking-[0.4em]">Analyse Documentaire</div>
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
// CONTACT
// ═══════════════════════════════════════════════════════════
const Contact = () => (
  <div className="bg-[#080808] min-h-screen flex items-center justify-center px-8 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div className="w-[600px] h-[400px] bg-[#D7B56D]/[0.05] blur-[100px] rounded-full" />
    </div>
    <div className="text-center max-w-5xl relative z-10">
      <div className="text-[10px] uppercase tracking-[0.5em] text-[#D7B56D] font-black mb-10">Prenons contact</div>
      <h1 className="text-[clamp(4rem,12vw,11rem)] font-black tracking-tighter mb-10 uppercase leading-[0.82]">
        <GoldText>IMPACT</GoldText><br />START HERE.
      </h1>
      <p className="text-xl text-neutral-500 font-light mb-14 italic max-w-2xl mx-auto leading-relaxed">
        "Industrialiser l'innovation, automatiser la croissance, valider par la preuve."
      </p>
      <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#D7B56D]/30 to-transparent mx-auto mb-12" />
      <a href="mailto:contact@romanlayani.com"
        className="text-xl md:text-4xl font-black transition-all underline decoration-[#D7B56D]/10 underline-offset-[20px] hover:decoration-[#D7B56D] hover:text-[#D7B56D]">
        contact@romanlayani.com
      </a>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
export default function PortfolioApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProof, setSelectedProof] = useState(null);

  useEffect(() => {
    const hashToPage = { '#maitrise': 'maitrise', '#contact': 'contact', '#home': 'home' };
    const page = hashToPage[window.location.hash];
    if (page) setCurrentPage(page);
  }, []);

  const setPage = (page) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
  };

  return (
    <div className="font-sans antialiased bg-[#080808] text-white selection:bg-[#D7B56D]/20">
      <Navbar currentPage={currentPage} setPage={setPage} />
      <AnimatePresence mode="wait">
        <motion.main key={currentPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          {currentPage === 'home' && <Home setPage={setPage} setSelectedProof={setSelectedProof} />}
          {currentPage === 'maitrise' && <MasteryLayout />}
          {currentPage === 'contact' && <Contact />}
        </motion.main>
      </AnimatePresence>
      <footer className="py-16 border-t border-white/[0.04] text-center text-neutral-700 text-[9px] font-black uppercase tracking-[0.8em] bg-[#060606]">
        Roman Layani — Hybrid Entrepreneur — 2026
      </footer>

      {/* Lightbox globale pour les clics depuis Home */}
      <Lightbox selectedProof={selectedProof} setSelectedProof={setSelectedProof} />
    </div>
  );
}