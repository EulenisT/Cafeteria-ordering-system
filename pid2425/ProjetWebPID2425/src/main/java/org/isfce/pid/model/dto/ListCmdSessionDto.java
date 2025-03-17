package org.isfce.pid.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ListCmdSessionDto(
        Integer commandeNum,
        LocalDate date,
        String username,
        String sessionNom,
        List<LigneCmdDto> sandwiches,
        BigDecimal total
) {}
