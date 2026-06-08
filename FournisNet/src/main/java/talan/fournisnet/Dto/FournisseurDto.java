package talan.fournisnet.Dto;

import lombok.Getter;
import lombok.Setter;
import talan.fournisnet.Entities.FournisseurType;

@Getter
@Setter
public class FournisseurDto {
    private Long id;
    private String nom;
    private String email;
    private FournisseurType type;
    private String adresse;
    private String telephone;
    private Long parentId;
}
