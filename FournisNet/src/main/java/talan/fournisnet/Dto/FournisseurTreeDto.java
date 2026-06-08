package talan.fournisnet.Dto;

import lombok.Getter;
import lombok.Setter;
import talan.fournisnet.Entities.Fournisseur;
import talan.fournisnet.Entities.FournisseurType;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class FournisseurTreeDto {
    private Long id;
    private String nom;
    private String email;
    private String adresse;
    private String telephone;
    private FournisseurType type;
    private List<FournisseurTreeDto> children;

    public static FournisseurTreeDto from(Fournisseur f) {
        FournisseurTreeDto dto = new FournisseurTreeDto();
        dto.setId(f.getId());
        dto.setNom(f.getNom());
        dto.setEmail(f.getEmail());
        dto.setAdresse(f.getAdresse());
        dto.setTelephone(f.getTelephone());
        dto.setType(f.getType());
        dto.setChildren(
            f.getSousFournisseurs() == null ? List.of() :
            f.getSousFournisseurs().stream()
                .map(FournisseurTreeDto::from)
                .collect(Collectors.toList())
        );
        return dto;
    }
}
