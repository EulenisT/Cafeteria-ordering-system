package org.isfce.pid.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.isfce.pid.dao.ICommandeDao;
import org.isfce.pid.model.Commande;
import org.isfce.pid.model.User;
import org.isfce.pid.model.dto.ListCmdSessionDto;
import org.isfce.pid.service.CommandeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
@Import(TestCacheConfig.class)
public class CommandeServiceCacheTest {

    @Autowired
    private CommandeService commandeService;

    @MockBean
    private ICommandeDao commandeDao;

    @Test
    void testGetCommandeByIdCaching() {
        Integer id = 1;
        Commande commande = new Commande();
        commande.setNum(id);

        when(commandeDao.findById(id)).thenReturn(Optional.of(commande));

        // Primera invocación: se debe llamar al DAO y almacenar en caché el resultado.
        Optional<Commande> firstCall = commandeService.getCommandeById(id);
        // Segunda invocación: se espera que se obtenga desde la caché.
        Optional<Commande> secondCall = commandeService.getCommandeById(id);

        assertEquals(firstCall, secondCall);
        verify(commandeDao, times(1)).findById(id);
    }

    @Test
    void testGetAllCommandesBySessionCaching() {
        String sessionNom = "SESSION_TEST";
        List<Commande> commandes = List.of(new Commande());
        when(commandeDao.findBySessionNom(sessionNom)).thenReturn(commandes);

        List<Commande> firstCall = commandeService.getAllCommandesBySession(sessionNom);
        List<Commande> secondCall = commandeService.getAllCommandesBySession(sessionNom);

        assertEquals(firstCall, secondCall);
        // Verificamos que el méodo del DAO se invoque solo una vez
        verify(commandeDao, times(1)).findBySessionNom(sessionNom);
    }

    @Test
    void testGetCommandesBySessionAndDateCaching() {
        String sessionNom = "SESSION_TEST";
        LocalDate date = LocalDate.of(2025, 4, 6);

        // Crear un objeto Commande dummy con los datos mínimos requeridos
        Commande commande = new Commande();
        commande.setNum(1);
        commande.setDate(date);
        commande.setSessionNom(sessionNom);
        // Configurar un usuario dummy
        User user = new User(
                "testuser",
                "test@example.com",
                "TestNom",
                "TestPrenom",
                BigDecimal.valueOf(100),
                new ArrayList<>()
        );

        commande.setUser(user);
        // Para simplificar, una lista vacía a las líneas de la commande
        commande.setLignes(List.of());

        List<Commande> commandes = List.of(commande);
        when(commandeDao.findBySessionNomAndDate(sessionNom, date)).thenReturn(commandes);

        List<ListCmdSessionDto> firstCall = commandeService.getCommandesBySessionAndDate(sessionNom, date);
        List<ListCmdSessionDto> secondCall = commandeService.getCommandesBySessionAndDate(sessionNom, date);

        assertEquals(firstCall, secondCall);
        // Verificamos que el méodo del DAO se invoque solo una vez
        verify(commandeDao, times(1)).findBySessionNomAndDate(sessionNom, date);
    }
}
