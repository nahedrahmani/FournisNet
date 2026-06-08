package talan.fournisnet.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProduitDto {
    private String nom;
    private String reference;
    private String description;
    private Double prix;
    private Integer quantite;
    private Integer quantiteMin;
    private Long parentId;
    private Long categorieId;
    private Long constructeurId;
    private Long fournisseurId;
}
