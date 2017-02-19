CREATE TABLE crate_types (
    crateTypeId int NOT NULL AUTO_INCREMENT,
    refSizeType int NOT NULL,
    crateTypeDesc varchar(128) NOT NULL,
    crateTypeSlots int NOT NULL,
    CONSTRAINT crate_types_pk PRIMARY KEY (crateTypeId)
);

CREATE TABLE event_transfers (
    transferId int NOT NULL AUTO_INCREMENT,
    refEvent int NOT NULL,
    refProduct int NOT NULL,
    refSizeType int NOT NULL,
    transferChangeStorage int NOT NULL,
    transferChangeCounter int NOT NULL,
    transferTS timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT event_transfers_pk PRIMARY KEY (transferId)
);

CREATE TABLE event_types (
    eventTypeId int NOT NULL AUTO_INCREMENT,
    eventTypeDesc varchar(255) NOT NULL,
    eventTypeIntern bool NOT NULL,
    eventTypeRealEvent bool NOT NULL,
    eventTypeDeleted bool NOT NULL,
    CONSTRAINT event_types_pk PRIMARY KEY (eventTypeId)
);

CREATE TABLE events (
    eventId int NOT NULL AUTO_INCREMENT,
    refEventType int NOT NULL,
    eventDesc varchar(255) NOT NULL,
    eventCashBefore decimal(8,2) NOT NULL,
    eventCashAfter decimal(8,2) NOT NULL,
    eventTip decimal(6,2) NULL,
    eventTS timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eventDT timestamp NOT NULL,
    eventActive bool NOT NULL,
    CONSTRAINT events_pk PRIMARY KEY (eventId)
);

CREATE TABLE product_additions (
    refProduct int NOT NULL,
    refSizeType int NOT NULL,
    additionDeliveryCosts decimal(5,2) NOT NULL,
    additionMinimumStock int NOT NULL,
    additionWarningSend bool NOT NULL,
    CONSTRAINT product_additions_pk PRIMARY KEY (refProduct,refSizeType)
);

CREATE TABLE product_categories (
    categoryId int NOT NULL AUTO_INCREMENT,
    categoryName varchar(128) NOT NULL,
    categoryDesc varchar(255) NOT NULL,
    categoryDeleted bool NOT NULL,
    UNIQUE INDEX nameUnique (categoryName),
    CONSTRAINT product_categories_pk PRIMARY KEY (categoryId)
);

CREATE TABLE product_crates (
    refProduct int NOT NULL,
    refCrateType int NOT NULL,
    CONSTRAINT product_crates_pk PRIMARY KEY (refProduct,refCrateType)
);

CREATE TABLE product_sizes (
    refProduct int NOT NULL,
    refSizeType int NOT NULL,
    CONSTRAINT product_sizes_pk PRIMARY KEY (refProduct,refSizeType)
);

CREATE TABLE product_units (
    unitId int NOT NULL AUTO_INCREMENT,
    unitShort varchar(8) NULL,
    unitFull varchar(64) NULL,
    UNIQUE INDEX shortUnique (unitShort),
    UNIQUE INDEX fullUnique (unitFull),
    CONSTRAINT product_units_pk PRIMARY KEY (unitId)
);

CREATE TABLE products (
    productId int NOT NULL AUTO_INCREMENT,
    refCategory int NOT NULL,
    refUnit int NOT NULL,
    productName varchar(128) NOT NULL,
    productDesc varchar(255) NULL,
    productImgFilename varchar(255) NOT NULL,
    productActive bool NOT NULL,
    productDeleted bool NOT NULL,
    productTS timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX nameUnique (productName),
    CONSTRAINT products_pk PRIMARY KEY (productId)
);

CREATE TABLE size_types (
    sizeTypeId int NOT NULL AUTO_INCREMENT,
    sizeTypeAmount decimal(7,3) NOT NULL,
    sizeTypeDesc varchar(64) NULL,
    sizeTypeDeleted bool NOT NULL,
    CONSTRAINT size_types_pk PRIMARY KEY (sizeTypeId)
);

CREATE TABLE transactions (
    transactionId int NOT NULL AUTO_INCREMENT,
    refEvent int NOT NULL,
    refProduct int NOT NULL,
    refSizeType int NOT NULL,
    transactionChangeTotal int NOT NULL,
    transactionChangeCounter int NOT NULL,
    transactionTS timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX uniques (refEvent,refProduct,refSizeType),
    CONSTRAINT transactions_pk PRIMARY KEY (transactionId)
);

ALTER TABLE crate_types ADD CONSTRAINT crate_types_size_types FOREIGN KEY crate_types_size_types (refSizeType)
    REFERENCES size_types (sizeTypeId)
    ON DELETE CASCADE;

ALTER TABLE event_transfers ADD CONSTRAINT event_transfer_events FOREIGN KEY event_transfer_events (refEvent)
    REFERENCES events (eventId)
    ON DELETE CASCADE;

ALTER TABLE event_transfers ADD CONSTRAINT event_transfers_products FOREIGN KEY event_transfers_products (refProduct)
    REFERENCES products (productId);

ALTER TABLE event_transfers ADD CONSTRAINT event_transfers_size_types FOREIGN KEY event_transfers_size_types (refSizeType)
    REFERENCES size_types (sizeTypeId);

ALTER TABLE events ADD CONSTRAINT events_event_types FOREIGN KEY events_event_types (refEventType)
    REFERENCES event_types (eventTypeId);

ALTER TABLE product_additions ADD CONSTRAINT product_additions_products FOREIGN KEY product_additions_products (refProduct)
    REFERENCES products (productId)
    ON DELETE CASCADE;

ALTER TABLE product_additions ADD CONSTRAINT product_additions_size_types FOREIGN KEY product_additions_size_types (refSizeType)
    REFERENCES size_types (sizeTypeId);

ALTER TABLE product_crates ADD CONSTRAINT product_crates_crate_types FOREIGN KEY product_crates_crate_types (refCrateType)
    REFERENCES crate_types (crateTypeId)
    ON DELETE CASCADE;

ALTER TABLE product_crates ADD CONSTRAINT product_crates_products FOREIGN KEY product_crates_products (refProduct)
    REFERENCES products (productId)
    ON DELETE CASCADE;

ALTER TABLE product_sizes ADD CONSTRAINT product_sizes_products FOREIGN KEY product_sizes_products (refProduct)
    REFERENCES products (productId)
    ON DELETE CASCADE;

ALTER TABLE product_sizes ADD CONSTRAINT product_sizes_size_types FOREIGN KEY product_sizes_size_types (refSizeType)
    REFERENCES size_types (sizeTypeId);

ALTER TABLE products ADD CONSTRAINT products_product_categories FOREIGN KEY products_product_categories (refCategory)
    REFERENCES product_categories (categoryId);

ALTER TABLE products ADD CONSTRAINT products_units FOREIGN KEY products_units (refUnit)
    REFERENCES product_units (unitId);

ALTER TABLE transactions ADD CONSTRAINT transactions_events FOREIGN KEY transactions_events (refEvent)
    REFERENCES events (eventId);

ALTER TABLE transactions ADD CONSTRAINT transactions_products FOREIGN KEY transactions_products (refProduct)
    REFERENCES products (productId);

ALTER TABLE transactions ADD CONSTRAINT transactions_size_types FOREIGN KEY transactions_size_types (refSizeType)
    REFERENCES size_types (sizeTypeId);