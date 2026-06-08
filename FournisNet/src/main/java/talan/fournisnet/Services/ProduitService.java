package talan.fournisnet.Services;

import org.springframework.stereotype.Service;
import talan.fournisnet.Entities.Produit;
import talan.fournisnet.Repositories.ProduitRepository;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProduitService implements IProduitService {

    private final ProduitRepository produitRepository;

    public ProduitService(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    @Override
    public Produit save(Produit p) {
        return produitRepository.save(p);
    }

    @Override
    public List<Produit> getAll() {
        return produitRepository.findAll();
    }

    @Override
    public Produit getById(Long id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Produit not found: " + id));
    }

    @Override
    public Produit update(Long id, Produit p) {
        Produit existing = getById(id);
        existing.setNom(p.getNom());
        existing.setReference(p.getReference());
        existing.setDescription(p.getDescription());
        existing.setPrix(p.getPrix());
        existing.setParentId(p.getParentId());
        existing.setParent(p.getParent());
        existing.setFournisseur(p.getFournisseur());
        existing.setConstructeur(p.getConstructeur());
        existing.setCategorie(p.getCategorie());
        return produitRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!produitRepository.existsById(id)) {
            throw new NoSuchElementException("Produit not found: " + id);
        }
        produitRepository.deleteById(id);
    }
}
