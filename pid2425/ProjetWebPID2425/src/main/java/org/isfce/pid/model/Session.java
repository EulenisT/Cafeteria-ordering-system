package org.isfce.pid.model;

import java.time.LocalTime;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class Session {
    public enum EtatSession {
        OUVERTE, CLOTUREE, FERMEE
    };

    private final String nom;
    private EtatSession etat;
    private Boolean active;
    private LocalTime heureCloture;

    public Session(String nom, LocalTime heureCloture) {
        this.nom = nom;
        this.active = false;
        this.etat = EtatSession.FERMEE;
        this.heureCloture = heureCloture;
    }

    public void setActive() {
        active = true;
        etat = EtatSession.FERMEE;
    }

    public void desactiverSession() {
        if (!EtatSession.CLOTUREE.equals(etat)) {
            active = false;
        }
    }

    public boolean estOuverte() {
        return active && etat == EtatSession.OUVERTE;
    }

    public void ouvrir() {
        if (active && EtatSession.FERMEE.equals(etat) && this.heureCloture.isAfter(LocalTime.now()))
            etat = EtatSession.OUVERTE;
    }

    public void cloture() {
        if (active && EtatSession.OUVERTE.equals(etat))
            etat = EtatSession.CLOTUREE;
    }

    public void forceOuvrir() {
        if (active) {
            etat = EtatSession.OUVERTE;
        }
    }

    public void forceCloturer() {
        if (active && etat == EtatSession.OUVERTE) {
            etat = EtatSession.CLOTUREE;
        }
    }

    public void forceFermer() {
        if (active && etat == EtatSession.CLOTUREE) {
            etat = EtatSession.FERMEE;
        }
    }
}
