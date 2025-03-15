package org.isfce.pid.model.dto;

import java.math.BigDecimal;

public record LigneCmdDto(
        String nomSandwich,
        String description,
        BigDecimal prix
) {}
