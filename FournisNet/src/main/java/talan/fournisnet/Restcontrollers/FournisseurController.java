package talan.fournisnet.Restcontrollers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import talan.fournisnet.Dto.FournisseurDto;
import talan.fournisnet.Dto.FournisseurTreeDto;
import talan.fournisnet.Entities.Fournisseur;
import talan.fournisnet.Entities.FournisseurType;
import talan.fournisnet.Services.FournisseurService;

import java.util.List;

@RestController
@RequestMapping("/api/fournisseurs")
public class FournisseurController {

    private final FournisseurService fournisseurService;

    public FournisseurController(FournisseurService fournisseurService) {
        this.fournisseurService = fournisseurService;
    }

    @GetMapping
    public List<Fournisseur> getAll() {
        return fournisseurService.getAll();
    }

    @GetMapping("/tree")
    public List<FournisseurTreeDto> getTree() {
        return fournisseurService.getFournisseurTree();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fournisseur> getById(@PathVariable Long id) {
        return ResponseEntity.ok(fournisseurService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Fournisseur> create(@RequestBody FournisseurDto dto) {
        Fournisseur fournisseur = new Fournisseur();
        fournisseur.setNom(dto.getNom());
        fournisseur.setEmail(dto.getEmail());
        fournisseur.setAdresse(dto.getAdresse());
        fournisseur.setTelephone(dto.getTelephone());
        fournisseur.setType(dto.getType() != null ? dto.getType() : FournisseurType.DISTRIBUTEUR);

        if (dto.getParentId() != null) {
            fournisseur.setParent(fournisseurService.getById(dto.getParentId()));
        }

        return ResponseEntity.ok(fournisseurService.save(fournisseur));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fournisseur> update(@PathVariable Long id, @RequestBody FournisseurDto dto) {
        Fournisseur updated = fournisseurService.getById(id);
        updated.setNom(dto.getNom());
        updated.setEmail(dto.getEmail());
        updated.setAdresse(dto.getAdresse());
        updated.setTelephone(dto.getTelephone());
        if (dto.getType() != null) updated.setType(dto.getType());
        if (dto.getParentId() != null) {
            updated.setParent(fournisseurService.getById(dto.getParentId()));
        } else {
            updated.setParent(null);
        }
        return ResponseEntity.ok(fournisseurService.save(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        fournisseurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
