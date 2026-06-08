package talan.fournisnet.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;         // Name of the client (company)
    private String email;       // Optional contact email
    private String secteur;     // Business sector (optional)

    @OneToMany(mappedBy = "client")
    private List<Arborescence> arborescences; // One client can have multiple arborescences

}
