package org.isfce.pid.model.dto;

import java.util.List;

public record CreateCommandeDto(
        List<CreateLigneCmdDto> lignesCmd
) {}
