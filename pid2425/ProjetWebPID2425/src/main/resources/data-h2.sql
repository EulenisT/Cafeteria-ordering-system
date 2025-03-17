Merge into TARTICLE(CODE,NOM,DISPONIBLE) values
('BOUL','Boulette',true),
('POUL','Poulet Curry',true),
('JBFR','Jambon Fromage',true),
('FROM','Fromage',true),
('MY','Mayonnaise',true),
('TT','Tomate',true),
('MT','Moutarde',true),
('BZ','Brazil',false),
('SA', 'Salade', true),
('TO', 'Tomates', false),
('OE', 'Oeufs', true),
('MA', 'Maïs', true),
('CA', 'Carottes', false);

MERGE into TSANDWICHES(CODE,PRIX) values 
('BOUL',3.5),
('POUL',3.5),
('JBFR',3.2),
('FROM',3.0);

MERGE INTO TGARNITURE(CODE) VALUES
('SA'),
('TO'),
('OE'),
('MA'),
('CA');

MERGE into TSAUCES(CODE) values
('MY'),
('TT'),
('MT'),
('BZ');

MERGE into TUSER(username,email,nom,prenom,solde) values
('dvo','vo@isfce.be','VO','Didier',100.0),
('et1','et1@isfce.be','Nom Et1','Prénom Et1',150.3),
('val','val@isfce.be','DeLaCafet','Valeri',10.0);