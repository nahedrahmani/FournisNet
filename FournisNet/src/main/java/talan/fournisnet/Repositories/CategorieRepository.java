package talan.fournisnet.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import talan.fournisnet.Entities.Categorie;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {
    Categorie findByNom(String nom);
}
