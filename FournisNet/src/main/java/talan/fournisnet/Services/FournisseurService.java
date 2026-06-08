package talan.fournisnet.Services;

import org.springframework.stereotype.Service;
import talan.fournisnet.Dto.FournisseurTreeDto;
import talan.fournisnet.Entities.Fournisseur;
import talan.fournisnet.Repositories.FournisseurRepository;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class FournisseurService implements IFournissuerService {

    private final FournisseurRepository fournisseurRepository;

    public FournisseurService(FournisseurRepository fournisseurRepository) {
        this.fournisseurRepository = fournisseurRepository;
    }

    @Override
    public Fournisseur save(Fournisseur f) {
        return fournisseurRepository.save(f);
    }

    @Override
    public List<Fournisseur> getAll() {
        return fournisseurRepository.findAll();
    }

    @Override
    public Fournisseur getById(Long id) {
        return fournisseurRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Fournisseur not found: " + id));
    }

    @Override
    public Fournisseur update(Long id, Fournisseur f) {
        Fournisseur existing = getById(id);
        existing.setNom(f.getNom());
        existing.setEmail(f.getEmail());
        existing.setAdresse(f.getAdresse());
        existing.setTelephone(f.getTelephone());
        existing.setType(f.getType());
        existing.setParent(f.getParent());
        return fournisseurRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        Fournisseur existing = getById(id);
        if (existing.getSousFournisseurs() != null && !existing.getSousFournisseurs().isEmpty()) {
            throw new IllegalStateException(
                "Impossible de supprimer ce fournisseur : il a des sous-fournisseurs. Supprimez-les d'abord.");
        }
        fournisseurRepository.deleteById(id);
    }

    @Override
    public List<FournisseurTreeDto> getFournisseurTree() {
        return fournisseurRepository.findByParentIsNull().stream()
                .map(FournisseurTreeDto::from)
                .collect(Collectors.toList());
    }
}