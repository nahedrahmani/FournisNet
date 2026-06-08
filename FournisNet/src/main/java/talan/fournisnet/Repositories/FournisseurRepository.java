package talan.fournisnet.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import talan.fournisnet.Entities.Fournisseur;

import java.util.List;

public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {
    List<Fournisseur> findByParentIsNull();
}
