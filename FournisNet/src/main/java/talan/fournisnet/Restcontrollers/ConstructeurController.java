package talan.fournisnet.Restcontrollers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import talan.fournisnet.Entities.Constructeur;
import talan.fournisnet.Services.ConstructeurService;

import java.util.List;

@RestController
@RequestMapping("/api/constructeurs")
public class ConstructeurController {

    private final ConstructeurService constructeurService;

    public ConstructeurController(ConstructeurService constructeurService) {
        this.constructeurService = constructeurService;
    }

    @PostMapping
    public ResponseEntity<Constructeur> add(@RequestBody Constructeur c) {
        return ResponseEntity.ok(constructeurService.save(c));
    }

    @GetMapping
    public List<Constructeur> getAll() {
        return constructeurService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Constructeur> getById(@PathVariable Long id) {
        return ResponseEntity.ok(constructeurService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Constructeur> update(@PathVariable Long id, @RequestBody Constructeur c) {
        return ResponseEntity.ok(constructeurService.update(id, c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        constructeurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
