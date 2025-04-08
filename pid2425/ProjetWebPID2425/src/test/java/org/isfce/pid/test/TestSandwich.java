package org.isfce.pid.test;

import static org.junit.jupiter.api.Assertions.*;

import org.isfce.pid.dao.ISandwichDao;
import org.isfce.pid.model.Sandwiches;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

@SpringBootTest
class TestSandwich {
    @Autowired
    ISandwichDao daoSandwich;

    @Test
    void test1() {
        Sandwiches SA1= new Sandwiches("SA1","test1",true, BigDecimal.valueOf(3.5));
        daoSandwich.save(SA1);
        var oS1= daoSandwich.findById("SA1");
        assertTrue(oS1.isPresent());
        daoSandwich.deleteById("SA1");
        assertFalse(daoSandwich.existsById("SA1"));
    }

}
