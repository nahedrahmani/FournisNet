package talan.fournisnet.Restcontrollers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import talan.fournisnet.Repositories.CategorieRepository;
import talan.fournisnet.Repositories.ConstructeurRepository;
import talan.fournisnet.Repositories.FournisseurRepository;
import talan.fournisnet.Repositories.ProduitRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final FournisseurRepository fournisseurRepository;
    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;
    private final ConstructeurRepository constructeurRepository;

    public StatsController(FournisseurRepository fournisseurRepository,
                           ProduitRepository produitRepository,
                           CategorieRepository categorieRepository,
                           ConstructeurRepository constructeurRepository) {
        this.fournisseurRepository = fournisseurRepository;
        this.produitRepository = produitRepository;
        this.categorieRepository = categorieRepository;
        this.constructeurRepository = constructeurRepository;
    }

    @GetMapping
    public Map<String, Long> getStats() {
        return Map.of(
            "fournisseurs",   fournisseurRepository.count(),
            "produits",       produitRepository.count(),
            "categories",     categorieRepository.count(),
            "constructeurs",  constructeurRepository.count(),
            "alertesStock",   (long) produitRepository.findLowStockProducts().size()
        );
    }
}