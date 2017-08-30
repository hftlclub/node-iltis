ALTER TABLE crate_types
    DROP FOREIGN KEY crate_types_size_types;

ALTER TABLE event_transfers
    DROP FOREIGN KEY event_transfer_events;

ALTER TABLE event_transfers
    DROP FOREIGN KEY event_transfers_products;

ALTER TABLE event_transfers
    DROP FOREIGN KEY event_transfers_size_types;

ALTER TABLE events
    DROP FOREIGN KEY events_event_types;

ALTER TABLE product_crates
    DROP FOREIGN KEY product_crates_crate_types;

ALTER TABLE product_crates
    DROP FOREIGN KEY product_crates_products;

ALTER TABLE product_sizes
    DROP FOREIGN KEY product_sizes_products;

ALTER TABLE product_sizes
    DROP FOREIGN KEY product_sizes_size_types;

ALTER TABLE products
    DROP FOREIGN KEY products_product_categories;

ALTER TABLE products
    DROP FOREIGN KEY products_units;

ALTER TABLE transactions
    DROP FOREIGN KEY transactions_events;

ALTER TABLE transactions
    DROP FOREIGN KEY transactions_products;

ALTER TABLE transactions
    DROP FOREIGN KEY transactions_size_types;

DROP TABLE crate_types;

DROP TABLE event_transfers;

DROP TABLE event_types;

DROP TABLE events;

DROP TABLE product_categories;

DROP TABLE product_crates;

DROP TABLE product_sizes;

DROP TABLE product_units;

DROP TABLE products;

DROP TABLE size_types;

DROP TABLE transactions;