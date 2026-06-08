package talan.fournisnet.Restcontrollers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import talan.fournisnet.Dto.ProduitDto;
import talan.fournisnet.Dto.StockAlertDto;
import talan.fournisnet.Entities.Categorie;
import talan.fournisnet.Entities.Constructeur;
import talan.fournisnet.Entities.Fournisseur;
import talan.fournisnet.Entities.Produit;
import talan.fournisnet.Repositories.CategorieRepository;
import talan.fournisnet.Repositories.ConstructeurRepository;
import talan.fournisnet.Repositories.FournisseurRepository;
import talan.fournisnet.Repositories.ProduitRepository;
import talan.fournisnet.Services.ProduitService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    private final ProduitService produitService;
    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;
    private final FournisseurRepository fournisseurRepository;
    private final ConstructeurRepository constructeurRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ProduitController(ProduitService produitService,
                             ProduitRepository produitRepository,
                             CategorieRepository categorieRepository,
                             FournisseurRepository fournisseurRepository,
                             ConstructeurRepository constructeurRepository,
                             SimpMessagingTemplate messagingTemplate) {
        this.produitService = produitService;
        this.produitRepository = produitRepository;
        this.categorieRepository = categorieRepository;
        this.fournisseurRepository = fournisseurRepository;
        this.constructeurRepository = constructeurRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /** GET /api/produits?page=0&size=12&search=frein&categorieId=2 */
    @GetMapping
    public Page<Produit> getAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "")   String search,
            @RequestParam(required = false)    Long categorieId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("nom").ascending());

        if (categorieId != null && !search.isBlank()) {
            return produitRepository.findProductsBySearchAndCategorie(search, categorieId, pageable);
        } else if (categorieId != null) {
            return produitRepository.findProductsByCategorieId(categorieId, pageable);
        } else if (!search.isBlank()) {
            return produitRepository.findProductsBySearch(search, pageable);
        }
        return produitRepository.findAllProducts(pageable);
    }

    /** GET /api/produits/all — unpaginated (used by admin tables) */
    @GetMapping("/all")
    public List<Produit> getAllUnpaginated() {
        return produitService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produit> getById(@PathVariable Long id) {
        return ResponseEntity.ok(produitService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Produit> create(@RequestBody ProduitDto dto) {
        Produit produit = applyDto(new Produit(), dto);
        Produit saved = produitService.save(produit);
        broadcastStockAlert(saved);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produit> update(@PathVariable Long id, @RequestBody ProduitDto dto) {
        Produit existing = produitService.getById(id);
        applyDto(existing, dto);
        Produit saved = produitService.save(existing);
        broadcastStockAlert(saved);
        return ResponseEntity.ok(saved);
    }

    /** PATCH /api/produits/{id}/stock — dedicated stock adjustment */
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Produit> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {

        Produit produit = produitService.getById(id);

        if (body.containsKey("quantite"))    produit.setQuantite(body.get("quantite"));
        if (body.containsKey("quantiteMin")) produit.setQuantiteMin(body.get("quantiteMin"));

        Produit saved = produitService.save(produit);
        broadcastStockAlert(saved);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produitService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── helpers ─────────────────────────────────────────────

    private Produit applyDto(Produit p, ProduitDto dto) {
        p.setNom(dto.getNom());
        p.setReference(dto.getReference());
        p.setDescription(dto.getDescription());
        p.setPrix(dto.getPrix());
        if (dto.getQuantite()    != null) p.setQuantite(dto.getQuantite());
        if (dto.getQuantiteMin() != null) p.setQuantiteMin(dto.getQuantiteMin());

        if (dto.getParentId() != null) {
            Produit parent = produitRepository.findById(dto.getParentId()).orElse(null);
            p.setParent(parent);
            p.setParentId(dto.getParentId());
        } else {
            p.setParent(null);
            p.setParentId(null);
        }
        if (dto.getCategorieId()    != null)
            p.setCategorie(categorieRepository.findById(dto.getCategorieId()).orElse(null));
        if (dto.getConstructeurId() != null)
            p.setConstructeur(constructeurRepository.findById(dto.getConstructeurId()).orElse(null));
        if (dto.getFournisseurId()  != null)
            p.setFournisseur(fournisseurRepository.findById(dto.getFournisseurId()).orElse(null));
        return p;
    }

    private void broadcastStockAlert(Produit p) {
        int qty    = p.getQuantite()    != null ? p.getQuantite()    : 0;
        int qtyMin = p.getQuantiteMin() != null ? p.getQuantiteMin() : 5;
        StockAlertDto alert = new StockAlertDto(
                p.getId(), p.getNom(), p.getReference(),
                qty, qtyMin, qty <= qtyMin
        );
        messagingTemplate.convertAndSend("/topic/stock-alerts", alert);
    }
}
