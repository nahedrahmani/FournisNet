package talan.fournisnet.Services;

import talan.fournisnet.Entities.Constructeur;

import java.util.List;

public interface IConstructeurService {
    Constructeur save(Constructeur c);
    List<Constructeur> getAll();
    Constructeur getById(Long id);
    Constructeur update(Long id, Constructeur c);
    void delete(Long id);
}
