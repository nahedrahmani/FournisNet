package talan.fournisnet.Repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import talan.fournisnet.Entities.Produit;

import java.util.List;
import java.util.Optional;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
    List<Produit> findByParentIsNull();
    Optional<Produit> findByExternalId(Long externalId);

    // ── Paginated catalogue queries (groupNode=false only) ──────────

    @Query("SELECT p FROM Produit p WHERE p.groupNode = false")
    Page<Produit> findAllProducts(Pageable pageable);

    @Query("SELECT p FROM Produit p WHERE p.groupNode = false " +
           "AND (LOWER(p.nom) LIKE LOWER(CONCAT('%',:search,'%')) " +
           "  OR LOWER(p.reference) LIKE LOWER(CONCAT('%',:search,'%')))")
    Page<Produit> findProductsBySearch(@Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Produit p WHERE p.groupNode = false AND p.categorie.id = :categorieId")
    Page<Produit> findProductsByCategorieId(@Param("categorieId") Long categorieId, Pageable pageable);

    @Query("SELECT p FROM Produit p WHERE p.groupNode = false AND p.categorie.id = :categorieId " +
           "AND LOWER(p.nom) LIKE LOWER(CONCAT('%',:search,'%'))")
    Page<Produit> findProductsBySearchAndCategorie(@Param("search") String search,
                                                    @Param("categorieId") Long categorieId,
                                                    Pageable pageable);

    // Low stock — products where current quantity <= minimum threshold
    @Query("SELECT p FROM Produit p WHERE p.quantite IS NOT NULL AND p.quantiteMin IS NOT NULL AND p.quantite <= p.quantiteMin")
    List<Produit> findLowStockProducts();
}
