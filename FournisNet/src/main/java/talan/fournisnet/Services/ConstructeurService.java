package talan.fournisnet.Services;

import org.springframework.stereotype.Service;
import talan.fournisnet.Entities.Constructeur;
import talan.fournisnet.Repositories.ConstructeurRepository;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ConstructeurService implements IConstructeurService {

    private final ConstructeurRepository constructeurRepository;

    public ConstructeurService(ConstructeurRepository constructeurRepository) {
        this.constructeurRepository = constructeurRepository;
    }

    @Override
    public Constructeur save(Constructeur c) {
        return constructeurRepository.save(c);
    }

    @Override
    public List<Constructeur> getAll() {
        return constructeurRepository.findAll();
    }

    @Override
    public Constructeur getById(Long id) {
        return constructeurRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Constructeur not found: " + id));
    }

    @Override
    public Constructeur update(Long id, Constructeur c) {
        Constructeur existing = getById(id);
        existing.setNom(c.getNom());
        return constructeurRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!constructeurRepository.existsById(id)) {
            throw new NoSuchElementException("Constructeur not found: " + id);
        }
        constructeurRepository.deleteById(id);
    }
}
