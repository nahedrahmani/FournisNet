package talan.fournisnet.Dto;

public record StockAlertDto(
        Long produitId,
        String nom,
        String reference,
        int quantite,
        int quantiteMin,
        boolean lowStock
) {}
