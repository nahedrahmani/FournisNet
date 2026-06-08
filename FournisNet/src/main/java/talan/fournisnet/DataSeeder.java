package talan.fournisnet;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import talan.fournisnet.Entities.*;
import talan.fournisnet.Repositories.*;

import java.util.List;

@Component
public class DataSeeder implements ApplicationRunner {

    private final FournisseurRepository fournisseurRepo;
    private final ConstructeurRepository constructeurRepo;
    private final CategorieRepository categorieRepo;
    private final ProduitRepository produitRepo;
    private final AppUserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(FournisseurRepository fournisseurRepo,
                      ConstructeurRepository constructeurRepo,
                      CategorieRepository categorieRepo,
                      ProduitRepository produitRepo,
                      AppUserRepository userRepo,
                      PasswordEncoder passwordEncoder) {
        this.fournisseurRepo = fournisseurRepo;
        this.constructeurRepo = constructeurRepo;
        this.categorieRepo = categorieRepo;
        this.produitRepo = produitRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Seed default users
        if (!userRepo.existsByUsername("admin")) {
            AppUser admin = new AppUser();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Administrateur");
            admin.setRole(Role.ADMIN);
            userRepo.save(admin);
        }
        if (!userRepo.existsByUsername("user")) {
            AppUser user = new AppUser();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setFullName("Utilisateur Demo");
            user.setRole(Role.USER);
            userRepo.save(user);
        }

        if (produitRepo.count() > 0) return; // already seeded

        // ── CONSTRUCTEURS ──────────────────────────────────���─────
        Constructeur renault   = save(constructeur("Renault"));
        Constructeur peugeot   = save(constructeur("Peugeot"));
        Constructeur volkswagen= save(constructeur("Volkswagen"));
        Constructeur toyota    = save(constructeur("Toyota"));
        Constructeur bmw       = save(constructeur("BMW"));

        // ── FOURNISSEURS ─────────────────────────────────────────
        Fournisseur sousse = save(fournisseur("AutoPieces Sousse","contact@autopieces-sousse.tn","Sousse, Tunisie","73 100 200", FournisseurType.FABRIQUANT_ORIGINE, null));
        Fournisseur tunis  = save(fournisseur("Tunis Auto Parts","info@tunisauto.tn","Tunis, Tunisie","71 200 300", FournisseurType.DISTRIBUTEUR, null));
        Fournisseur sfax   = save(fournisseur("Sfax Pieces","sfax@pieces.tn","Sfax, Tunisie","74 300 400", FournisseurType.SOUS_TRAITANT, sousse));
        Fournisseur bosch  = save(fournisseur("Bosch Tunisie","bosch@tn.bosch.com","Ariana, Tunisie","70 400 500", FournisseurType.FABRIQUANT_ORIGINE, null));
        Fournisseur valeo  = save(fournisseur("Valeo Maghreb","valeo@maghreb.com","Manouba, Tunisie","70 500 600", FournisseurType.FABRIQUANT_ORIGINE, null));

        // ── CATEGORIES ───────────────────────────────────────────
        Categorie moteurs    = saveCategorie("Moteurs");
        Categorie freinage   = saveCategorie("Freinage");
        Categorie suspension = saveCategorie("Suspension");
        Categorie electrique = saveCategorie("Electrique");
        Categorie filtration = saveCategorie("Filtration");
        Categorie refroid    = saveCategorie("Refroidissement");
        Categorie transmission = saveCategorie("Transmission");
        Categorie carrosserie  = saveCategorie("Carrosserie");

        // ── PRODUITS (nom, ref, desc, prix, constructeur, fournisseur, categorie, imageUrl, quantite, quantiteMin)
        // Moteurs
        saveProduit("Moteur 1.6 16V","MOT-001","Moteur essence 1.6L 16 soupapes 110ch",2800.0, renault, bosch, moteurs,
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format", 8, 3);
        saveProduit("Moteur 2.0 TDI","MOT-002","Moteur diesel 2.0L TDI 150ch common rail",4200.0, volkswagen, bosch, moteurs,
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&auto=format", 3, 3); // low stock
        saveProduit("Moteur 1.5 dCi","MOT-003","Moteur diesel 1.5L dCi 90ch",3100.0, renault, valeo, moteurs,
            "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&auto=format", 5, 3);

        // Freinage
        saveProduit("Disque de frein avant","FRN-001","Disque ventilé avant 280mm compatible Renault Clio IV",180.0, peugeot, bosch, freinage,
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&auto=format", 25, 10);
        saveProduit("Plaquettes de frein Brembo","FRN-002","Kit plaquettes frein avant haute performance",95.0, renault, bosch, freinage,
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&auto=format", 40, 15);
        saveProduit("Etrier de frein","FRN-003","Etrier de frein arriere droit",220.0, peugeot, valeo, freinage,
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format", 12, 5);
        saveProduit("Maitre cylindre","FRN-004","Maitre cylindre de frein double circuit",145.0, toyota, bosch, freinage,
            "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&auto=format", 4, 5); // low stock

        // Suspension
        saveProduit("Amortisseur avant Sachs","SUS-001","Amortisseur avant gauche/droit pour Peugeot 308",230.0, peugeot, valeo, suspension,
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&auto=format", 18, 8);
        saveProduit("Ressort de suspension","SUS-002","Ressort helicoidal avant 310mm",85.0, volkswagen, bosch, suspension,
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&auto=format", 30, 10);
        saveProduit("Triangle de suspension","SUS-003","Triangle inferieur avant complet avec rotule",175.0, renault, valeo, suspension,
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format", 2, 5); // low stock

        // Electrique
        saveProduit("Alternateur Valeo","ELC-001","Alternateur 90A compatible multi-marques",380.0, renault, valeo, electrique,
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&auto=format", 15, 5);
        saveProduit("Demarreur Bosch","ELC-002","Demarreur 1.4kW 12V Bosch",260.0, volkswagen, bosch, electrique,
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&auto=format", 10, 5);
        saveProduit("Batterie 60Ah","ELC-003","Batterie auto 60Ah 540A sans entretien",195.0, toyota, bosch, electrique,
            "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&auto=format", 22, 8);
        saveProduit("Bobine d'allumage","ELC-004","Bobine d'allumage crayon compatible Renault",65.0, renault, bosch, electrique,
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format", 35, 10);

        // Filtration
        saveProduit("Filtre a huile Mann","FLT-001","Filtre huile moteur Mann-Filter W 712/75",18.0, volkswagen, bosch, filtration,
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&auto=format", 60, 20);
        saveProduit("Filtre a air","FLT-002","Filtre air moteur haute filtration",25.0, peugeot, valeo, filtration,
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&auto=format", 50, 20);
        saveProduit("Filtre a carburant","FLT-003","Filtre carburant diesel en ligne",35.0, renault, bosch, filtration,
            "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&auto=format", 3, 10); // low stock
        saveProduit("Filtre habitacle","FLT-004","Filtre habitacle anti-pollen avec charbon actif",22.0, toyota, valeo, filtration,
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format", 45, 15);

        // Refroidissement
        saveProduit("Radiateur eau","REF-001","Radiateur de refroidissement moteur aluminium",320.0, peugeot, valeo, refroid,
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&auto=format", 7, 4);
        saveProduit("Thermostat","REF-002","Thermostat moteur 89 degres avec joint",45.0, renault, bosch, refroid,
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&auto=format", 28, 10);
        saveProduit("Pompe a eau","REF-003","Pompe a eau mecanique avec joint torique",130.0, volkswagen, valeo, refroid,
            "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&auto=format", 11, 5);
        saveProduit("Ventilateur radiateur","REF-004","Moto-ventilateur electrique 12V 350W",185.0, bmw, bosch, refroid,
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format", 2, 4); // low stock

        // Transmission
        saveProduit("Embrayage Kit LUK","TRN-001","Kit embrayage complet disque plateau butee",450.0, volkswagen, bosch, transmission,
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&auto=format", 9, 4);
        saveProduit("Boite de vitesses 5V","TRN-002","Boite de vitesses manuelle 5 rapports revisee",1200.0, renault, valeo, transmission,
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&auto=format", 4, 2);
        saveProduit("Rotule de direction","TRN-003","Rotule axiale de direction gauche/droite",55.0, toyota, bosch, transmission,
            "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&auto=format", 20, 8);

        // Carrosserie
        saveProduit("Pare-chocs avant","CAR-001","Pare-chocs avant complet avec grille",280.0, peugeot, valeo, carrosserie,
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format", 6, 3);
        saveProduit("Capot moteur","CAR-002","Capot moteur acier avec amortisseurs",420.0, renault, bosch, carrosserie,
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format", 1, 2); // low stock
        saveProduit("Retroviseur electrique","CAR-003","Retroviseur exterieur electrique chauffant gauche",145.0, bmw, valeo, carrosserie,
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format", 14, 5);
    }

    private Constructeur constructeur(String nom) {
        Constructeur c = new Constructeur(); c.setNom(nom); return c;
    }
    private Constructeur save(Constructeur c) { return constructeurRepo.save(c); }

    private Fournisseur fournisseur(String nom, String email, String adresse,
                                    String tel, FournisseurType type, Fournisseur parent) {
        Fournisseur f = new Fournisseur();
        f.setNom(nom); f.setEmail(email); f.setAdresse(adresse);
        f.setTelephone(tel); f.setType(type); f.setParent(parent);
        return f;
    }
    private Fournisseur save(Fournisseur f) { return fournisseurRepo.save(f); }

    private Categorie saveCategorie(String nom) {
        Categorie c = new Categorie(); c.setNom(nom);
        return categorieRepo.save(c);
    }

    private void saveProduit(String nom, String ref, String desc, Double prix,
                              Constructeur cons, Fournisseur four, Categorie cat,
                              String imageUrl, int quantite, int quantiteMin) {
        Produit p = new Produit();
        p.setNom(nom); p.setReference(ref); p.setDescription(desc);
        p.setPrix(prix); p.setConstructeur(cons); p.setFournisseur(four);
        p.setCategorie(cat); p.setImageUrl(imageUrl); p.setGroupNode(false);
        p.setQuantite(quantite); p.setQuantiteMin(quantiteMin);
        produitRepo.save(p);
    }
}
