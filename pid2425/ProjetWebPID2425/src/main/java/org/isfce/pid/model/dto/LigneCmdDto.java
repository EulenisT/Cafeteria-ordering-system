package org.isfce.pid.model.dto;

import java.math.BigDecimal;

public class LigneCmdDto {
    private String type;
    private String nomSandwich;
    private String description;
    private BigDecimal prix;

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getNomSandwich() {
        return nomSandwich;
    }
    public void setNomSandwich(String nomSandwich) {
        this.nomSandwich = nomSandwich;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public BigDecimal getPrix() {
        return prix;
    }
    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }
}
