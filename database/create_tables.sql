CREATE TABLE crate_types (
   crateTypeId int NOT NULL AUTO_INCREMENT,
   refSize int NOT NULL,
   description varchar(128) NOT NULL,
   slots int NOT NULL,
   CONSTRAINT crate_types_pk PRIMARY KEY (crateTypeId)
);

CREATE TABLE event_transfers (
    transferId int NOT NULL AUTO_INCREMENT,
    refEvent int NOT NULL,
    refProduct int NOT NULL,
    refSize int NOT NULL,
    changeStorage int NOT NULL,
    changeCounter int NOT NULL,
    timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT event_transfers_pk PRIMARY KEY (transferId)
);

CREATE TABLE event_types (
    eventTypeId int NOT NULL AUTO_INCREMENT,
    description varchar(255) NOT NULL,
    intern bool NOT NULL,
    realEvent bool NOT NULL,
    deleted bool NOT NULL,
    CONSTRAINT event_types_pk PRIMARY KEY (eventTypeId)
);

CREATE TABLE events (
    eventId int NOT NULL AUTO_INCREMENT,
    refEventType int NOT NULL,
    description varchar(255) NOT NULL,
    cashBefore decimal(8,2) NOT NULL,
    cashAfter decimal(8,2) NOT NULL,
    tip decimal(6,2) NULL,
    timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    datetime timestamp NOT NULL,
    active bool NOT NULL,
    CONSTRAINT events_pk PRIMARY KEY (eventId)
);

CREATE TABLE product_categories (
    categoryId int NOT NULL AUTO_INCREMENT,
    name varchar(128) NOT NULL,
    description varchar(255) NOT NULL,
    deleted bool NOT NULL,
    UNIQUE INDEX nameUnique (name),
    CONSTRAINT product_categories_pk PRIMARY KEY (categoryId)
);

CREATE TABLE product_crates (
    refProduct int NOT NULL,
    refCrateType int NOT NULL,
    CONSTRAINT product_crates_pk PRIMARY KEY (refProduct,refCrateType)
);

CREATE TABLE product_sizes (
    refProduct int NOT NULL,
    refSize int NOT NULL,
    CONSTRAINT product_sizes_pk PRIMARY KEY (refProduct,refSize)
);

CREATE TABLE product_units (
    unitId int NOT NULL AUTO_INCREMENT,
    short varchar(8) NULL,
    full varchar(64) NULL,
    UNIQUE INDEX shortUnique (short),
    UNIQUE INDEX fullUnique (full),
    CONSTRAINT product_units_pk PRIMARY KEY (unitId)
);

CREATE TABLE products (
    productId int NOT NULL AUTO_INCREMENT,
    refCategory int NOT NULL,
    refUnit int NOT NULL,
    name varchar(128) NOT NULL,
    description varchar(255) NULL,
    priceIntern decimal(5,2) NOT NULL,
    imgFilename varchar(255) NOT NULL,
    active bool NOT NULL,
    deleted bool NOT NULL,
    timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX nameUnique (name),
    CONSTRAINT products_pk PRIMARY KEY (productId)
);

CREATE TABLE size_types (
    sizeTypeId int NOT NULL AUTO_INCREMENT,
    amount decimal(7,3) NOT NULL,
    description varchar(64) NULL,
    deleted bool NOT NULL,
    CONSTRAINT size_types_pk PRIMARY KEY (sizeTypeId)
);

CREATE TABLE transactions (
    transactionId int NOT NULL AUTO_INCREMENT,
    refEvent int NOT NULL,
    refProduct int NOT NULL,
    refSize int NOT NULL,
    changeTotal int NOT NULL,
    changeCounter int NOT NULL,
    timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX uniques (refEvent,refProduct,refSize),
    CONSTRAINT transactions_pk PRIMARY KEY (transactionId)
);

ALTER TABLE crate_types ADD CONSTRAINT crate_types_size_types FOREIGN KEY crate_types_size_types (refSize)
    REFERENCES size_types (sizeTypeId)
    ON DELETE CASCADE;

ALTER TABLE event_transfers ADD CONSTRAINT event_transfer_events FOREIGN KEY event_transfer_events (refEvent)
    REFERENCES events (eventId)
    ON DELETE CASCADE;

ALTER TABLE event_transfers ADD CONSTRAINT event_transfers_products FOREIGN KEY event_transfers_products (refProduct)
    REFERENCES products (productId);

ALTER TABLE event_transfers ADD CONSTRAINT event_transfers_size_types FOREIGN KEY event_transfers_size_types (refSize)
    REFERENCES size_types (sizeTypeId);

ALTER TABLE events ADD CONSTRAINT events_event_types FOREIGN KEY events_event_types (refEventType)
    REFERENCES event_types (eventTypeId);

ALTER TABLE product_crates ADD CONSTRAINT product_crates_crate_types FOREIGN KEY product_crates_crate_types (refCrateType)
    REFERENCES crate_types (crateTypeId)
    ON DELETE CASCADE;

ALTER TABLE product_crates ADD CONSTRAINT product_crates_products FOREIGN KEY product_crates_products (refProduct)
    REFERENCES products (productId)
    ON DELETE CASCADE;

ALTER TABLE product_sizes ADD CONSTRAINT product_sizes_products FOREIGN KEY product_sizes_products (refProduct)
    REFERENCES products (productId)
    ON DELETE CASCADE;

ALTER TABLE product_sizes ADD CONSTRAINT product_sizes_size_types FOREIGN KEY product_sizes_size_types (refSize)
    REFERENCES size_types (sizeTypeId);

ALTER TABLE products ADD CONSTRAINT products_product_categories FOREIGN KEY products_product_categories (refCategory)
    REFERENCES product_categories (categoryId);

ALTER TABLE products ADD CONSTRAINT products_units FOREIGN KEY products_units (refUnit)
    REFERENCES product_units (unitId);

ALTER TABLE transactions ADD CONSTRAINT transactions_events FOREIGN KEY transactions_events (refEvent)
    REFERENCES events (eventId);

ALTER TABLE transactions ADD CONSTRAINT transactions_products FOREIGN KEY transactions_products (refProduct)
    REFERENCES products (productId);

ALTER TABLE transactions ADD CONSTRAINT transactions_size_types FOREIGN KEY transactions_size_types (refSize)
    REFERENCES size_types (sizeTypeId);