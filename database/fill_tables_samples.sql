-- Data of these insert-commands are just samples.
-- Therefore products, prices and costs are not equal with the operational systems data of the organization.

INSERT INTO `size_types`(`sizeTypeAmount`, `sizeTypeDesc`, `sizeTypeDeleted`) VALUES (0.2, 'Flasche', false);
INSERT INTO `size_types`(`sizeTypeAmount`, `sizeTypeDesc`, `sizeTypeDeleted`) VALUES (0.33, 'Flasche', false);
INSERT INTO `size_types`(`sizeTypeAmount`, `sizeTypeDesc`, `sizeTypeDeleted`) VALUES (0.5, 'Flasche', false);
INSERT INTO `size_types`(`sizeTypeAmount`, `sizeTypeDesc`, `sizeTypeDeleted`) VALUES (0.7, 'Flasche', false);
INSERT INTO `size_types`(`sizeTypeAmount`, `sizeTypeDesc`, `sizeTypeDeleted`) VALUES (1.0, 'Flasche', false);
INSERT INTO `size_types`(`sizeTypeAmount`, `sizeTypeDesc`, `sizeTypeDeleted`) VALUES (1.5, 'Flasche', false);
INSERT INTO `size_types`(`sizeTypeAmount`, `sizeTypeDesc`, `sizeTypeDeleted`) VALUES (1, 'Dose', false);
INSERT INTO `size_types`(`sizeTypeAmount`, `sizeTypeDesc`, `sizeTypeDeleted`) VALUES (1, 'Packung', false);
INSERT INTO `size_types`(`sizeTypeAmount`, `sizeTypeDesc`, `sizeTypeDeleted`) VALUES (1, 'Stück', false);
INSERT INTO `size_types`(`sizeTypeAmount`, `sizeTypeDesc`, `sizeTypeDeleted`) VALUES (5, 'Beutel', false);
INSERT INTO `size_types`(`sizeTypeAmount`, `sizeTypeDesc`, `sizeTypeDeleted`) VALUES (2, 'Beutel', false);

INSERT INTO `product_units`(`unitShort`, `unitFull`, `unitDeleted`) VALUES (null, null, false);
INSERT INTO `product_units`(`unitShort`, `unitFull`, `unitDeleted`) VALUES ('l', 'Liter', false);
INSERT INTO `product_units`(`unitShort`, `unitFull`, `unitDeleted`) VALUES ('kg', 'Kilogramm', false);

INSERT INTO `event_types`(`eventTypeDesc`, `eventTypeIntern`, `eventTypeRealEvent`,`eventTypeDeleted`, `eventTypeUiMode`,`eventTypeIcon`, `eventTypeCountAllowed`) VALUES ('Afterwork', false, true, false, 'event', 'fa-beer', true);
INSERT INTO `event_types`(`eventTypeDesc`, `eventTypeIntern`, `eventTypeRealEvent`,`eventTypeDeleted`, `eventTypeUiMode`,`eventTypeIcon`, `eventTypeCountAllowed`) VALUES ('Privatparty', false, true, false, 'event' , 'fa-glass', true);
INSERT INTO `event_types`(`eventTypeDesc`, `eventTypeIntern`, `eventTypeRealEvent`,`eventTypeDeleted`, `eventTypeUiMode`,`eventTypeIcon`, `eventTypeCountAllowed`) VALUES ('Clubsitzung', true, true, false, 'event', 'fa-users', true);
INSERT INTO `event_types`(`eventTypeDesc`, `eventTypeIntern`, `eventTypeRealEvent`,`eventTypeDeleted`, `eventTypeUiMode`,`eventTypeIcon`, `eventTypeCountAllowed`) VALUES ('Spontanentnahme', true, false, false, 'private', 'fa-hand-paper-o', false);
INSERT INTO `event_types`(`eventTypeDesc`, `eventTypeIntern`, `eventTypeRealEvent`,`eventTypeDeleted`, `eventTypeUiMode`,`eventTypeIcon`, `eventTypeCountAllowed`) VALUES ('Einkauf', true, false, false, 'purchase', 'fa-shopping-cart', false);
INSERT INTO `event_types`(`eventTypeDesc`, `eventTypeIntern`, `eventTypeRealEvent`,`eventTypeDeleted`, `eventTypeUiMode`,`eventTypeIcon`, `eventTypeCountAllowed`) VALUES ('Auswärtiges Event', false, true, false, 'event', 'fa-users', false);

INSERT INTO `product_categories`(`categoryName`, `categoryDesc`, `categoryDeleted`) VALUES ('Bier', 'Bier, Mischbier, und alkoholfreies Bier', false);
INSERT INTO `product_categories`(`categoryName`, `categoryDesc`, `categoryDeleted`) VALUES ('AFG', 'Alkoholfreie Getränke', false);
INSERT INTO `product_categories`(`categoryName`, `categoryDesc`, `categoryDeleted`) VALUES ('Wein und Sekt', 'Wein, Sekt, Glühwein, Bowle', false);
INSERT INTO `product_categories`(`categoryName`, `categoryDesc`, `categoryDeleted`) VALUES ('Snacks', 'Salzstangen, Erdnüsse, ...', false);
INSERT INTO `product_categories`(`categoryName`, `categoryDesc`, `categoryDeleted`) VALUES ('Obst und Gemüse', 'Limetten, Gurken, ...', false);
INSERT INTO `product_categories`(`categoryName`, `categoryDesc`, `categoryDeleted`) VALUES ('Sonstiges', 'Sonstige Lebensmittel', false);

INSERT INTO `products`(`refCategory`, `refUnit`, `productName`, `productDesc`, `ProductImgFilename`, `ProductActive`, `ProductDeleted`) VALUES (1, 2, 'Ur-Krostitzer', 'Sächsiches Bier', 'https://api.iltis.hftl.club/images/product-default.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `productName`, `productDesc`, `ProductImgFilename`, `ProductActive`, `ProductDeleted`) VALUES (1, 2, 'Augustiner', 'Bayrisches Bier', 'https://api.iltis.hftl.club/images/product-default.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `productName`, `productDesc`, `ProductImgFilename`, `ProductActive`, `ProductDeleted`) VALUES (2, 2, 'Fanta', 'Softdrink', 'https://api.iltis.hftl.club/images/product-default.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `productName`, `productDesc`, `ProductImgFilename`, `ProductActive`, `ProductDeleted`) VALUES (2, 2, 'Cola', 'Softdrink', 'https://api.iltis.hftl.club/images/product-default.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `productName`, `productDesc`, `ProductImgFilename`, `ProductActive`, `ProductDeleted`) VALUES (3, 2, 'Sekt', null, 'https://api.iltis.hftl.club/images/product-default.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `productName`, `productDesc`, `ProductImgFilename`, `ProductActive`, `ProductDeleted`) VALUES (3, 2, 'Glühwein', 'Wintergetränk', 'https://api.iltis.hftl.club/images/product-default.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `productName`, `productDesc`, `ProductImgFilename`, `ProductActive`, `ProductDeleted`) VALUES (4, 1, 'Salzstangen', null, 'https://api.iltis.hftl.club/images/product-default.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `productName`, `productDesc`, `ProductImgFilename`, `ProductActive`, `ProductDeleted`) VALUES (4, 1, 'Erdnüsse', null, 'https://api.iltis.hftl.club/images/product-default.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `productName`, `productDesc`, `ProductImgFilename`, `ProductActive`, `ProductDeleted`) VALUES (5, 1, 'Limetten', 'Für Cocktails', 'https://api.iltis.hftl.club/images/product-default.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `productName`, `productDesc`, `ProductImgFilename`, `ProductActive`, `ProductDeleted`) VALUES (5, 1, 'Gurken', 'Für Cocktails', 'https://api.iltis.hftl.club/images/product-default.png', true, false);
INSERT INTO `products`(`refCategory`, `refUnit`, `productName`, `productDesc`, `ProductImgFilename`, `ProductActive`, `ProductDeleted`) VALUES (6, 3, 'Eis', 'Für Cocktails', 'https://api.iltis.hftl.club/images/product-default.png', true, false);

INSERT INTO `product_sizes`(`refProduct`, `refSizeType`, `sizeDeliveryCosts`, `sizeMinimumStock`, `sizeActive`) VALUES (1, 3, 0.80, 0, true);
INSERT INTO `product_sizes`(`refProduct`, `refSizeType`, `sizeDeliveryCosts`, `sizeMinimumStock`, `sizeActive`) VALUES (2, 3, 0.90, 0, true);
INSERT INTO `product_sizes`(`refProduct`, `refSizeType`, `sizeDeliveryCosts`, `sizeMinimumStock`, `sizeActive`) VALUES (3, 5, 2.00, 0, true);
INSERT INTO `product_sizes`(`refProduct`, `refSizeType`, `sizeDeliveryCosts`, `sizeMinimumStock`, `sizeActive`) VALUES (4, 5, 2.00, 0, true);
INSERT INTO `product_sizes`(`refProduct`, `refSizeType`, `sizeDeliveryCosts`, `sizeMinimumStock`, `sizeActive`) VALUES (5, 1, 1.20, 0, true);
INSERT INTO `product_sizes`(`refProduct`, `refSizeType`, `sizeDeliveryCosts`, `sizeMinimumStock`, `sizeActive`) VALUES (5, 4, 3.50, 0, true);
INSERT INTO `product_sizes`(`refProduct`, `refSizeType`, `sizeDeliveryCosts`, `sizeMinimumStock`, `sizeActive`) VALUES (6, 5, 2.00, 0, true);
INSERT INTO `product_sizes`(`refProduct`, `refSizeType`, `sizeDeliveryCosts`, `sizeMinimumStock`, `sizeActive`) VALUES (7, 8, 1.20, 0, true);
INSERT INTO `product_sizes`(`refProduct`, `refSizeType`, `sizeDeliveryCosts`, `sizeMinimumStock`, `sizeActive`) VALUES (8, 7, 1.20, 0, true);
INSERT INTO `product_sizes`(`refProduct`, `refSizeType`, `sizeDeliveryCosts`, `sizeMinimumStock`, `sizeActive`) VALUES (9, 9, 0.70, 0, true);
INSERT INTO `product_sizes`(`refProduct`, `refSizeType`, `sizeDeliveryCosts`, `sizeMinimumStock`, `sizeActive`) VALUES (10, 9, 1.50, 0, true);
INSERT INTO `product_sizes`(`refProduct`, `refSizeType`, `sizeDeliveryCosts`, `sizeMinimumStock`, `sizeActive`) VALUES (11, 10, 4.00, 0, true);

INSERT INTO `crate_types`(`refSizeType`, `crateTypeDesc`, `crateTypeSlots`) VALUES (2, 'Kasten', 24);
INSERT INTO `crate_types`(`refSizeType`, `crateTypeDesc`, `crateTypeSlots`) VALUES (3, 'Kasten', 20);
INSERT INTO `crate_types`(`refSizeType`, `crateTypeDesc`, `crateTypeSlots`) VALUES (5, 'Kasten', 12);
INSERT INTO `crate_types`(`refSizeType`, `crateTypeDesc`, `crateTypeSlots`) VALUES (3, 'Kasten', 11);
INSERT INTO `crate_types`(`refSizeType`, `crateTypeDesc`, `crateTypeSlots`) VALUES (4, 'Kolli', 6);
INSERT INTO `crate_types`(`refSizeType`, `crateTypeDesc`, `crateTypeSlots`) VALUES (9, 'Stiege', 24);

INSERT INTO `product_crates`(`refProduct`, `refCrateType`) VALUES (1, 2);
INSERT INTO `product_crates`(`refProduct`, `refCrateType`) VALUES (1, 4);
INSERT INTO `product_crates`(`refProduct`, `refCrateType`) VALUES (2, 2);
INSERT INTO `product_crates`(`refProduct`, `refCrateType`) VALUES (3, 3);
INSERT INTO `product_crates`(`refProduct`, `refCrateType`) VALUES (4, 3);
INSERT INTO `product_crates`(`refProduct`, `refCrateType`) VALUES (9, 6);

INSERT INTO `events`(`refEventType`, `eventDesc`, `eventCashBefore`, `eventCashAfter`, `eventTip`, `eventDT`, `eventActive`, `eventCountedCounter`, `eventCountedStorage`) VALUES (5 , 'Initialisere Lagerbestand', 0, 0, 0, '2017-01-01 12:00:00', false, false, false);
INSERT INTO `events`(`refEventType`, `eventDesc`, `eventCashBefore`, `eventCashAfter`, `eventTip`, `eventDT`, `eventActive`, `eventCountedCounter`, `eventCountedStorage`) VALUES (1 , 'Afterwork mit Basti und Alex', 500, 645.00, 1.20, '2017-02-15 19:00:00', false, false, false);
INSERT INTO `events`(`refEventType`, `eventDesc`, `eventCashBefore`, `eventCashAfter`, `eventTip`, `eventDT`, `eventActive`, `eventCountedCounter`, `eventCountedStorage`) VALUES (1 , 'Afterwork mit Robi und Ferdi', 500, 865.50, 5.42, '2017-02-22 19:00:00', true, true, true);
INSERT INTO `events`(`refEventType`, `eventDesc`, `eventCashBefore`, `eventCashAfter`, `eventTip`, `eventDT`, `eventActive`, `eventCountedCounter`, `eventCountedStorage`) VALUES (6 , 'Stura Weihnachtsfeier HS C', 500, 712.50, 0.00, '2017-03-01 17:00:00', true, false, false);

INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (1, 1, 3, 2000, 60);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (1, 2, 3, 400, 30);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (1, 3, 5, 240, 2);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (1, 4, 5, 360, 4);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (1, 5, 1, 24, 4);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (1, 5, 4, 6, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (1, 6, 5, 20, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (1, 7, 8, 30, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (1, 8, 7, 30, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (1, 9, 9, 20, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (1, 10, 9, 1, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (1, 11, 10, 4, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (2, 1, 3, -30, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (2, 2, 3, -10, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (2, 3, 5, -1, -1);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (2, 4, 6, -4, 1);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (2, 7, 8, -2, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (2, 8, 7, -3, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (2, 9, 9, -10, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (2, 10, 9, -1, 0);
INSERT INTO `transactions`(`refEvent`, `refProduct`, `refSizeType`, `transactionChangeTotal`, `transactionChangeCounter`) VALUES (2, 11, 10, -4, 0);

INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (4, 2, 3, -100, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (4, 1, 3, -80, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (4, 2, 3, +20, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (4, 1, 3, -20, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (4, 1, 3, +10, 0);

INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (3, 2, 3, -20, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (3, 1, 3, -20, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (3, 4, 5, -12, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (3, 1, 3, -20, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (3, 4, 5, +8, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (3, 1, 3, +5, 0);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (3, 1, 3, 0, 5);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (3, 2, 3, 0, -5);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (3, 3, 5, 0, 1);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (3, 4, 5, 0, -1);
INSERT INTO `event_transfers`(`refEvent`, `refProduct`, `refSizeType`, `transferChangeStorage`, `transferChangeCounter`) VALUES (3, 5, 1, 0, +4);