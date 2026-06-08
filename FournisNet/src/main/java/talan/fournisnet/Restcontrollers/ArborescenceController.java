package talan.fournisnet.Restcontrollers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import talan.fournisnet.Entities.Produit;
import talan.fournisnet.Services.ProduitTreeService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/arbo")
public class ArborescenceController {

    private final ProduitTreeService produitTreeService;

    public ArborescenceController(ProduitTreeService produitTreeService) {
        this.produitTreeService = produitTreeService;
    }

    /**
     * Returns the product tree: root nodes only; children are nested inside each node.
     * Group nodes (groupNode=true) are catalog categories; leaf nodes are real products.
     */
    @GetMapping
    public ResponseEntity<List<Produit>> getArborescence() {
        return ResponseEntity.ok(produitTreeService.getArborescence());
    }

    /**
     * Import a 4-level catalog hierarchy from a TSV file (tab-separated, 14 columns).
     * Format: idG1 nameG1 picG1 idG2 nameG2 picG2 idG3 nameG3 picG3 idG4 nameG4 picG4 productId productName
     * Re-uploading the same file is safe — nodes with matching externalId are reused, not duplicated.
     */
    @PostMapping("/upload-catalog")
    public ResponseEntity<List<Produit>> uploadCatalog(@RequestParam("file") MultipartFile file) throws IOException {
        List<Produit> roots = produitTreeService.saveFromCatalogTsv(file);
        return ResponseEntity.ok(roots);
    }

    /**
     * Legacy import: simple comma-separated format (id, nom, categoryName, parentId).
     */
    @PostMapping("/upload")
    public ResponseEntity<List<Produit>> uploadLegacy(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(produitTreeService.saveArborescenceFromFile(file));
    }
}
