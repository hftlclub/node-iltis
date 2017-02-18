-- Data of these insert-commands are just samples.
-- Therefore prices and products are not equal with the operational systems data.

INSERT INTO `size_types`(`amount`, `description`, `deleted`) VALUES (0.2, 'Flasche', false);
INSERT INTO `size_types`(`amount`, `description`, `deleted`) VALUES (0.33, 'Flasche', false);
INSERT INTO `size_types`(`amount`, `description`, `deleted`) VALUES (0.5, 'Flasche', false);
INSERT INTO `size_types`(`amount`, `description`, `deleted`) VALUES (0.7, 'Flasche', false);
INSERT INTO `size_types`(`amount`, `description`, `deleted`) VALUES (1.0, 'Flasche', false);
INSERT INTO `size_types`(`amount`, `description`, `deleted`) VALUES (1.5, 'Flasche', false);
INSERT INTO `size_types`(`amount`, `description`, `deleted`) VALUES (1, 'Dose', false);
INSERT INTO `size_types`(`amount`, `description`, `deleted`) VALUES (1, 'Packung', false);
INSERT INTO `size_types`(`amount`, `description`, `deleted`) VALUES (1, 'Stück', false);
INSERT INTO `size_types`(`amount`, `description`, `deleted`) VALUES (5, 'Beutel', false);
INSERT INTO `size_types`(`amount`, `description`, `deleted`) VALUES (2, 'Beutel', false);

INSERT INTO `product_units`(`short`, `full`) VALUES (null, null);
INSERT INTO `product_units`(`short`, `full`) VALUES ('l', 'Liter');
INSERT INTO `product_units`(`short`, `full`) VALUES ('kg', 'Kilogramm');

INSERT INTO `event_types`(`description`, `intern`, `realEvent`,`deleted`) VALUES ('Afterwork', false, true, false);
INSERT INTO `event_types`(`description`, `intern`, `realEvent`,`deleted`) VALUES ('Privatparty', false, true, false);
INSERT INTO `event_types`(`description`, `intern`, `realEvent`,`deleted`) VALUES ('Clubsitzung', true, true, false);
INSERT INTO `event_types`(`description`, `intern`, `realEvent`,`deleted`) VALUES ('Spontanentnahme', true, false, false);
INSERT INTO `event_types`(`description`, `intern`, `realEvent`,`deleted`) VALUES ('Einkauf', true, false, false);

INSERT INTO `product_categories`(`name`, `description`, `deleted`) VALUES ('Bier', 'Bier, Mischbier, und alkoholfreies Bier', false);
INSERT INTO `product_categories`(`name`, `description`, `deleted`) VALUES ('AFG', 'Alkoholfreie Getränke', false);
INSERT INTO `product_categories`(`name`, `description`, `deleted`) VALUES ('Wein und Sekt', 'Wein, Sekt, Glühwein, Bowle', false);
INSERT INTO `product_categories`(`name`, `description`, `deleted`) VALUES ('Snacks', 'Salzstangen, Erdnüsse, ...', false);
INSERT INTO `product_categories`(`name`, `description`, `deleted`) VALUES ('Obst und Gemüse', 'Limetten, Gurken, ...', false);
INSERT INTO `product_categories`(`name`, `description`, `deleted`) VALUES ('Sonstiges', 'Sonstige Lebensmittel', false);

INSERT INTO `products`(`refCategory`, `refUnit`, `name`, `description`, `priceIntern`, `imgFilename`, `active`, `deleted`) VALUES (1, 2, 'Ur-Krostitzer', 'Sächsiches Bier', 0.80, '/images/sample.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `name`, `description`, `priceIntern`, `imgFilename`, `active`, `deleted`) VALUES (1, 2, 'Augustiner', 'Bayrisches Bier', 0.90, '/images/sample.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `name`, `description`, `priceIntern`, `imgFilename`, `active`, `deleted`) VALUES (2, 2, 'Fanta', 'Softdrink', 2.00, '/images/sample.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `name`, `description`, `priceIntern`, `imgFilename`, `active`, `deleted`) VALUES (2, 2, 'Cola', 'Softdrink', 2.00, '/images/sample.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `name`, `description`, `priceIntern`, `imgFilename`, `active`, `deleted`) VALUES (3, 2, 'Sekt', null, 3.00, '/images/sample.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `name`, `description`, `priceIntern`, `imgFilename`, `active`, `deleted`) VALUES (3, 2, 'Glühwein', 'Wintergetränk', 2.00, '/images/sample.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `name`, `description`, `priceIntern`, `imgFilename`, `active`, `deleted`) VALUES (4, 1, 'Salzstangen', null, 1.2, '/images/sample.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `name`, `description`, `priceIntern`, `imgFilename`, `active`, `deleted`) VALUES (4, 1, 'Erdnüsse', null, 1.2, '/images/sample.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `name`, `description`, `priceIntern`, `imgFilename`, `active`, `deleted`) VALUES (5, 1, 'Limetten', 'Für Cocktails', 0.7, '/images/sample.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `name`, `description`, `priceIntern`, `imgFilename`, `active`, `deleted`) VALUES (5, 1, 'Gurken', 'Für Cocktails', 1.50, '/images/sample.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `name`, `description`, `priceIntern`, `imgFilename`, `active`, `deleted`) VALUES (6, 3, 'Eis', 'Für Cocktails', 4.00, '/images/sample.png', true, false);

INSERT INTO `product_sizes`(`refProduct`, `refSize`) VALUES (1, 3);
INSERT INTO `product_sizes`(`refProduct`, `refSize`) VALUES (2, 3);
INSERT INTO `product_sizes`(`refProduct`, `refSize`) VALUES (3, 5);
INSERT INTO `product_sizes`(`refProduct`, `refSize`) VALUES (4, 5);
INSERT INTO `product_sizes`(`refProduct`, `refSize`) VALUES (5, 1);
INSERT INTO `product_sizes`(`refProduct`, `refSize`) VALUES (5, 4);
INSERT INTO `product_sizes`(`refProduct`, `refSize`) VALUES (6, 5);
INSERT INTO `product_sizes`(`refProduct`, `refSize`) VALUES (7, 9);
INSERT INTO `product_sizes`(`refProduct`, `refSize`) VALUES (8, 10);
INSERT INTO `product_sizes`(`refProduct`, `refSize`) VALUES (9, 9);
INSERT INTO `product_sizes`(`refProduct`, `refSize`) VALUES (10, 9);
INSERT INTO `product_sizes`(`refProduct`, `refSize`) VALUES (11, 10);

INSERT INTO `crate_types`(`refSize`, `description`, `slots`) VALUES (2, 'Kasten', 24);
INSERT INTO `crate_types`(`refSize`, `description`, `slots`) VALUES (3, 'Kasten', 20);
INSERT INTO `crate_types`(`refSize`, `description`, `slots`) VALUES (5, 'Kasten', 12);
INSERT INTO `crate_types`(`refSize`, `description`, `slots`) VALUES (3, 'Kasten', 11);
INSERT INTO `crate_types`(`refSize`, `description`, `slots`) VALUES (4, 'Kolli', 6);
INSERT INTO `crate_types`(`refSize`, `description`, `slots`) VALUES (9, 'Stiege', 24);

INSERT INTO `product_crates`(`refProduct`, `refCrateType`) VALUES (1, 2);
INSERT INTO `product_crates`(`refProduct`, `refCrateType`) VALUES (1, 4);
INSERT INTO `product_crates`(`refProduct`, `refCrateType`) VALUES (2, 2);
INSERT INTO `product_crates`(`refProduct`, `refCrateType`) VALUES (3, 3);
INSERT INTO `product_crates`(`refProduct`, `refCrateType`) VALUES (4, 3);
INSERT INTO `product_crates`(`refProduct`, `refCrateType`) VALUES (9, 6);

INSERT INTO `events`(`refEventType`, `description`, `cashBefore`, `cashAfter`, `tip`, `datetime`, `active`) VALUES (5 , 'Initialisere Lagerbestand', 0, 0, 0, now(), false);
INSERT INTO `events`(`refEventType`, `description`, `cashBefore`, `cashAfter`, `tip`, `datetime`, `active`) VALUES (1 , 'Afterwork mit Basti und Alex', 500, 865.50, 5.42, now(), false);
INSERT INTO `events`(`refEventType`, `description`, `cashBefore`, `cashAfter`, `tip`, `datetime`, `active`) VALUES (1 , 'Afterwork mit Robi und Ferdi', 500, 865.50, 5.42, now(), true);

INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (1, 1, 3, 2000, 60);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (1, 2, 3, 400, 30);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (1, 3, 5, 240, 2);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (1, 4, 6, 360, 4);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (1, 5, 1, 24, 4);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (1, 5, 4, 6, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (1, 6, 5, 20, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (1, 7, 9, 30, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (1, 8, 10, 30, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (1, 9, 9, 20, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (1, 10, 9, 1, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (1, 11, 10, 4, 0);

INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (2, 1, 3, -30, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (2, 2, 3, -10, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (2, 3, 5, -1, -1);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (2, 4, 6, -4, 1);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (2, 7, 9, -2, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (2, 8, 10, -3, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (2, 9, 9, -10, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (2, 10, 9, -1, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSize`, `changeTotal`, `changeCounter`) VALUES (2, 11, 10, 4, 0);

INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSize`, `changeStorage`, `changeCounter`) VALUES (3, 2, 3, -20, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSize`, `changeStorage`, `changeCounter`) VALUES (3, 1, 3, -20, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSize`, `changeStorage`, `changeCounter`) VALUES (3, 4, 5, -12, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSize`, `changeStorage`, `changeCounter`) VALUES (3, 1, 3, -20, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSize`, `changeStorage`, `changeCounter`) VALUES (3, 4, 5, +8, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSize`, `changeStorage`, `changeCounter`) VALUES (3, 1, 3, +5, 0);

INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSize`, `changeStorage`, `changeCounter`) VALUES (3, 1, 3, 0, 60);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSize`, `changeStorage`, `changeCounter`) VALUES (3, 2, 3, 0, 30);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSize`, `changeStorage`, `changeCounter`) VALUES (1, 3, 5, 0, 1);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSize`, `changeStorage`, `changeCounter`) VALUES (3, 4, 5, 0, 5);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSize`, `changeStorage`, `changeCounter`) VALUES (1, 5, 1, 0, 4);