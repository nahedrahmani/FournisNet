package talan.fournisnet.Services;

import talan.fournisnet.Dto.FournisseurTreeDto;
import talan.fournisnet.Entities.Fournisseur;

import java.util.List;

public interface IFournissuerService {
    Fournisseur save(Fournisseur f);
    List<Fournisseur> getAll();
    Fournisseur getById(Long id);
    Fournisseur update(Long id, Fournisseur f);
    void delete(Long id);
    List<FournisseurTreeDto> getFournisseurTree();
}
