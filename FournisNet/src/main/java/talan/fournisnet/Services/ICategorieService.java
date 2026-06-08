package talan.fournisnet.Services;

import talan.fournisnet.Entities.Categorie;
import java.util.List;

public interface ICategorieService {
    Categorie createCategorie(Categorie categorie);
    Categorie updateCategorie(Long id, Categorie categorie);
    void deleteCategorie(Long id);
    Categorie getCategorieById(Long id);
    List<Categorie> getAllCategories();
    Categorie findByNom(String nom);
}
