package talan.fournisnet.Services;

import talan.fournisnet.Entities.Produit;

import java.util.List;

public interface IProduitService {
    Produit save(Produit p);

    List<Produit> getAll();

    Produit getById(Long id);

    Produit update(Long id, Produit p);

    void delete(Long id);
}
