CREATE TABLE crate_types (
    crateTypeId int NOT NULL AUTO_INCREMENT,
    crateTypeRefSizeType int NOT NULL,
    crateTypeDesc varchar(128) NOT NULL,
    crateTypeSlots int NOT NULL,
    CONSTRAINT crate_types_pk PRIMARY KEY (crateTypeId)
);

CREATE TABLE event_notes (
    eventNoteId int NOT NULL AUTO_INCREMENT,
    eventNoteRefEvent int NOT NULL,
    eventNoteText text NOT NULL,
    eventNoteTS timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eventNoteUser varchar(64) NOT NULL DEFAULT 'Anonymous',
    CONSTRAINT event_notes_pk PRIMARY KEY (eventNoteId)
);

CREATE TABLE event_transactions (
    transactionId int NOT NULL AUTO_INCREMENT,
    transactionRefEvent int NOT NULL,
    transactionRefProduct int NOT NULL,
    transactionRefSizeType int NOT NULL,
    transactionChangeTotal int NOT NULL,
    transactionChangeCounter int NOT NULL,
    transactionTS timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX uniques (transactionRefEvent,transactionRefProduct,transactionRefSizeType),
    CONSTRAINT event_transactions_pk PRIMARY KEY (transactionId)
);

CREATE TABLE event_transfers (
    transferId int NOT NULL AUTO_INCREMENT,
    transferRefEvent int NOT NULL,
    transferRefProduct int NOT NULL,
    transferRefSizeType int NOT NULL,
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
    eventTypeUiMode varchar(32) NOT NULL,
    eventTypeIcon varchar(32) NOT NULL,
    eventTypeCountAllowed bool NOT NULL,
    CONSTRAINT event_types_pk PRIMARY KEY (eventTypeId)
);

CREATE TABLE events (
    eventId int NOT NULL AUTO_INCREMENT,
    eventRefEventType int NOT NULL,
    eventDesc varchar(255) NOT NULL,
    eventCashBefore decimal(8,2) NOT NULL,
    eventCashAfter decimal(8,2) NOT NULL,
    eventTip decimal(6,2) NULL,
    eventTS timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eventDT timestamp NOT NULL,
    eventActive bool NOT NULL,
    eventCountedCounter bool NOT NULL,
    eventCountedStorage bool NOT NULL,
    CONSTRAINT events_pk PRIMARY KEY (eventId)
);

CREATE TABLE info (
    infoId int NOT NULL AUTO_INCREMENT,
    devMode bool NOT NULL,
    CONSTRAINT info_pk PRIMARY KEY (infoId)
);

CREATE TABLE logs (
    logId int NOT NULL AUTO_INCREMENT,
    logMethod varchar(16) NOT NULL,
    logPath text NOT NULL,
    logPayload text NOT NULL,
    logUser varchar(32) NOT NULL DEFAULT 'Anonymous',
    logTS timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT logs_pk PRIMARY KEY (logId)
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
    crateRefProduct int NOT NULL,
    crateRefCrateType int NOT NULL,
    CONSTRAINT product_crates_pk PRIMARY KEY (crateRefProduct,crateRefCrateType)
);

CREATE TABLE product_sizes (
    sizeRefProduct int NOT NULL,
    sizeRefSizeType int NOT NULL,
    sizeDeliveryCosts decimal(5,2) NOT NULL,
    sizeMinimumStock int NOT NULL,
    sizeActive bool NOT NULL,
    CONSTRAINT product_sizes_pk PRIMARY KEY (sizeRefProduct,sizeRefSizeType)
);

CREATE TABLE product_units (
    unitId int NOT NULL AUTO_INCREMENT,
    unitShort varchar(8) NULL,
    unitFull varchar(64) NULL,
    unitDeleted bool NOT NULL,
    UNIQUE INDEX shortUnique (unitShort),
    UNIQUE INDEX fullUnique (unitFull),
    CONSTRAINT product_units_pk PRIMARY KEY (unitId)
);

CREATE TABLE products (
    productId int NOT NULL AUTO_INCREMENT,
    productRefCategory int NOT NULL,
    productRefUnit int NOT NULL,
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
    sizeTypeRefUnit int NOT NULL,
    CONSTRAINT size_types_pk PRIMARY KEY (sizeTypeId)
);

ALTER TABLE crate_types ADD CONSTRAINT crate_types_size_types FOREIGN KEY crate_types_size_types (crateTypeRefSizeType)
    REFERENCES size_types (sizeTypeId)
    ON DELETE CASCADE;

ALTER TABLE event_notes ADD CONSTRAINT event_notes_events FOREIGN KEY event_notes_events (eventNoteRefEvent)
    REFERENCES events (eventId)
    ON DELETE CASCADE;

ALTER TABLE event_transactions ADD CONSTRAINT event_transactions_events FOREIGN KEY event_transactions_events (transactionRefEvent)
    REFERENCES events (eventId);

ALTER TABLE event_transactions ADD CONSTRAINT event_transactions_products FOREIGN KEY event_transactions_products (transactionRefProduct)
    REFERENCES products (productId);

ALTER TABLE event_transactions ADD CONSTRAINT event_transactions_size_types FOREIGN KEY event_transactions_size_types (transactionRefSizeType)
    REFERENCES size_types (sizeTypeId);

ALTER TABLE event_transfers ADD CONSTRAINT event_transfer_events FOREIGN KEY event_transfer_events (transferRefEvent)
    REFERENCES events (eventId)
    ON DELETE CASCADE;

ALTER TABLE event_transfers ADD CONSTRAINT event_transfers_products FOREIGN KEY event_transfers_products (transferRefProduct)
    REFERENCES products (productId);

ALTER TABLE event_transfers ADD CONSTRAINT event_transfers_size_types FOREIGN KEY event_transfers_size_types (transferRefSizeType)
    REFERENCES size_types (sizeTypeId);

ALTER TABLE events ADD CONSTRAINT events_event_types FOREIGN KEY events_event_types (eventRefEventType)
    REFERENCES event_types (eventTypeId);

ALTER TABLE product_crates ADD CONSTRAINT product_crates_crate_types FOREIGN KEY product_crates_crate_types (crateRefCrateType)
    REFERENCES crate_types (crateTypeId)
    ON DELETE CASCADE;

ALTER TABLE product_crates ADD CONSTRAINT product_crates_products FOREIGN KEY product_crates_products (crateRefProduct)
    REFERENCES products (productId)
    ON DELETE CASCADE;

ALTER TABLE product_sizes ADD CONSTRAINT product_sizes_products FOREIGN KEY product_sizes_products (sizeRefProduct)
    REFERENCES products (productId)
    ON DELETE CASCADE;

ALTER TABLE product_sizes ADD CONSTRAINT product_sizes_size_types FOREIGN KEY product_sizes_size_types (sizeRefSizeType)
    REFERENCES size_types (sizeTypeId);

ALTER TABLE products ADD CONSTRAINT products_product_categories FOREIGN KEY products_product_categories (productRefCategory)
    REFERENCES product_categories (categoryId);

ALTER TABLE products ADD CONSTRAINT products_units FOREIGN KEY products_units (productRefUnit)
    REFERENCES product_units (unitId);

ALTER TABLE size_types ADD CONSTRAINT size_types_product_units FOREIGN KEY size_types_product_units (sizeTypeRefUnit)
    REFERENCES product_units (unitId);