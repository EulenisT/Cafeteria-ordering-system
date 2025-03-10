package org.isfce.pid.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ListCmdSessionDto {
    private Integer commandeNum;
    private LocalDate date;
    private String username;
    private String sessionNom;
    private List<LigneCmdDto> sandwiches;
    private BigDecimal total;


    public Integer getCommandeNum() {
        return commandeNum;
    }

    public void setCommandeNum(Integer commandeNum) {
        this.commandeNum = commandeNum;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSessionNom() {
        return sessionNom;
    }

    public void setSessionNom(String sessionNom) {
        this.sessionNom = sessionNom;
    }

    public List<LigneCmdDto> getSandwiches() {
        return sandwiches;
    }

    public void setSandwiches(List<LigneCmdDto> sandwiches) {
        this.sandwiches = sandwiches;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
