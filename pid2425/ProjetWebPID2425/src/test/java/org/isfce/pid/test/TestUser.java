//package org.isfce.pid.test;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertTrue;
//
//import java.math.BigDecimal;
//
//import org.isfce.pid.dao.IUserDao;
//import org.isfce.pid.model.User;
//import org.isfce.pid.service.UserService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import jakarta.transaction.Transactional;
//
//@SpringBootTest
//class TestUser {
//    @Autowired
//    IUserDao dao;
//
//    @Autowired
//    UserService service;
//
//    @Test
//    @Transactional
//    void testFindMontantByUsername() {
//        var ou = dao.findById("dvo");
//        assertTrue(ou.isPresent());
//        User vo = ou.get();
//        BigDecimal m1 = vo.getSolde();
//        BigDecimal mt = BigDecimal.valueOf(10.9);
//        dao.crediterUser("dvo", mt);
//        BigDecimal m2 = dao.soldeByUsername("dvo");
//        assertEquals(0, m1.add(mt).compareTo(m2), "Le solde doit être augmenté");
//    }
//
//
//    @Test
//    @Transactional
//    void testServiceCrediter() {
//        var ou = dao.findById("dvo");
//        assertTrue(ou.isPresent());
//        User vo = ou.get();
//        BigDecimal m1 = vo.getSolde();
//        BigDecimal mt = BigDecimal.valueOf(10.9);
//        BigDecimal m2 = service.crediterUser("dvo", mt);
//        assertEquals(0, m1.add(mt).compareTo(m2), "Le solde doit être augmenté");
//    }
//
//
//    @Test
//    @Transactional
//    void testAllUserDto() {
//        var liste = service.getAllUserDto();
//        assertEquals(3, liste.size());
//    }
//
//}
