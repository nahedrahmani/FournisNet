package talan.fournisnet.Restcontrollers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import talan.fournisnet.Entities.Categorie;
import talan.fournisnet.Services.ICategorieService;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategorieController {

    private final ICategorieService categorieService;

    public CategorieController(ICategorieService categorieService) {
        this.categorieService = categorieService;
    }

    @GetMapping
    public ResponseEntity<List<Categorie>> getAllCategories() {
        return ResponseEntity.ok(categorieService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categorie> getCategorieById(@PathVariable Long id) {
        Categorie categorie = categorieService.getCategorieById(id);
        return categorie != null ? ResponseEntity.ok(categorie) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Categorie> createCategorie(@RequestBody Categorie categorie) {
        return ResponseEntity.ok(categorieService.createCategorie(categorie));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categorie> updateCategorie(@PathVariable Long id, @RequestBody Categorie categorie) {
        Categorie updated = categorieService.updateCategorie(id, categorie);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategorie(@PathVariable Long id) {
        categorieService.deleteCategorie(id);
        return ResponseEntity.noContent().build();
    }
}
