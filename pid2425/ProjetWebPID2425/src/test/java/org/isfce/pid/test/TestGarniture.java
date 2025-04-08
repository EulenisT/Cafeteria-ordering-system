package org.isfce.pid.test;

import static org.junit.jupiter.api.Assertions.*;

import org.isfce.pid.dao.IGarnitureDao;
import org.isfce.pid.model.Garniture;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
@SpringBootTest
class TestGarniture {
    @Autowired
    IGarnitureDao daoGarniture;

    @Test
    void test1() {
        Garniture g1= new Garniture("GA1","test1",true);
        daoGarniture.save(g1);
        var oG1= daoGarniture.findById("GA1");
        assertTrue(oG1.isPresent());
        daoGarniture.deleteById("GA1");
        assertFalse(daoGarniture.existsById("GA1"));
    }

}
