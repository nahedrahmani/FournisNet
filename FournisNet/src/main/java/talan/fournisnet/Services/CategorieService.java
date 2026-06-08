package talan.fournisnet.Services;

import org.springframework.stereotype.Service;
import talan.fournisnet.Entities.Categorie;
import talan.fournisnet.Repositories.CategorieRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CategorieService implements ICategorieService {

    private final CategorieRepository categorieRepository;

    public CategorieService(CategorieRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }

    @Override
    public Categorie createCategorie(Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    @Override
    public Categorie updateCategorie(Long id, Categorie categorie) {
        Optional<Categorie> existing = categorieRepository.findById(id);
        if (existing.isPresent()) {
            Categorie cat = existing.get();
            cat.setNom(categorie.getNom());
            cat.setArborescence(categorie.getArborescence());
            return categorieRepository.save(cat);
        }
        return null;
    }

    @Override
    public void deleteCategorie(Long id) {
        categorieRepository.deleteById(id);
    }

    @Override
    public Categorie getCategorieById(Long id) {
        return categorieRepository.findById(id).orElse(null);
    }

    @Override
    public List<Categorie> getAllCategories() {
        return categorieRepository.findAll();
    }

    @Override
    public Categorie findByNom(String nom) {
        return categorieRepository.findByNom(nom);
    }
}
